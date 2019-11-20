package pl.lodz.p.samoyed;

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

    public UserIdentity(String idToken) {
        try {
            String[] split = idToken.split("\\.");
            String bodyJson = new String(Base64.getDecoder().decode(split[1]));
            ObjectMapper om = new ObjectMapper();
            Map<String, Object> tokenValues = om.readValue(bodyJson, Map.class);
            this.userId = (String) tokenValues.get("cognito:username");
            this.email = (String) tokenValues.get("email");
            this.groups = (ArrayList<String>) tokenValues.get("cognito:groups");
            this.idToken = idToken;
        } catch (Exception ex) {
            // TODO
        }
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
