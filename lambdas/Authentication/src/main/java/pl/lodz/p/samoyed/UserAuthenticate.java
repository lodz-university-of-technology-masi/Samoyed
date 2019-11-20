package pl.lodz.p.samoyed;

import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.cognitoidp.AWSCognitoIdentityProvider;
import com.amazonaws.services.cognitoidp.AWSCognitoIdentityProviderClientBuilder;
import com.amazonaws.services.cognitoidp.model.*;
import com.amazonaws.services.lambda.runtime.Context;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.Map;

public class UserAuthenticate {

    private class Tokens {

        String accessToken;
        String idToken;
        String refreshToken;

        public String getAccessToken() {
            return accessToken;
        }

        public String getIdToken() {
            return idToken;
        }

        public String getRefreshToken() {
            return refreshToken;
        }

    }

    private ObjectMapper om = new ObjectMapper();
    private CongitoConfig congitoConfig = new CongitoConfig();

    public ApiGatewayResponse login(Map<String, Object> input, Context context) {

        ApiGatewayResponse res = new ApiGatewayResponse();

        BasicAWSCredentials awsCreds = new BasicAWSCredentials(
                congitoConfig.getAwsAccessKey(),
                congitoConfig.getAwsSecretKey()
        );
        AWSCognitoIdentityProvider cognitoIdentityProvider = AWSCognitoIdentityProviderClientBuilder
                .standard()
                .withCredentials(new AWSStaticCredentialsProvider(awsCreds))
                .withRegion(Regions.US_EAST_1)
                .build();

        AdminInitiateAuthRequest initiateAuthRequest = new AdminInitiateAuthRequest();
        initiateAuthRequest.setAuthFlow(AuthFlowType.ADMIN_USER_PASSWORD_AUTH);
        initiateAuthRequest.setClientId(congitoConfig.getClientId());
        initiateAuthRequest.setUserPoolId(congitoConfig.getUserPoolId());
        initiateAuthRequest.addAuthParametersEntry("USERNAME", "m.dlubakowski@gmail.com");
        initiateAuthRequest.addAuthParametersEntry("PASSWORD", "Asd123Qwe");
        AdminInitiateAuthResult initiateAuthResult =
                cognitoIdentityProvider.adminInitiateAuth(initiateAuthRequest);

        Tokens tokens = new Tokens();
        tokens.accessToken = initiateAuthResult.getAuthenticationResult().getAccessToken();
        tokens.idToken = initiateAuthResult.getAuthenticationResult().getIdToken();
        tokens.refreshToken = initiateAuthResult.getAuthenticationResult().getRefreshToken();

        try {
            res.body = om.writeValueAsString(tokens);
        } catch (JsonProcessingException ex) {
            res.statusCode = 500;
            res.body = "{\"error\":\"" + ex.getMessage() + "\"}";
        }

        return res;

    }

}
