package pl.lodz.p.samoyed;

import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;
import com.amazonaws.services.lambda.runtime.Context;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import pl.lodz.p.samoyed.model.Question;
import pl.lodz.p.samoyed.model.Test;
import java.util.LinkedHashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

public class RecruitmentTests {

    private AmazonDynamoDB client = AmazonDynamoDBClientBuilder.standard().build();
    private DynamoDBMapper mapper = new DynamoDBMapper(client);
    private ObjectMapper om = new ObjectMapper();

    public ApiGatewayResponse add(Map<String, Object> input, Context context) {

        ApiGatewayResponse response = new ApiGatewayResponse();

        Map<String, String> queryParams = (LinkedHashMap<String, String>) input.get("queryStringParameters");

        Test test = new Test();
        test.setAuthor(Integer.parseInt(queryParams.get("Author")));
        test.setTitle(queryParams.get("Title"));
        test.setCreatedOn(System.currentTimeMillis());
        List<Question> questions = new LinkedList<Question>();
        questions.add(new Question("W", "PL", "Question 1", "Answer 1|Answer 2"));
        questions.add(new Question("W", "EN", "Question 2", "Answer 1|Answer 2"));
        questions.add(new Question("W", "PL", "Question 3", "Answer 1|Answer 2"));
        test.setQuestions(questions);
        mapper.save(test);

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
            response.headers.put("Content-type", "text/html");
            return response;
        } catch (JsonProcessingException ex) {
            response.body = ex.getMessage();
            return response;
        }

    }

}
