package pl.lodz.p.samoyed;

import java.util.Map;
import java.util.TreeMap;

public class ApiGatewayResponse {

    public int statusCode;
    public String body = "";
    public Map<String, String> headers;
    public final boolean isBase64Encoded = false;

    public ApiGatewayResponse() {
        this.statusCode = 200;
        this.headers = new TreeMap<String, String>();
    }

    public int getStatusCode() {
        return statusCode;
    }

    public String getBody() {
        return body;
    }

    public Map<String, String> getHeaders() {
        return headers;
    }

    public boolean isBase64Encoded() {
        return isBase64Encoded;
    }

}
