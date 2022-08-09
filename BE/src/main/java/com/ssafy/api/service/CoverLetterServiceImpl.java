package com.ssafy.api.service;

import com.ssafy.api.request.CoverLetterPostReq;
import com.ssafy.api.request.CoverLetterPutReq;
import com.ssafy.common.exception.CoverLetterRegistFailedException;
import com.ssafy.db.entity.CoverLetter;
import com.ssafy.db.entity.User;
import com.ssafy.db.mapping.CoverLetterResMapping;
import com.ssafy.db.repository.CoverLetterRepository;
//import jdk.nashorn.internal.runtime.options.Option;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CoverLetterServiceImpl implements CoverLetterService{
    @Autowired
    UserService userService;
    @Autowired
    CoverLetterRepository coverRepo;

    @Override
    public CoverLetter registCoverLetter(CoverLetterPostReq registerInfo, User user) {
        CoverLetter coverLetter = CoverLetter.builder()
                .coverLetterContent(registerInfo.getCoverLetterContent())
                .coverLetterTitle(registerInfo.getCoverLetterTitle())
                .user(user).build();
        CoverLetter resCoverLetter = (CoverLetter) coverRepo.save(coverLetter);
        if(resCoverLetter == null){
            throw new CoverLetterRegistFailedException();
        }
        return resCoverLetter;
    }

    @Override
    public List<CoverLetterResMapping> getCoverLetterList(User user) {
        List<CoverLetterResMapping> coverLetterList = coverRepo.findByUser(user);
        return coverLetterList;
    }

    @Override
    public CoverLetter getCoverLetter(int coverLetterSeq) {
        Optional<CoverLetter> res = coverRepo.findById(coverLetterSeq);
        System.out.println(res.get().toString());
        if(res.get()==null){
            //예외처리하기
        }
        return res.get();
    }

    @Override
    public CoverLetter updateCoverLetter(CoverLetterPutReq registerInfo, User user) {
        Optional<CoverLetter> coverLetter = coverRepo.findById(registerInfo.getCoverLetterSeq());
        CoverLetter update = coverLetter.get();
        update.setCoverLetterContent(registerInfo.getCoverLetterContent());
        update.setCoverLetterTitle(registerInfo.getCoverLetterTitle());
        CoverLetter resCoverLetter = (CoverLetter) coverRepo.save(update);
        //예외처리하기
        return resCoverLetter;
    }

    @Override
    public void deleteCoverLetter(int coverLetterSeq) {
        coverRepo.deleteById(coverLetterSeq);
    }


}
