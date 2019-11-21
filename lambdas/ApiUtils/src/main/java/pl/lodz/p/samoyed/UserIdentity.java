package pl.lodz.p.samoyed;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.auth0.jwt.interfaces.RSAKeyProvider;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Map;

public class UserIdentity {

    private String userId;
    private String email;
    private List<String> groups;
    private String idToken;

    public UserIdentity(String idToken) throws Exception {
        //Verify the token
        String iss = "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_qLdxbMhyS";
        RSAKeyProvider provider = new CognitoKeyProvider("https://cognito-idp.us-east-1.amazonaws.com/us-east-1_qLdxbMhyS/.well-known/jwks.json");
        Algorithm algo = Algorithm.RSA256(provider);
        JWTVerifier verifier = JWT.require(algo).build();
        DecodedJWT jwt = verifier.verify(idToken);
        //Parse values
        String bodyJson = new String(Base64.getDecoder().decode(jwt.getPayload()));
        ObjectMapper om = new ObjectMapper();
        Map<String, Object> tokenValues = om.readValue(bodyJson, Map.class);
        this.userId = (String) tokenValues.get("cognito:username");
        this.email = (String) tokenValues.get("email");
        this.groups = (ArrayList<String>) tokenValues.get("cognito:groups");
        this.idToken = idToken;
    }

    public String getUserId() {
        return userId;
    }

    public String getEmail() {
        return email;
    }

    public List<String> getGroups() {
        return groups;
    }

    public String getIdToken() {
        return idToken;
    }

}
