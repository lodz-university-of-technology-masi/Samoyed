package pl.lodz.p.samoyed;

import java.util.Map;

public class ApiGatewayRequest {

    private String httpMethod;
    private Map<String, String> headers;
    private String body;

    public ApiGatewayRequest(Map<String, Object> input) {
        this.httpMethod = (String) input.get("httpMethod");
        this.headers = (Map<String, String>) input.get("headers");
        this.body = (String) input.get("body");
    }

    public String getHttpMethod() {
        return httpMethod;
    }

    public Map<String, String> getHeaders() {
        return headers;
    }

    public String getBody() {
        return body;
    }

    public String getCognitoIdToken() {
        if (this.headers.containsKey("Authorization")) {
            String[] authHeader = this.headers.get("Authorization").split(" ");
            return authHeader[1];
        }
        else return "";
    }

}
