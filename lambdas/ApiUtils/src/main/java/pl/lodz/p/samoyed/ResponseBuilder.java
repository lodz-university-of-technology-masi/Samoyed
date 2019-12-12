package pl.lodz.p.samoyed;

import java.util.Map;

public class ResponseBuilder {

    public interface Handler {
        void handle(Request req, Response res) throws Exception;
    }

    private Request request;
    private Response response = new Response();
    private Handler handler;

    public ResponseBuilder withRequestData(Map<String, Object> input) {
        this.request = new Request(input);
        return this;
    }

    public ResponseBuilder withHandler(Handler handler) {
        this.handler = handler;
        return this;
    }

    public Response handle() {
        try {
            this.handler.handle(request, response);
        } catch (ApiException ex) {
            response.statusCode = ex.getStatus();
            response.body = "{";
            response.body += "\"error\":\"" + ex.getMessage() + "\"";
            response.body += ", \"name\":\"" + ex.getClass().getName() + "\"";
            response.body += "}";
        } catch (Exception ex) {
            response.statusCode = 500;
            response.body = "{";
            response.body += "\"error\":\"" + ex.getMessage() + "\"";
            response.body += ", \"name\":\"" + ex.getClass().getName() + "\"";
            response.body += "}";
        }
        return response;
    }

}
