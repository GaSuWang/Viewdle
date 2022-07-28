package com.ssafy.api.controller;

import com.ssafy.api.request.RoomRegisterPostReq;
import com.ssafy.api.response.RoomRegisterPostRes;
import com.ssafy.api.service.CommonService;
import com.ssafy.api.service.ParticipantService;
import com.ssafy.api.service.StudyroomService;
import com.ssafy.api.service.UserService;
import com.ssafy.common.auth.VudleUserDetails;
import com.ssafy.common.model.response.BaseResponseBody;
import com.ssafy.db.entity.Common;
import com.ssafy.db.entity.User;
import io.swagger.annotations.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import springfox.documentation.annotations.ApiIgnore;

@Api(value = "스터디 룸 API", tags = {"Studyroom"})
@RestController
@RequestMapping("/api/vi/studyroom")
public class StudyroomController {

    @Autowired
    StudyroomService studyroomService;

    @Autowired
    UserService userService;

    @Autowired
    CommonService commonService;

    @Autowired
    ParticipantService participantService;

    @PostMapping
    @ApiOperation(value = "스터디 룸 등록", notes = "<strong>방의 타입, 이름, 공개 여부, 비밀번호, 최대 인원, 썸네일 번호</strong>를 가지고 방을 등록한다")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 401, message = "인증 실패")
    })
    public ResponseEntity<? extends BaseResponseBody> registRoom(@ApiIgnore Authentication authentication, @RequestBody @ApiParam(value="스터디 룸 등록 정보", required = true) RoomRegisterPostReq roomRegisterPostReq){

        if(authentication == null){
            System.out.println("로그인이 필요합니다.");
            return ResponseEntity.status(401).body(BaseResponseBody.of(401, "로그인이 필요합니다"));
        }

        VudleUserDetails userDetails = (VudleUserDetails) authentication.getDetails();
        User user = userDetails.getUser(); // 방 생성한 유저 정보 얻기
        System.out.println("스터디 룸 등록 유저 : " + user.getUserName());

        Common common = commonService.getCommonBySeq(roomRegisterPostReq.getCommonSeq()); // 썸네일 정보 얻기
        int roomSeq = studyroomService.registRoom(roomRegisterPostReq, user, common);

        participantService.registParticipant("Y", user, studyroomService.getRoomBySeq(roomSeq)); // 방장을 Participant 테이블에 등록
        return ResponseEntity.status(200).body(RoomRegisterPostRes.of(200, "방을 정상적으로 생성했습니다", roomSeq));
    }

}
