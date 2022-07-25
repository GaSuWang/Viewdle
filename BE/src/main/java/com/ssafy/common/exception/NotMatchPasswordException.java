package com.ssafy.common.exception;

import lombok.Getter;
import org.apache.http.HttpStatus;

@Getter
public class NotMatchPasswordException extends RuntimeException{
    private int status;
    private String message;

    public NotMatchPasswordException() {
        this.status = HttpStatus.SC_BAD_REQUEST;
        this.message = "비밀번호가 일치하지 않습니다.";
    }
}
