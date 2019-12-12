package pl.lodz.p.samoyed;

public class ApiException extends Exception {

    private int status = 500;

    public ApiException(String message) {
        super(message);
    }

    public ApiException(String message, int status) {
        super(message);
        this.status = status;
    }

    public int getStatus() {
        return status;
    }

}
