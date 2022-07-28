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
import com.ssafy.db.entity.Participant;
import com.ssafy.db.entity.Studyroom;
import com.ssafy.db.entity.User;
import com.ssafy.db.mapping.ParticipantResMapping;
import io.swagger.annotations.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import springfox.documentation.annotations.ApiIgnore;

import java.util.List;

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
            @ApiResponse(code = 401, message = "인증 실패"),
            @ApiResponse(code = 921, message = "참여 중인 방 존재")
    })
    public ResponseEntity<? extends BaseResponseBody> registRoom(@ApiIgnore Authentication authentication, @RequestBody @ApiParam(value="스터디 룸 등록 정보", required = true) RoomRegisterPostReq roomRegisterPostReq){

        if(authentication == null){
            System.out.println("로그인이 필요합니다.");
            return ResponseEntity.status(401).body(BaseResponseBody.of(401, "로그인이 필요합니다"));
        }

        // 방 생성한 유저 정보 얻기
        VudleUserDetails userDetails = (VudleUserDetails) authentication.getDetails();
        User user = userDetails.getUser();
        System.out.println("스터디 룸 등록 유저 : " + user.getUserEmail());

        // 해당 유저가 참여 중인 방이 있는지 체크
        ParticipantResMapping participant = participantService.findRecentByUserSeq(user);
        if(participant != null && participant.getParticipantEnterYN().equals("Y")){
            System.out.println(user.getUserEmail() + " 현재 참여중인 방이 있습니다.");
            return ResponseEntity.status(911).body(BaseResponseBody.of(921, "현재 참여 중인 방이 있습니다."));
        }

        // 썸네일 정보 얻기
        Common common = commonService.getCommonBySeq(roomRegisterPostReq.getCommonSeq());
        int roomSeq = studyroomService.registRoom(roomRegisterPostReq, user, common);

        // 방장을 Participant 테이블에 등록
        participantService.registParticipant("Y", user, studyroomService.getRoomBySeq(roomSeq));
        return ResponseEntity.status(200).body(RoomRegisterPostRes.of(200, "방을 정상적으로 생성했습니다", roomSeq));
    }

    @PutMapping("/{roomSeq}")
    @ApiOperation(value = "스터디 룸 삭제", notes = "<strong>방 번호</strong>를 가지고 방을 삭제한다(닫는다)")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 401, message = "인증 실패")
    })
    public ResponseEntity<? extends BaseResponseBody> closeRoom(@ApiIgnore Authentication authentication, @PathVariable int roomSeq){

        if(authentication == null){
            System.out.println("로그인이 필요합니다.");
            return ResponseEntity.status(401).body(BaseResponseBody.of(401, "로그인이 필요합니다"));
        }

        // 방장이 스터디 룸을 삭제하면 방에 있던 모든 유저들 방에서 내보내기
        Studyroom studyroom = studyroomService.getRoomBySeq(roomSeq);
        List<ParticipantResMapping> participants = participantService.findInStudyroomUser(studyroom, "Y");

        for(int i = 0; i < participants.size(); i++) {
            participantService.outUser(participants.get(i).getParticipantSeq());
        }

        studyroomService.closeRoom(roomSeq);
        return ResponseEntity.status(200).body(BaseResponseBody.of(200, "방을 삭제했습니다."));
    }

    @PutMapping("/interview/start/{roomSeq}")
    @ApiOperation(value = "스터디 룸 면접 시작", notes = "<strong>방 번호</strong>를 가지고 면접 상태를 변경한다. (면접 진행 중)")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 401, message = "인증 실패"),
            @ApiResponse(code = 901, message = "면접 진행 불가")
    })
    public ResponseEntity<? extends BaseResponseBody> startInterview(@ApiIgnore Authentication authentication, @PathVariable int roomSeq){

        if(authentication == null){
            System.out.println("로그인이 필요합니다.");
            return ResponseEntity.status(401).body(BaseResponseBody.of(401, "로그인이 필요합니다"));
        }

        if(studyroomService.getRoomBySeq(roomSeq).getRoomCloseYN().equals("Y")){
            System.out.println("면접을 진행할 수 없습니다.");
           return ResponseEntity.status(901).body(BaseResponseBody.of(901, "닫힌 방은 면접을 진행할 수 없습니다."));
        }

        studyroomService.startInterview(roomSeq);
        return ResponseEntity.status(200).body(BaseResponseBody.of(200, "면접을 시작했습니다."));
    }


    @PutMapping("/interview/end/{roomSeq}")
    @ApiOperation(value = "스터디 룸 면접 종료", notes = "<strong>방 번호</strong>를 가지고 면접 상태를 변경한다. (면접 종료 중)")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 401, message = "인증 실패"),
            @ApiResponse(code = 901, message = "면접 진행 불가")
    })
    public ResponseEntity<? extends BaseResponseBody> endInterview(@ApiIgnore Authentication authentication, @PathVariable int roomSeq){

        if(authentication == null){
            System.out.println("로그인이 필요합니다.");
            return ResponseEntity.status(401).body(BaseResponseBody.of(401, "로그인이 필요합니다"));
        }

        if(studyroomService.getRoomBySeq(roomSeq).getRoomCloseYN().equals("Y")){
            System.out.println("면접을 종료 할 수 없습니다.");
            return ResponseEntity.status(901).body(BaseResponseBody.of(901, "닫힌 방은 면접을 종료 할 수 없습니다."));
        }

        studyroomService.endInterview(roomSeq);
        return ResponseEntity.status(200).body(BaseResponseBody.of(200, "면접을 종료합니다."));
    }

}
