package com.ssafy.common.exception;

import lombok.Getter;
import org.apache.http.HttpStatus;

@Getter
public class AlreadyExistEmailException extends RuntimeException{
    private int status;
    private String message;

    public AlreadyExistEmailException() {
        this.status = HttpStatus.SC_BAD_REQUEST;
        this.message = "이미 존재하는 이메일입니다.";
    }
}
