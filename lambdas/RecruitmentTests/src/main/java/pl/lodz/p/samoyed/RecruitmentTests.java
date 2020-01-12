package pl.lodz.p.samoyed;

import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBDeleteExpression;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBScanExpression;
import com.amazonaws.services.dynamodbv2.model.AttributeValue;
import com.amazonaws.services.dynamodbv2.model.ExpectedAttributeValue;
import com.amazonaws.services.lambda.runtime.Context;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.ObjectMapper;
import pl.lodz.p.samoyed.model.Test;
import pl.lodz.p.samoyed.model.TestContent;

import java.util.List;
import java.util.Map;

public class RecruitmentTests {

    private AmazonDynamoDB client = AmazonDynamoDBClientBuilder.standard().build();
    private DynamoDBMapper mapper = new DynamoDBMapper(client);
    private ObjectMapper om = new ObjectMapper();

    public Response add(Map<String, Object> input, Context context) {

        return new ResponseBuilder()
            .withRequestData(input)
            .withHandler((Request req, Response res) -> {
                res.headers.put("Content-type", "application/json");
                UserIdentity user = new UserIdentity(req.getCognitoIdToken());
                if (user.getGroups().contains("recruiters")) {
                    Test test = om.readValue(req.getBody(), Test.class);
                    test.setAuthor(user.getUserId());
                    test.setCreatedOn(System.currentTimeMillis());
                    mapper.save(test);
                    res.body = om.writeValueAsString(test);
                    res.statusCode = 201;
                } else {
                    throw new ApiException("You must be recruiter to perform this action.");
                }
            }).handle();

    }

    public Response update(Map<String, Object> input, Context context) {
        return new ResponseBuilder()
                .withRequestData(input)
                .withHandler((Request req, Response res) -> {
                    String testId = (String) req.getPathParameters().get("id");
                    Test test = mapper.load(Test.class, testId);
                    if (test == null) {
                        throw new ApiException("Test does not exist.", 404);
                    }
                    UserIdentity user = new UserIdentity(req.getCognitoIdToken());
                    if (user.getGroups().contains("recruiters")) {
                        test = om.readValue(req.getBody(), Test.class);
                        test.setAuthor(user.getUserId());
                        test.setCreatedOn(System.currentTimeMillis());
                        test.setId(testId);
                        mapper.save(test);
                        res.body = om.writeValueAsString(test);
                        res.statusCode = 204;
                    } else {
                        throw new ApiException("You must be recruiter to perform this action.");
                    }
                    res.headers.put("Content-type", "application/json");
                }).handle();
    }

    public Response fetch(Map<String, Object> input, Context context) {

        return new ResponseBuilder()
            .withRequestData(input)
            .withHandler((Request req, Response res) -> {
                String testId = (String) req.getPathParameters().get("id");
                Test test = mapper.load(Test.class, testId);
                if (test == null) {
                    throw new ApiException("Test does not exist.", 404);
                }
                res.body = om.writeValueAsString(test);
                res.headers.put("Content-type", "application/json");
            }).handle();

    }

    public Response fetchAll(Map<String, Object> input, Context context) {

        return new ResponseBuilder()
            .withRequestData(input)
            .withHandler((Request req, Response res) -> {
//                UserIdentity user = new UserIdentity(req.getCognitoIdToken());
                om.setSerializationInclusion(JsonInclude.Include.NON_NULL);
                DynamoDBScanExpression exp = new DynamoDBScanExpression();
                List<Test> tests = mapper.scan(Test.class, exp);
                for (Test t : tests) {
                    for (TestContent tc : t.getVersions()) {
                        tc.setQuestions(null);
                    }
                }
                res.body = om.writeValueAsString(tests);
                res.headers.put("Content-type", "application/json");
            }).handle();

    }

    public Response delete(Map<String, Object> input, Context context) {

        return new ResponseBuilder()
            .withRequestData(input)
            .withHandler((Request req, Response res) -> {
                UserIdentity user = new UserIdentity(req.getCognitoIdToken());
                String testId = (String) req.getPathParameters().get("id");
                Test test = mapper.load(Test.class, testId);
                ExpectedAttributeValue userId = new ExpectedAttributeValue();
                userId.setValue(new AttributeValue(user.getUserId()));
                DynamoDBDeleteExpression expr = new DynamoDBDeleteExpression()
                        .withExpectedEntry("Author", userId);
                mapper.delete(test, expr);
            }).handle();

    }

}
