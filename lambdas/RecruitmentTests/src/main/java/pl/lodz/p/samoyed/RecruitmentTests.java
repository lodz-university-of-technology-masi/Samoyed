package pl.lodz.p.samoyed;

import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBScanExpression;
import com.amazonaws.services.lambda.runtime.Context;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import pl.lodz.p.samoyed.model.Test;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public class RecruitmentTests {

    private AmazonDynamoDB client = AmazonDynamoDBClientBuilder.standard().build();
    private DynamoDBMapper mapper = new DynamoDBMapper(client);
    private ObjectMapper om = new ObjectMapper();

    public ApiGatewayResponse add(Map<String, Object> input, Context context) {

        ApiGatewayRequest req = new ApiGatewayRequest(input);
        ApiGatewayResponse res = new ApiGatewayResponse();
        res.headers.put("Content-type", "application/json");

        try {
            UserIdentity user = new UserIdentity(req.getCognitoIdToken());
            if (user.getGroups().contains("recruiters")) {
                Test test = om.readValue(req.getBody(), Test.class);
                test.setAuthor(user.getUserId());
                test.setCreatedOn(System.currentTimeMillis());
                mapper.save(test);
                res.body = om.writeValueAsString(test);
                res.statusCode = 201;
            } else {
                throw new Exception("You must be recruiter to perform this action!");
            }
        } catch (Exception ex) {
            res.setError(500, ex);
        }

        return res;

    }

    public ApiGatewayResponse fetch(Map<String, Object> input, Context context) {

        ApiGatewayRequest req = new ApiGatewayRequest(input);
        ApiGatewayResponse res = new ApiGatewayResponse();

        try {
            Map<String, Object> pathParameters = (LinkedHashMap<String, Object>) input.get("pathParameters");
            String testId = (String) pathParameters.get("id");
            Test test = mapper.load(Test.class, testId);
            res.body = om.writeValueAsString(test);
            res.headers.put("Content-type", "application/json");
            return res;
        } catch (JsonProcessingException ex) {
            res.body = ex.getMessage();
            return res;
        }

    }

    public ApiGatewayResponse fetchAll(Map<String, Object> input, Context context) {

        ApiGatewayRequest req = new ApiGatewayRequest(input);
        ApiGatewayResponse res = new ApiGatewayResponse();

        try {
            om.setSerializationInclusion(JsonInclude.Include.NON_NULL);
            DynamoDBScanExpression exp = new DynamoDBScanExpression();
            exp.setProjectionExpression("Id,Title");
            List<Test> test = mapper.scan(Test.class, exp);
            res.body = om.writeValueAsString(test);
            res.headers.put("Content-type", "application/json");
            return res;
        } catch (JsonProcessingException ex) {
            res.body = ex.getMessage();
            return res;
        }

    }

}
