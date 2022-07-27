package com.ssafy.common.exception;

import lombok.Getter;
import org.apache.http.HttpStatus;

@Getter
public class NotExistUserException extends RuntimeException{
    private int status;
    private String message;

    public NotExistUserException() {
        this.status = HttpStatus.SC_BAD_REQUEST;
        this.message = "회원이 존재하지 않습니다.";
    }
}
