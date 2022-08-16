package com.ssafy.api.controller;

import com.ssafy.api.request.*;
import com.ssafy.api.response.RoomListRes;
import com.ssafy.api.response.RoomRegisterPostRes;
import com.ssafy.api.response.filterListRes;
import com.ssafy.api.service.*;
import com.ssafy.common.auth.VudleUserDetails;
import com.ssafy.common.model.response.BaseResponseBody;
import com.ssafy.db.entity.Common;
import com.ssafy.db.entity.Studyroom;
import com.ssafy.db.entity.User;
import com.ssafy.db.entity.Video;
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
@RequestMapping("/api/v1/studyroom")
public class StudyroomController {

    @Autowired
    StudyroomService studyroomService;

    @Autowired
    UserService userService;

    @Autowired
    CommonService commonService;

    @Autowired
    ParticipantService participantService;

    @Autowired
    VideoService videoService;

    @PostMapping
    @ApiOperation(value = "스터디 룸 등록", notes = "<strong>스터디 룸의 타입, 이름, 공개 여부, 비밀번호, 최대 인원, 썸네일 번호</strong>를 가지고 스터디 룸을 등록한다")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 401, message = "인증 실패"),
            @ApiResponse(code = 921, message = "참여 중인 스터디 룸 존재")
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
            System.out.println(user.getUserEmail() + " 현재 참여중인 스터디 룸이 있습니다.");
            return ResponseEntity.status(911).body(BaseResponseBody.of(921, "현재 참여 중인 스터디 룸이 있습니다."));
        }

        // 썸네일 정보 얻기
        Common common = commonService.getCommonBySeq(roomRegisterPostReq.getCommonSeq());
        int roomSeq = studyroomService.registRoom(roomRegisterPostReq, user, common);

        // 방장을 Participant 테이블에 등록
        participantService.registParticipant("Y", user, studyroomService.getRoomBySeq(roomSeq));
        return ResponseEntity.status(200).body(RoomRegisterPostRes.of(200, "스터디 룸을 정상적으로 생성했습니다", roomSeq));
    }

    @PatchMapping("/{roomSeq}")
    @ApiOperation(value = "스터디 룸 삭제", notes = "<strong>스터디 룸 번호</strong>를 가지고 스터디 룸을 삭제한다(닫는다)")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 401, message = "인증 실패")
    })
    public ResponseEntity<? extends BaseResponseBody> closeRoom(@ApiIgnore Authentication authentication, @PathVariable int roomSeq){

        if(authentication == null){
            System.out.println("로그인이 필요합니다.");
            return ResponseEntity.status(401).body(BaseResponseBody.of(401, "로그인이 필요합니다"));
        }

        // 방장이 스터디 룸을 삭제하면 스터디 룸에 있던 모든 유저들 방에서 내보내기
//        Studyroom studyroom = studyroomService.getRoomBySeq(roomSeq);
//        List<ParticipantResMapping> participants = participantService.findInStudyroomUser(studyroom, "Y");
//
//        for(int i = 0; i < participants.size(); i++) {
//            participantService.outUser(participants.get(i).getParticipantSeq());
//        }

        studyroomService.closeRoom(roomSeq);
        return ResponseEntity.status(200).body(BaseResponseBody.of(200, "스터디 룸을 삭제했습니다."));
    }

    @PostMapping("/enter")
    @ApiOperation(value = "스터디 룸 입장", notes = "<strong>스터디 룸 번호, 비밀번호</strong>을 가지고 스터디 룸에 입장한다")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 401, message = "인증 실패"),
            @ApiResponse(code = 901, message = "존재하지 않는 스터디 룸"),
            @ApiResponse(code = 921, message = "참여 중인 스터디 룸 존재"),
            @ApiResponse(code = 922, message = "참여 인원 초과"),
            @ApiResponse(code = 923, message = "비밀번호 불일치"),
            @ApiResponse(code = 924, message = "면접 진행 중")
    })
    public ResponseEntity<? extends  BaseResponseBody> enterRoom(@ApiIgnore Authentication authentication, @RequestBody @ApiParam(value="스터디 룸 입장 정보", required = true) RoomEnterPostReq RoomEnterPostReq){

        if(authentication == null){
            System.out.println("로그인이 필요합니다.");
            return ResponseEntity.status(401).body(BaseResponseBody.of(401, "로그인이 필요합니다"));
        }

        // 스터디 룸 입장 유저 정보 얻기
        VudleUserDetails userDetails = (VudleUserDetails) authentication.getDetails();
        User user = userDetails.getUser();
        System.out.println("스터디 룸 입장 유저 : " + user.getUserEmail());

        // 스터디 룸 상태 체크
        Studyroom studyroom = studyroomService.getRoomBySeq(RoomEnterPostReq.getRoomSeq());
        if(studyroom == null){
            return ResponseEntity.status(901).body(BaseResponseBody.of(901, "존재하지 않는 스터디 룸입니다."));
        }

        if("Y".equals(studyroom.getRoomCloseYN())){
            return ResponseEntity.status(901).body(BaseResponseBody.of(901, "종료된 스터디 룸입니다."));
        }

        if("Y".equals(studyroom.getRoomFullYN())){
            return ResponseEntity.status(922).body(BaseResponseBody.of(922, "참여 인원을 초과해 입장할 수 없습니다."));
        }
        
        if("Y".equals(studyroom.getRoomActiveYN())){
            return ResponseEntity.status(924).body(BaseResponseBody.of(924, "면접 진행 중인 방에는 참여할 수 없습니다."));
        }

        // 해당 유저가 참여 중인 스터디 룸이 있는지 체크
        ParticipantResMapping participant = participantService.findRecentByUserSeq(user);
        if(participant != null && participant.getParticipantEnterYN().equals("Y")){
            System.out.println(user.getUserEmail() + " 현재 참여중인 스터디 룸이 있습니다.");
            return ResponseEntity.status(921).body(BaseResponseBody.of(921, "현재 참여 중인 스터디 룸이 있습니다."));
        }

        // 비밀번호 체크
        if(!studyroom.getRoomPassword().equals(RoomEnterPostReq.getRoomPassword())){
            System.out.println("비밀번호가 일치하지않습니다");
            return ResponseEntity.status(923).body(BaseResponseBody.of(923, "비밀번호가 일치하지 않습니다."));
        }

        // Participant 테이블에 등록
        participantService.registParticipant("N", user, studyroom);

        // limit 인원만큼 참여했다면 Studyroom full 상태 변경
        if(participantService.countInStudyroomUser(studyroom, "Y") == studyroom.getRoomLimit()){
            studyroomService.fullRoom(studyroom.getRoomSeq());
        }

        return ResponseEntity.status(200).body(BaseResponseBody.of(200, "스터디 룸에 입장했습니다."));
    }

    @PatchMapping("/exit")
    @ApiOperation(value = "스터디 룸 나가기", notes = "<strong>스터디 룸 번호, 다음 방장 이메일, 참여 시간</strong>정보를 넘기고 스터디 룸을 나간다.")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 401, message = "인증 실패"),
    })
    public ResponseEntity<? extends BaseResponseBody> exitRoom(@ApiIgnore Authentication authentication, @RequestBody @ApiParam(value="스터디 룸 퇴장 정보", required = true) RoomExitPatchReq roomExitPatchReq){

        if(authentication == null){
            System.out.println("로그인이 필요합니다.");
            return ResponseEntity.status(401).body(BaseResponseBody.of(401, "로그인이 필요합니다"));
        }

        // 스터디 룸 퇴장 유저 정보 얻기
        VudleUserDetails userDetails = (VudleUserDetails) authentication.getDetails();
        User user = userDetails.getUser();
        System.out.println("스터디 룸 퇴장 유저 : " + user.getUserEmail());

        ParticipantResMapping participant = participantService.findRecentByUserSeq(user);
        // 방장이 권한을 넘기면서 나갈 때
//        if("Y".equals(roomExitPatchReq.getOwnerYN()) && roomExitPatchReq.getNextOwnerEmail() != "") {
        if(roomExitPatchReq.getNextOwnerEmail() != "") {
            User nextUser = userService.getUserByUserEmail(roomExitPatchReq.getNextOwnerEmail());
            ParticipantResMapping nextOwner = participantService.findRecentByUserSeq(nextUser);
            participantService.exitOwner(participant.getParticipantSeq(), user, roomExitPatchReq.getTime());
            participantService.changeOwner(nextOwner.getParticipantSeq());
        }
        // 방장이 아닐 때 또는 방장이지만 방을 폭파할 때
        else{
            participantService.outUser(participant.getParticipantSeq(), user, roomExitPatchReq.getTime());
        }

        // 스터디 룸이 full 상태였다면 not full로 상태 변경
        Studyroom studyroom = studyroomService.getRoomBySeq(roomExitPatchReq.getRoomSeq());
        if("Y".equals(studyroom.getRoomFullYN())){
            studyroomService.notFullRoom(studyroom.getRoomSeq());
        }

        return ResponseEntity.status(200).body(BaseResponseBody.of(200, "스터디 룸에서 나왔습니다."));
    }

    @PatchMapping("/interview/{roomSeq}")
    @ApiOperation(value = "스터디 룸 면접 시작", notes = "<strong>스터디 룸 번호</strong>를 가지고 면접 상태를 변경한다. (면접 진행 중)")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 401, message = "인증 실패"),
            @ApiResponse(code = 901, message = "존재하지 않는 스터디 룸")
    })
    public ResponseEntity<? extends BaseResponseBody> startInterview(@ApiIgnore Authentication authentication, @PathVariable int roomSeq){

        if(authentication == null){
            System.out.println("로그인이 필요합니다.");
            return ResponseEntity.status(401).body(BaseResponseBody.of(401, "로그인이 필요합니다"));
        }

        if(studyroomService.getRoomBySeq(roomSeq).getRoomCloseYN().equals("Y")){
            System.out.println("면접을 진행할 수 없습니다.");
           return ResponseEntity.status(901).body(BaseResponseBody.of(901, "종료된 스터디 룸은 면접을 진행할 수 없습니다."));
        }

        studyroomService.startInterview(roomSeq);
        return ResponseEntity.status(200).body(BaseResponseBody.of(200, "면접을 시작했습니다."));
    }


    @PostMapping("/interview")
    @ApiOperation(value = "스터디 룸 면접 종료", notes = "<strong>스터디 룸 번호, 영상 번호, 피드백 목록</strong>를 가지고 면접 상태를 변경한다. (면접 종료 중)")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 401, message = "인증 실패"),
            @ApiResponse(code = 925, message = "존재하지 않는 영상")
    })
    public ResponseEntity<? extends BaseResponseBody> endInterview(@ApiIgnore Authentication authentication, @RequestBody FeedbackRegPostReq feedbackRegPostReq){

        if(authentication == null){
            System.out.println("로그인이 필요합니다.");
            return ResponseEntity.status(401).body(BaseResponseBody.of(401, "로그인이 필요합니다"));
        }

        // 스터디 룸 상태 체크
        int roomSeq = feedbackRegPostReq.getRoomSeq();
        Studyroom studyroom = studyroomService.getRoomBySeq(roomSeq);
        if(studyroom == null){
            return ResponseEntity.status(901).body(BaseResponseBody.of(901, "존재하지 않는 스터디 룸입니다."));
        }

        if(studyroomService.getRoomBySeq(roomSeq).getRoomCloseYN().equals("Y")){
            System.out.println("면접을 종료 할 수 없습니다.");
            return ResponseEntity.status(901).body(BaseResponseBody.of(901, "종료된 스터디 룸은 면접을 종료 할 수 없습니다."));
        }

        // 플레이 모드
        if(feedbackRegPostReq.getVideoSeq() == null){
            studyroomService.endInterview(roomSeq);
            return ResponseEntity.status(200).body(BaseResponseBody.of(200, "플레이 모드 면접을 종료합니다."));
        }else { // 스터디 모드
            // 피드백 저장
            Video video = videoService.getVideoBySeq(feedbackRegPostReq.getVideoSeq());
            if (video == null) {
                return ResponseEntity.status(925).body(BaseResponseBody.of(925, "존재하지 않는 영상입니다."));
            }

            videoService.registFeedback(video, feedbackRegPostReq.getFeedbackList());
        }

        // 방 상태 변경
        studyroomService.endInterview(roomSeq);
        return ResponseEntity.status(200).body(BaseResponseBody.of(200, "피드백을 저장하고 면접을 종료합니다."));
    }

    @GetMapping
    @ApiOperation(value = "스터디 룸 목록", notes = "<strong>필터와 정렬 순서</strong>를 가지고 스터디 룸 목록을 반환한다.")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
    })
    public ResponseEntity<? extends List<RoomListRes>> getRooms(@RequestParam(required = false) String order, Integer type, String privateYN, String FullYN){
        return ResponseEntity.status(200).body(studyroomService.getRoomsList(order, type, privateYN, FullYN));
    }

    @GetMapping("/search")
    @ApiOperation(value = "스터디 룸 검색", notes = "<strong>검색어</strong>를 가지고 해당 검색어가 포함된 스터디 룸 목록을 반환한다.")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
    })
    public ResponseEntity<? extends List<RoomListRes>> searchRooms(@RequestParam String keyword){
        return ResponseEntity.status(200).body(studyroomService.searchRoomList(keyword));
    }

    @GetMapping("/filter")
    @ApiOperation(value = "필터 목록 반환", notes = "플레이 모드에서 사용되는 필터 목록을 반환한다.")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
    })
    public ResponseEntity<? extends List<filterListRes>> getFilter(){
        return ResponseEntity.status(200).body(commonService.getFilter());
    }



    // 추후 필요하면 다시 구현 => join 필요
//    @GetMapping("/{roomSeq}")
//    @ApiOperation(value = "참여자 목록", notes = "<strong>스터디 룸 번호</strong>로 현재 스터디 룸의 참여자 목록을 반환한다.")
//    public ResponseEntity<? extends List<ParticipantResMapping>> getParticipants(@ApiIgnore Authentication authentication, @PathVariable int roomSeq){
//        Studyroom studyroom = studyroomService.getRoomBySeq(roomSeq);
//        return ResponseEntity.status(200).body(participantService.findInStudyroomUser(studyroom, "Y"));
//    }
}
