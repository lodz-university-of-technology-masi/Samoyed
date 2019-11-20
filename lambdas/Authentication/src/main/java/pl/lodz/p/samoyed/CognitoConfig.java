package pl.lodz.p.samoyed;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

public class CognitoConfig {

    private String awsAccessKey = "";
    private String awsSecretKey = "";
    private String clientId = "";
    private String userPoolId = "";

    public CognitoConfig() {
        try {
            Properties props = new Properties();
            InputStream input = getClass().getClassLoader().getResourceAsStream("cognito.properties");
            props.load(input);
            awsAccessKey = props.getProperty("AWS_ACCESS_KEY");
            awsSecretKey = props.getProperty("AWS_SECRET_KEY");
            clientId = props.getProperty("CLIENT_ID");
            userPoolId = props.getProperty("USER_POOL_ID");
        } catch (IOException ex) {
            //
        }
    }

    public String getAwsAccessKey() {
        return awsAccessKey;
    }

    public String getAwsSecretKey() {
        return awsSecretKey;
    }

    public String getClientId() {
        return clientId;
    }

    public String getUserPoolId() {
        return userPoolId;
    }
}
