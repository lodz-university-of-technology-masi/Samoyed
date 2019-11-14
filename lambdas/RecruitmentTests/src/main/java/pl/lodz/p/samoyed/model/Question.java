package pl.lodz.p.samoyed.model;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBDocument;

@DynamoDBDocument
public class Question {

    private String type;
    private String lang;
    private String content;
    private String answers;

    public Question()
    {
    }

    public Question(String type, String lang, String contents, String answers) {
        this.type = type;
        this.lang = lang;
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

    @DynamoDBAttribute(attributeName = "Lang")
    public String getLang() {
        return lang;
    }
    public void setLang(String lang) {
        this.lang = lang;
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
