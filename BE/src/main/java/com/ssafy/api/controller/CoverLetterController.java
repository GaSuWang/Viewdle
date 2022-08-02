package com.ssafy.api.controller;

import com.ssafy.api.request.CoverLetterPostReq;
import com.ssafy.api.request.CoverLetterPutReq;
import com.ssafy.api.request.CoverLetterSeqReq;
import com.ssafy.api.response.CoverLetterRes;
import com.ssafy.api.response.UserRes;
import com.ssafy.api.service.CoverLetterService;
import com.ssafy.api.service.UserService;
import com.ssafy.common.auth.VudleUserDetails;
import com.ssafy.common.exception.CoverLetterRegistFailedException;
import com.ssafy.common.model.response.BaseResponseBody;
import com.ssafy.db.entity.CoverLetter;
import com.ssafy.db.entity.User;
import com.ssafy.db.mapping.CoverLetterResMapping;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import springfox.documentation.annotations.ApiIgnore;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/coverletters")
public class CoverLetterController {

    @Autowired
    CoverLetterService coverLetterService;

    // create
    // 자소서 등록: 사용자 Email, 자소서 제목, 내용필요
    @PostMapping()
    public ResponseEntity<? extends BaseResponseBody> registCoverLetter(
            @ApiIgnore Authentication authentication,
            @RequestBody CoverLetterPostReq registerInfo){
        VudleUserDetails userDetails = (VudleUserDetails) authentication.getDetails();
        try {
            coverLetterService.registCoverLetter(registerInfo,userDetails.getUser());
        }catch (CoverLetterRegistFailedException e){
            return ResponseEntity.status(e.getStatus()).body(BaseResponseBody.of(e.getStatus(), e.getMessage()));
        }
       return ResponseEntity.status(200).body(BaseResponseBody.of(200, "자기소개서 등록이 완료되었습니다."));
    }


    //수정필요
    //get list
    //자소서 목록: 사용자 이메일 필요
    @GetMapping()
    public ResponseEntity<? extends List<CoverLetterResMapping>> getCoverLetterList(@ApiIgnore Authentication authentication){
        VudleUserDetails userDetails = (VudleUserDetails) authentication.getDetails();
        return ResponseEntity.status(200).body(coverLetterService.getCoverLetterList(userDetails.getUser()));
    }


    //get detail
    @GetMapping("/{coverLetterSeq}")
    public ResponseEntity<? extends CoverLetterRes> getCoverLetter(@PathVariable int coverLetterSeq){
        CoverLetter res = coverLetterService.getCoverLetter(coverLetterSeq);
        return ResponseEntity.status(200).body(CoverLetterRes.of(res));
    }



    //update
    //자소서 수정: 자소서pk, 자소서 제목, 내용
    @PutMapping()
    public ResponseEntity<? extends BaseResponseBody> updateCoverLetter(
            @ApiIgnore Authentication authentication,
            @RequestBody CoverLetterPutReq registerInfo){
        VudleUserDetails userDetails = (VudleUserDetails) authentication.getDetails();
        try {
            coverLetterService.updateCoverLetter(registerInfo,userDetails.getUser());
        }catch (CoverLetterRegistFailedException e){
            return ResponseEntity.status(e.getStatus()).body(BaseResponseBody.of(e.getStatus(), e.getMessage()));
        }
        return ResponseEntity.status(200).body(BaseResponseBody.of(200, "자기소개서 수정이 완료되었습니다."));
    }
    //delete
    //자소서 삭제: 자소서 pk
    @DeleteMapping()
    public ResponseEntity<? extends BaseResponseBody> deleteCoverLetter(@RequestBody CoverLetterSeqReq seq){
        coverLetterService.deleteCoverLetter(seq.getCoverLetterSeq());
        return ResponseEntity.status(200).body(BaseResponseBody.of(200, "자기소개서 삭제가 완료되었습니다."));
    }

}
