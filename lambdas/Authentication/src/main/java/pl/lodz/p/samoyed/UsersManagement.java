package pl.lodz.p.samoyed;

import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.cognitoidp.AWSCognitoIdentityProvider;
import com.amazonaws.services.cognitoidp.AWSCognitoIdentityProviderClientBuilder;
import com.amazonaws.services.cognitoidp.model.AdminAddUserToGroupRequest;
import com.amazonaws.services.cognitoidp.model.AdminAddUserToGroupResult;
import com.amazonaws.services.cognitoidp.model.AdminConfirmSignUpRequest;
import com.amazonaws.services.cognitoidp.model.AdminConfirmSignUpResult;
import com.amazonaws.services.cognitoidp.model.AdminInitiateAuthRequest;
import com.amazonaws.services.cognitoidp.model.AdminInitiateAuthResult;
import com.amazonaws.services.cognitoidp.model.AttributeType;
import com.amazonaws.services.cognitoidp.model.AuthFlowType;
import com.amazonaws.services.cognitoidp.model.SignUpRequest;
import com.amazonaws.services.cognitoidp.model.SignUpResult;
import com.amazonaws.services.lambda.runtime.Context;
import com.fasterxml.jackson.databind.ObjectMapper;
import pl.lodz.p.samoyed.model.Credentials;
import pl.lodz.p.samoyed.model.Tokens;

import java.util.LinkedList;
import java.util.List;
import java.util.Map;

public class UsersManagement {

    private ObjectMapper om = new ObjectMapper();
    private CognitoConfig cognitoConfig = new CognitoConfig();

    public Response signIn(Map<String, Object> input, Context context) {

        return new ResponseBuilder()
            .withRequestData(input)
            .withHandler((Request req, Response res) -> {
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

            }).handle();

    }

    public Response signUp(Map<String, Object> input, Context context) {

        return new ResponseBuilder()
            .withRequestData(input)
            .withHandler((Request req, Response res) -> {
                AWSCognitoIdentityProvider cognitoIdentityProvider = obtainCognitoIdentityProvider();
                String body = (String) input.get("body");
                Map<String, String> attributes =
                        (Map<String, String>) om.readValue(body, Map.class);

                SignUpRequest signUpRequest = new SignUpRequest();
                signUpRequest.setClientId(cognitoConfig.getClientId());
                signUpRequest.setUsername(attributes.get("email"));
                signUpRequest.setPassword(attributes.get("password"));
                List<AttributeType> cognitoAttrs = new LinkedList<>();
                for (Map.Entry<String, String> i : attributes.entrySet()) {
                    if (!i.getKey().equals("email") && !i.getKey().equals("password")) {
                        cognitoAttrs.add(new AttributeType()
                                .withName(i.getKey())
                                .withValue(i.getValue()));
                    }
                }
                signUpRequest.setUserAttributes(cognitoAttrs);

                SignUpResult signUpResult = cognitoIdentityProvider.signUp(signUpRequest);
                AdminConfirmSignUpResult confirmResult = confirmSignUp(signUpRequest.getUsername());
                AdminAddUserToGroupResult gaddResult = addUserToGroup(
                        signUpRequest.getUsername(), "candidates");
            }).handle();

    }

    private AdminAddUserToGroupResult addUserToGroup(String username, String group) {

        AWSCognitoIdentityProvider cognitoIdentityProvider = obtainCognitoIdentityProvider();

        AdminAddUserToGroupRequest gaddRequest = new AdminAddUserToGroupRequest();
        gaddRequest.setUserPoolId(cognitoConfig.getUserPoolId());
        gaddRequest.setUsername(username);
        gaddRequest.setGroupName(group);

        return cognitoIdentityProvider.adminAddUserToGroup(gaddRequest);

    }

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

    private AdminConfirmSignUpResult confirmSignUp(String username) {
        Response res = new Response();
        AWSCognitoIdentityProvider cognitoIdentityProvider = obtainCognitoIdentityProvider();

        AdminConfirmSignUpRequest confirmRequest = new AdminConfirmSignUpRequest();
        confirmRequest.setUserPoolId(cognitoConfig.getUserPoolId());
        confirmRequest.setUsername(username);
        return cognitoIdentityProvider.adminConfirmSignUp(confirmRequest);
    }

}
