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

import java.util.*;

public class RecruitmentTests {

    private AmazonDynamoDB client = AmazonDynamoDBClientBuilder.standard().build();
    private DynamoDBMapper mapper = new DynamoDBMapper(client);
    private ObjectMapper om = new ObjectMapper();

    public ApiGatewayResponse add(Map<String, Object> input, Context context) {

        ApiGatewayResponse response = new ApiGatewayResponse();

        try {
            String body = (String) input.get("body");
            Test test = om.readValue(body, Test.class);
            test.setCreatedOn(System.currentTimeMillis());
            mapper.save(test);
            response.body = om.writeValueAsString(test);
        } catch (Exception ex) {
            response.body = ex.getMessage();
            return response;
        }

        response.statusCode = 201;
        response.headers.put("Content-type", "text/html");
        return response;

    }

    public ApiGatewayResponse fetch(Map<String, Object> input, Context context) {

        ApiGatewayResponse response = new ApiGatewayResponse();

        try {
            Map<String, Object> pathParameters = (LinkedHashMap<String, Object>) input.get("pathParameters");
            String testId = (String) pathParameters.get("id");
            Test test = mapper.load(Test.class, testId);
            response.body = om.writeValueAsString(test);
            response.headers.put("Content-type", "application/json");
            return response;
        } catch (JsonProcessingException ex) {
            response.body = ex.getMessage();
            return response;
        }

    }

    public ApiGatewayResponse fetchAll(Map<String, Object> input, Context context) {

        ApiGatewayResponse response = new ApiGatewayResponse();

        try {
            om.setSerializationInclusion(JsonInclude.Include.NON_NULL);
            DynamoDBScanExpression exp = new DynamoDBScanExpression();
            exp.setProjectionExpression("Id,Title");
            List<Test> test = mapper.scan(Test.class, exp);
            response.body = om.writeValueAsString(test);
            response.headers.put("Content-type", "application/json");
            return response;
        } catch (JsonProcessingException ex) {
            response.body = ex.getMessage();
            return response;
        }

    }

}
