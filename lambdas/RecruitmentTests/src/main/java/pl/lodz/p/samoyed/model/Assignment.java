package pl.lodz.p.samoyed.model;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBDocument;

@DynamoDBDocument
public class Assignment {

    private String assigneeId;
    private Long availableFrom;
    private Long availableTo;

    @DynamoDBAttribute(attributeName = "AssigneeId")
    public String getAssigneeId() {
        return assigneeId;
    }
    public void setAssigneeId(String assigneeId) {
        this.assigneeId = assigneeId;
    }

    @DynamoDBAttribute(attributeName = "AvailableFrom")
    public Long getAvailableFrom() {
        return availableFrom;
    }
    public void setAvailableFrom(Long availableFrom) {
        this.availableFrom = availableFrom;
    }

    @DynamoDBAttribute(attributeName = "AvailableTo")
    public Long getAvailableTo() {
        return availableTo;
    }
    public void setAvailableTo(Long availableTo) {
        this.availableTo = availableTo;
    }

}
