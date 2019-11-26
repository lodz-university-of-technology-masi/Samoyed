package pl.lodz.p.samoyed;

import java.util.Map;

public class ApiGatewayResponseBuilder {

    public interface Handler {
        void handle(ApiGatewayRequest req, ApiGatewayResponse res) throws Exception;
    }

    private ApiGatewayRequest request;
    private ApiGatewayResponse response = new ApiGatewayResponse();
    private Handler handler;

    public ApiGatewayResponseBuilder withRequestData(Map<String, Object> input) {
        this.request = new ApiGatewayRequest(input);
        return this;
    }

    public ApiGatewayResponseBuilder withHandler(Handler handler) {
        this.handler = handler;
        return this;
    }

    public ApiGatewayResponse handle() {
        try {
            this.handler.handle(request, response);
        } catch (Exception ex) {
            this.response.setError(500, ex);
        }
        return this.response;
    }

}
