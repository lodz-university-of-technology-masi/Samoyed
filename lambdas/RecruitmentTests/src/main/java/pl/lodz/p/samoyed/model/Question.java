package pl.lodz.p.samoyed.model;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBDocument;

@DynamoDBDocument
public class Question {

    private String type;
    private String content;
    private String answers;

    public Question()
    {
    }

    public Question(String type, String contents, String answers) {
        this.type = type;
        this.content = contents;
        this.answers = answers;
    }

    @DynamoDBAttribute(attributeName = "Type")
    public String getType() {
        return type;
    }
    public void setType(String type) {
        this.type = type;
    }

    @DynamoDBAttribute(attributeName = "Content")
    public String getContent() {
        return content;
    }
    public void setContent(String content) {
        this.content = content;
    }

    @DynamoDBAttribute(attributeName = "Answers")
    public String getAnswers() {
        return answers;
    }
    public void setAnswers(String answers) {
        this.answers = answers;
    }

}
