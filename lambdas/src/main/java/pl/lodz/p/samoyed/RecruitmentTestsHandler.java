package pl.lodz.p.samoyed;

import com.amazonaws.services.lambda.runtime.Context;
import java.util.Map;

public class RecruitmentTestsHandler {

    public ApiGatewayResponse myHandler(Map<String, Object> input, Context context) {

        ApiGatewayResponse res = new ApiGatewayResponse();
        res.body = "Hello World!";
        res.headers.put("Content-type", "text/html");

        return res;

    }

}
