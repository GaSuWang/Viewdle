package com.ssafy.api.controller;

import com.ssafy.api.request.VideoSavePostReq;
import com.ssafy.api.response.VideoSavePostRes;
import com.ssafy.api.service.UserService;
import com.ssafy.api.service.VideoService;
import com.ssafy.common.model.response.BaseResponseBody;
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

@Api(value = "내 영상 API", tags = {"Video"})
@RestController
@RequestMapping("/api/vi/video")
public class VideoController {

    @Autowired
    UserService userService;

    @Autowired
    VideoService videoService;

    @PostMapping
    @ApiOperation(value = "내 영상 저장", notes = "<strong>저장할 영상의 이름, url, 유저 이메일</strong>를 가지고 영상을 저장한다")
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
        System.out.println(videoSeq);
        return ResponseEntity.status(200).body(VideoSavePostRes.of(200, "영상을 정상적으로 저장했습니다.", videoSeq));
    }
}
