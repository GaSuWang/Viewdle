package com.ssafy.common.exception;

import lombok.Getter;
import org.apache.http.HttpStatus;

@Getter
public class CoverLetterRegistFailedException extends RuntimeException{
    private int status;
    private String message;

    public CoverLetterRegistFailedException(){
        int status = HttpStatus.SC_BAD_REQUEST;
        String message = "자기소개서 등록에 실패했습니다.";
    }

}
