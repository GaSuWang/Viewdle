package com.ssafy.api.response;

import com.ssafy.db.entity.CoverLetter;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CoverLetterRes {
    int coverLetterSeq;
    String coverLetterTitle;
    String coverLetterContent;
    String coverLetterRegTime;

    public static CoverLetterRes of(CoverLetter coverLetter){
        CoverLetterRes res = new CoverLetterRes();
        res.setCoverLetterSeq(coverLetter.getCoverLetterSeq());
        res.setCoverLetterTitle(coverLetter.getCoverLetterTitle());
        res.setCoverLetterContent(coverLetter.getCoverLetterContent());
        res.setCoverLetterRegTime(coverLetter.getCoverLetterRegTime());
        return res;
    }
}
