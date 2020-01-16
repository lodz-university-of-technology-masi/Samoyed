package pl.lodz.p.samoyed.model;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBDocument;

import java.util.List;

@DynamoDBDocument
public class SolvedTestContent {

    private String lang;
    private String title;
    private List<Question> questions;
    private List<Boolean> evaluations;

    @DynamoDBAttribute(attributeName="Lang")
    public String getLang() {
        return lang;
    }
    public void setLang(String lang) {
        this.lang = lang;
    }

    @DynamoDBAttribute(attributeName="Title")
    public String getTitle() {
        return title;
    }
    public void setTitle(String title) {
        this.title = title;
    }

    @DynamoDBAttribute(attributeName="Questions")
    public List<Question> getQuestions() {
        return questions;
    }
    public void setQuestions(List<Question> questions) {
        this.questions = questions;
    }

    @DynamoDBAttribute(attributeName="Evaluations")
    public List<Boolean> getEvaluations() { return evaluations; }
    public void setEvaluations(List<Boolean> evaluations) { this.evaluations = evaluations; }
}
