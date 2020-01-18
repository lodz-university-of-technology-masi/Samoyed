package pl.lodz.p.samoyed.model;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBDocument;

import java.util.List;

@DynamoDBDocument
public class Evaluations {

    private String lang;
    private List<Boolean> evaluations;

    @DynamoDBAttribute(attributeName = "evaluations")
    public List<Boolean> getEvaluations() {
        return evaluations;
    }
    public void setEvaluations(List<Boolean> evaluations) {
        this.evaluations = evaluations;
    }

    @DynamoDBAttribute(attributeName = "lang")
    public String getLang() {
        return lang;
    }
    public void setLang(String lang) {
        this.lang = lang;
    }

}
