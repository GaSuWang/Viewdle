package com.ssafy.api.response;

import com.ssafy.api.dto.FeedbackDto;
import com.ssafy.db.mapping.FeedbackResMapping;
import io.swagger.annotations.ApiModel;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
@ApiModel("VideoDetailRes")
public class VideoDetailRes {

    int videoSeq;
    String videoTitle;
    String videoUrl;
    String videoRegTime;
    List<FeedbackResMapping> feedbackList;

    @Builder
    public VideoDetailRes(int videoSeq, String videoTitle, String videoUrl, String videoRegTime, List<FeedbackResMapping> feedbackList) {
        this.videoSeq = videoSeq;
        this.videoTitle = videoTitle;
        this.videoUrl = videoUrl;
        this.videoRegTime = videoRegTime;
        this.feedbackList = feedbackList;
    }
}
