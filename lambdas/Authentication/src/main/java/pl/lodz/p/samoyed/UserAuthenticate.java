package pl.lodz.p.samoyed;

import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.cognitoidp.AWSCognitoIdentityProvider;
import com.amazonaws.services.cognitoidp.AWSCognitoIdentityProviderClientBuilder;
import com.amazonaws.services.cognitoidp.model.AdminConfirmSignUpRequest;
import com.amazonaws.services.cognitoidp.model.AdminConfirmSignUpResult;
import com.amazonaws.services.cognitoidp.model.AdminInitiateAuthRequest;
import com.amazonaws.services.cognitoidp.model.AdminInitiateAuthResult;
import com.amazonaws.services.cognitoidp.model.AuthFlowType;
import com.amazonaws.services.cognitoidp.model.SignUpRequest;
import com.amazonaws.services.cognitoidp.model.SignUpResult;
import com.amazonaws.services.lambda.runtime.Context;
import com.fasterxml.jackson.databind.ObjectMapper;
import pl.lodz.p.samoyed.model.Credentials;
import pl.lodz.p.samoyed.model.Tokens;

import java.util.Map;

public class UserAuthenticate {

    private ObjectMapper om = new ObjectMapper();
    private CongitoConfig cognitoConfig = new CongitoConfig();

    private AWSCognitoIdentityProvider obtainCognitoIdentityProvider() {
        BasicAWSCredentials awsCreds = new BasicAWSCredentials(
                cognitoConfig.getAwsAccessKey(),
                cognitoConfig.getAwsSecretKey()
        );
        return AWSCognitoIdentityProviderClientBuilder
                .standard()
                .withCredentials(new AWSStaticCredentialsProvider(awsCreds))
                .withRegion(Regions.US_EAST_1)
                .build();
    }

    public ApiGatewayResponse signIn(Map<String, Object> input, Context context) {

        ApiGatewayResponse res = new ApiGatewayResponse();

        try {
            AWSCognitoIdentityProvider cognitoIdentityProvider = obtainCognitoIdentityProvider();
            String body = (String) input.get("body");
            Credentials credentials = om.readValue(body, Credentials.class);

            AdminInitiateAuthRequest initiateAuthRequest = new AdminInitiateAuthRequest();
            initiateAuthRequest.setAuthFlow(AuthFlowType.ADMIN_USER_PASSWORD_AUTH);
            initiateAuthRequest.setClientId(cognitoConfig.getClientId());
            initiateAuthRequest.setUserPoolId(cognitoConfig.getUserPoolId());
            initiateAuthRequest.addAuthParametersEntry("USERNAME", credentials.getUsername());
            initiateAuthRequest.addAuthParametersEntry("PASSWORD", credentials.getPassword());
            AdminInitiateAuthResult initiateAuthResult =
                    cognitoIdentityProvider.adminInitiateAuth(initiateAuthRequest);

            Tokens tokens = new Tokens();
            tokens.setAccessToken(initiateAuthResult.getAuthenticationResult().getAccessToken());
            tokens.setIdToken(initiateAuthResult.getAuthenticationResult().getIdToken());
            tokens.setRefreshToken(initiateAuthResult.getAuthenticationResult().getRefreshToken());

            res.body = om.writeValueAsString(tokens);
        } catch (Exception ex) {
            res.setError(500, ex);
        }

        return res;

    }

    public ApiGatewayResponse signUp(Map<String, Object> input, Context context) {

        ApiGatewayResponse res = new ApiGatewayResponse();

        try {
            AWSCognitoIdentityProvider cognitoIdentityProvider = obtainCognitoIdentityProvider();
            String body = (String) input.get("body");
            Credentials credentials = om.readValue(body, Credentials.class);

            SignUpRequest signUpRequest = new SignUpRequest();
            signUpRequest.setClientId(cognitoConfig.getClientId());
            signUpRequest.setUsername(credentials.getUsername());
            signUpRequest.setPassword(credentials.getPassword());

            SignUpResult signUpResult = cognitoIdentityProvider.signUp(signUpRequest);
            AdminConfirmSignUpResult confirmResult = confirmSignUp(credentials.getUsername());
        } catch (Exception ex) {
            res.setError(500, ex);
        }

        return res;
    }

    private AdminConfirmSignUpResult confirmSignUp(String username) {
        ApiGatewayResponse res = new ApiGatewayResponse();
        AWSCognitoIdentityProvider cognitoIdentityProvider = obtainCognitoIdentityProvider();

        AdminConfirmSignUpRequest confirmRequest = new AdminConfirmSignUpRequest();
        confirmRequest.setUserPoolId(cognitoConfig.getUserPoolId());
        confirmRequest.setUsername(username);
        return cognitoIdentityProvider.adminConfirmSignUp(confirmRequest);
    }

}
