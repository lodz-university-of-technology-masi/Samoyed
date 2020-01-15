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
import pl.lodz.p.samoyed.model.*;

import java.util.LinkedList;
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


    public Response fetchAllForUser(Map<String, Object> input, Context context) {

        return new ResponseBuilder()
                .withRequestData(input)
                .withHandler((Request req, Response res) -> {
                    if(req.getCognitoIdToken() == null) res.body = "User not logged";
                    else {
                        UserIdentity user = new UserIdentity(req.getCognitoIdToken());
                        om.setSerializationInclusion(JsonInclude.Include.NON_NULL);
                        if (user.getGroups().contains("recruiters")) {
                            DynamoDBScanExpression exp = new DynamoDBScanExpression()
                                    .withFilterExpression("Author = :user")
                                    .addExpressionAttributeValuesEntry(":user", new AttributeValue(user.getUserId()));
                            List<Test> tests = mapper.scan(Test.class, exp);
                            for (Test t : tests) {
                                for (TestContent tc : t.getVersions()) {
                                    tc.setQuestions(null);
                                }
                            }
                            res.body = om.writeValueAsString(tests);
                        }
                        if(user.getGroups().contains("candidates")) {
                            DynamoDBScanExpression exp = new DynamoDBScanExpression();
                            List<Test> tests = mapper.scan(Test.class, exp);
                            List<Test> testsUser = new LinkedList<>();
                            for (Test t : tests) {
                                for (TestContent tc : t.getVersions()) {
                                    tc.setQuestions(null);
                                }
                                if (t.getAssignments() == null) continue;
                                for (Assignment ass : t.getAssignments()) {
                                    if (ass.getAssigneeId().equals(user.getUserId())) {
                                        testsUser.add(t);
                                    }
                                }
                            }
                            res.body = om.writeValueAsString(testsUser);
                        }
                    }

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

    public Response addSolvedTest(Map<String, Object> input, Context context) {

        return new ResponseBuilder()
                .withRequestData(input)
                .withHandler((Request req, Response res) -> {
                    res.headers.put("Content-type", "application/json");
                    UserIdentity user = new UserIdentity(req.getCognitoIdToken());
                    if (user.getGroups().contains("candidates")) {
                        SolvedTest solvedTest = om.readValue(req.getBody(), SolvedTest.class);
                        solvedTest.setSolvedBy(user.getUserId());
                        solvedTest.setSolvedOn(System.currentTimeMillis());
                        mapper.save(solvedTest);
                        res.body = om.writeValueAsString(solvedTest);
                        res.statusCode = 201;
                    } else {
                        throw new ApiException("You must be candidate to perform this action.");
                    }
                }).handle();

    }

    public Response fetchSolvedTest(Map<String, Object> input, Context context) {

        return new ResponseBuilder()
                .withRequestData(input)
                .withHandler((Request req, Response res) -> {
                    String testId = (String) req.getPathParameters().get("id");
                    SolvedTest solvedTest = mapper.load(SolvedTest.class, testId);
                    if (solvedTest == null) {
                        throw new ApiException("Test does not exist.", 404);
                    }
                    res.body = om.writeValueAsString(solvedTest);
                    res.headers.put("Content-type", "application/json");
                }).handle();

    }

    public Response fetchAllSolvedTests(Map<String, Object> input, Context context) {

        return new ResponseBuilder()
                .withRequestData(input)
                .withHandler((Request req, Response res) -> {
                    om.setSerializationInclusion(JsonInclude.Include.NON_NULL);
                    DynamoDBScanExpression exp = new DynamoDBScanExpression();
                    List<SolvedTest> solvedTests = mapper.scan(SolvedTest.class, exp);
                    for (SolvedTest t : solvedTests) {
                        for (SolvedTestContent tc : t.getVersions()) {
                            tc.setQuestions(null);
                            tc.setEvaluations(null);
                        }
                    }
                    res.body = om.writeValueAsString(solvedTests);
                    res.headers.put("Content-type", "application/json");
                }).handle();

    }

    public Response fetchAllSolvedTestsForUser(Map<String, Object> input, Context context) {

        return new ResponseBuilder()
                .withRequestData(input)
                .withHandler((Request req, Response res) -> {
                    UserIdentity user = new UserIdentity(req.getCognitoIdToken());
                    om.setSerializationInclusion(JsonInclude.Include.NON_NULL);
                    DynamoDBScanExpression exp = new DynamoDBScanExpression()
                            .withFilterExpression("solvedBy = :user")
                            .addExpressionAttributeValuesEntry(":user", new AttributeValue(user.getUserId()));
                    List<SolvedTest> solvedTests = mapper.scan(SolvedTest.class, exp);
                    for (SolvedTest t : solvedTests) {
                        for (SolvedTestContent tc : t.getVersions()) {
                            tc.setQuestions(null);
                            tc.setEvaluations(null);
                        }
                    }
                    res.body = om.writeValueAsString(solvedTests);
                    res.headers.put("Content-type", "application/json");
                }).handle();

    }

    public Response fetchAllSolvedTestsForRecruiter(Map<String, Object> input, Context context) {

        return new ResponseBuilder()
                .withRequestData(input)
                .withHandler((Request req, Response res) -> {
                    UserIdentity user = new UserIdentity(req.getCognitoIdToken());
                    om.setSerializationInclusion(JsonInclude.Include.NON_NULL);

                    DynamoDBScanExpression exp = new DynamoDBScanExpression()
                            .withFilterExpression("Author = :user")
                            .addExpressionAttributeValuesEntry(":user", new AttributeValue(user.getUserId()));
                    List<Test> tests = mapper.scan(Test.class, exp);

                    DynamoDBScanExpression expSolved = new DynamoDBScanExpression();
                    List<SolvedTest> solvedTests = mapper.scan(SolvedTest.class, expSolved);

                    List<SolvedTest> solvedTestsForRecruiter = new LinkedList<>();

                    for (Test t : tests) {
                        for (SolvedTest st : solvedTests) {
                            if(st.getTestId() == null) continue;
                            if(t.getId().equals(st.getTestId())) {
                                solvedTestsForRecruiter.add(st);
                            }
                        }
                    }

                    res.body = om.writeValueAsString(solvedTestsForRecruiter);
                    res.headers.put("Content-type", "application/json");
                }).handle();

    }

    public Response evaluateTest(Map<String, Object> input, Context context) {
        return new ResponseBuilder()
                .withRequestData(input)
                .withHandler((Request req, Response res) -> {
                    String solvedTestId = (String) req.getPathParameters().get("id");
                    SolvedTest solvedTest = mapper.load(SolvedTest.class, solvedTestId);
                    if (solvedTest == null) {
                        throw new ApiException("Test does not exist.", 404);
                    }

                    String id = solvedTest.getId();
                    String solvedBy = solvedTest.getSolvedBy();
                    Long solvedOn = solvedTest.getSolvedOn();
                    String testId = solvedTest.getTestId();
                    List<SolvedTestContent> versions = solvedTest.getVersions();

                    UserIdentity user = new UserIdentity(req.getCognitoIdToken());
                    if (user.getGroups().contains("recruiters")) {
                        solvedTest = om.readValue(req.getBody(), SolvedTest.class);
                        solvedTest.setSolvedBy(solvedBy);
                        solvedTest.setSolvedOn(solvedOn);
                        solvedTest.setId(id);
                        solvedTest.setTestId(testId);
                        solvedTest.setVersions(versions);
                        mapper.save(solvedTest);
                        res.body = om.writeValueAsString(solvedTest);
                        res.statusCode = 204;
                    } else {
                        throw new ApiException("You must be recruiter to perform this action.");
                    }
                    res.headers.put("Content-type", "application/json");
                }).handle();
    }

}
