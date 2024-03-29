package com.ssafy.api.controller;

import com.ssafy.api.request.VideoSavePostReq;
import com.ssafy.api.response.VideoDetailRes;
import com.ssafy.api.response.VideoListRes;
import com.ssafy.api.response.VideoSavePostRes;
import com.ssafy.api.service.UserService;
import com.ssafy.api.service.VideoService;
import com.ssafy.common.auth.VudleUserDetails;
import com.ssafy.common.model.response.BaseResponseBody;
import com.ssafy.db.entity.User;
import com.ssafy.db.entity.Video;
import io.swagger.annotations.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import springfox.documentation.annotations.ApiIgnore;

import java.util.List;

@Api(value = "내 영상 API", tags = {"Video"})
@RestController
@RequestMapping("/api/v1/video")
public class VideoController {

    @Autowired
    UserService userService;

    @Autowired
    VideoService videoService;

    @PostMapping
    @ApiOperation(value = "면접 영상 저장", notes = "<strong>저장할 영상의 이름, url, 유저 이메일</strong>를 가지고 영상을 저장한다")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 401, message = "존재하지 않는 사용자")
    })
    public ResponseEntity<? extends BaseResponseBody> saveVideo(@ApiIgnore Authentication authentication, @RequestBody @ApiParam(value="내 영상 저장 정보", required = true) VideoSavePostReq videoSavePostReq) {

        User user = userService.getUserByUserEmail(videoSavePostReq.getUserEmail());
        if(user == null){
            return ResponseEntity.status(401).body(BaseResponseBody.of(401, "존재하지 않는 사용자입니다."));
        }

        String title = videoSavePostReq.getVideoTitle();
        String url = videoSavePostReq.getVideoUrl();
        int videoSeq = videoService.registVideo(title, url, user);
        return ResponseEntity.status(200).body(VideoSavePostRes.of(200, "영상을 정상적으로 저장했습니다.", videoSeq));
    }

    @GetMapping
    @ApiOperation(value = "내 영상 목록보기", notes = "<strong>정렬 순서를 가지고 </strong> 내 영상의 목록을 반환한다.")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
    })
    public ResponseEntity<? extends List<VideoListRes>> getVideos(@ApiIgnore Authentication authentication, @RequestParam(required = false) String order) {
        VudleUserDetails userDetails = (VudleUserDetails) authentication.getDetails();
        User user = userDetails.getUser();
        return ResponseEntity.status(200).body(videoService.getVideoList(user, order));
    }

    @GetMapping("/{videoSeq}")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
    })
    @ApiOperation(value = "영상 및 피드백 다시보기", notes = "<strong>내 영상 번호</strong>를 가지고 해당 영상과 피드백을 반환한다.")
    public ResponseEntity<? extends VideoDetailRes> getVideos(@ApiIgnore Authentication authentication, @PathVariable int videoSeq) {
        return ResponseEntity.status(200).body(videoService.getVideoDetail(videoSeq));
    }

    @DeleteMapping("/{videoSeq}")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 401, message = "존재하지 않는 사용자"),
            @ApiResponse(code = 925, message = "존재하지 않는 영상")
    })
    @ApiOperation(value = "영상 및 피드백 삭제하기", notes = "<strong>내 영상 번호</strong>를 가지고 해당 영상과 피드백을 삭제한다.")
    public ResponseEntity<? extends BaseResponseBody> deleteVideo(@ApiIgnore Authentication authentication, @PathVariable int videoSeq){

        VudleUserDetails userDetails = (VudleUserDetails) authentication.getDetails();
        User user = userDetails.getUser();
        if(user == null){
            return ResponseEntity.status(401).body(BaseResponseBody.of(401, "존재하지 않는 사용자입니다."));
        }

        Video video = videoService.getVideoBySeq(videoSeq);
        if(video == null){
            return ResponseEntity.status(925).body(BaseResponseBody.of(925, "존재하지 않는 영상입니다."));
        }

        videoService.deleteVideo(videoSeq, user);
        return ResponseEntity.status(200).body(BaseResponseBody.of(200, "영상과 피드백을 성공적으로 삭제했습니다."));
    }

}
