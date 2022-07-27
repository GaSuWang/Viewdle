package com.ssafy.api.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CoverLetterPutReq {
    private int coverLetterSeq;
    private String coverLetterTitle;
    private String coverLetterContent;
}
