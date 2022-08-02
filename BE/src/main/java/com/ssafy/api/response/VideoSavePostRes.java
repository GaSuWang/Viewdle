package com.ssafy.api.response;

import com.ssafy.common.model.response.BaseResponseBody;
import io.swagger.annotations.ApiModel;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@ApiModel("VideoSavePostRes")
public class VideoSavePostRes extends BaseResponseBody {

    int videoSeq;

    public static VideoSavePostRes of(Integer statusCode, String message, int videoSeq){
        VideoSavePostRes res = new VideoSavePostRes();
        res.setStatusCode(statusCode);
        res.setMessage(message);
        res.setVideoSeq(videoSeq);

        return res;
    }
}
