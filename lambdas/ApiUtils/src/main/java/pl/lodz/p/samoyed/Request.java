package pl.lodz.p.samoyed;

import java.util.LinkedHashMap;
import java.util.Map;

public class Request {

    private String httpMethod;
    private Map<String, String> headers;
    private String body;
    private Map<String, Object> pathParameters;

    public Request(Map<String, Object> input) {
        this.httpMethod = (String) input.get("httpMethod");
        this.headers = (Map<String, String>) input.get("headers");
        this.body = (String) input.get("body");
        pathParameters = (LinkedHashMap<String, Object>) input.get("pathParameters");
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

    public Map<String, Object> getPathParameters() {
        return pathParameters;
    }

    public String getCognitoIdToken() {
        if (this.headers.containsKey("Authorization")) {
            String[] authHeader = this.headers.get("Authorization").split(" ");
            if (authHeader[0].equals("Bearer")) {
                return authHeader[1];
            }
        }
        return "";
    }

}
