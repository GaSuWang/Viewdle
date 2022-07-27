package com.ssafy.common.exception;

import lombok.Getter;
import org.apache.http.HttpStatus;

@Getter
public class SamePasswordException extends RuntimeException{
    private int status;
    private String message;

    public SamePasswordException() {
        this.status = HttpStatus.SC_BAD_REQUEST;
        this.message = "이전 비밀번호와 동일합니다.";
    }
}
