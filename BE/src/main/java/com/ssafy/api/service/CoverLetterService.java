package com.ssafy.api.service;

import com.ssafy.api.request.CoverLetterPostReq;
import com.ssafy.api.request.CoverLetterPutReq;
import com.ssafy.db.entity.CoverLetter;
import com.ssafy.db.entity.User;
import com.ssafy.db.mapping.CoverLetterResMapping;
import org.springframework.stereotype.Service;

import java.util.List;


public interface CoverLetterService {
    public CoverLetter registCoverLetter(CoverLetterPostReq registerInfo, User user);
    public List<CoverLetterResMapping> getCoverLetterList (User user);
    public CoverLetter getCoverLetter(int coverLetterSeq);
    public CoverLetter updateCoverLetter(CoverLetterPutReq registerInfo, User user);
    public void deleteCoverLetter(int coverLetterSeq);
}
