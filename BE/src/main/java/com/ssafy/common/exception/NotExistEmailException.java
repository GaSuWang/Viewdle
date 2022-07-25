package com.ssafy.common.exception;

import lombok.Getter;
import org.apache.http.HttpStatus;

@Getter
public class NotExistEmailException extends RuntimeException{
    private int status;
    private String message;

    public NotExistEmailException() {
        this.status = HttpStatus.SC_BAD_REQUEST;
        this.message = "이메일이 존재하지 않습니다.";
    }
}
