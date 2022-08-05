package com.ssafy.api.request;

import io.swagger.annotations.ApiModel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@ApiModel("VideoSavePostReq")
public class VideoSavePostReq {

    String videoTitle;
    String videoUrl;
    String userEmail;
}
