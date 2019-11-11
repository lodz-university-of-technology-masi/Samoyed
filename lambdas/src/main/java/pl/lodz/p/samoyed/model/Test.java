package pl.lodz.p.samoyed.model;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBHashKey;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBRangeKey;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable;

import java.util.List;

@DynamoDBTable(tableName="Tests")
public class Test {

    private Integer author;
    private String title;
    private Long createdOn;
    private List<Question> questions;

    @DynamoDBHashKey(attributeName="Author")
    public Integer getAuthor() {
        return author;
    }
    public void setAuthor(Integer author) {
        this.author = author;
    }

    @DynamoDBRangeKey(attributeName="Title")
    public String getTitle() {
        return title;
    }
    public void setTitle(String title) {
        this.title = title;
    }

    @DynamoDBAttribute(attributeName="CreatedOn")
    public Long getCreatedOn() {
        return createdOn;
    }
    public void setCreatedOn(Long createdOn) {
        this.createdOn = createdOn;
    }

    @DynamoDBAttribute(attributeName="Questions")
    public List<Question> getQuestions() {
        return questions;
    }
    public void setQuestions(List<Question> questions) {
        this.questions = questions;
    }
}
