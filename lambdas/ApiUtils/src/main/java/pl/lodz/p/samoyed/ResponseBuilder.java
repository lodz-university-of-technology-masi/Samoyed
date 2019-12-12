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
        } catch (Exception ex) {
            this.response.setError(500, ex);
        }
        return this.response;
    }

}
