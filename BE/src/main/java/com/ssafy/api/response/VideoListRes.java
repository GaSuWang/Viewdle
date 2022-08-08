package com.ssafy.api.response;

import com.querydsl.core.annotations.QueryProjection;
import io.swagger.annotations.ApiModel;
import lombok.Data;

@Data
@ApiModel("VideoListRes")
public class VideoListRes {

    int videoSeq;
    String videoTitle;
    String videoUrl;
    String videoRegTime;

    @QueryProjection
    public VideoListRes(int videoSeq, String videoTitle, String videoUrl, String videoRegTime) {
        this.videoSeq = videoSeq;
        this.videoTitle = videoTitle;
        this.videoUrl = videoUrl;
        this.videoRegTime = videoRegTime;
    }
}
