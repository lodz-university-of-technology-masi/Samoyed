package pl.lodz.p.samoyed;

import java.util.Map;
import java.util.TreeMap;

public class Response {

    public int statusCode = 200;
    public String body = "";
    public Map<String, String> headers = new TreeMap<String, String>();
    private final boolean isBase64Encoded = false;

    public Response() {
        this.headers.put("Access-Control-Allow-Origin", "*");
    }

    public void setError(int statusCode, Exception exception) {
        this.statusCode = statusCode;
        this.body = "{\"error\":\"" + exception.getMessage() + "\"}";
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
