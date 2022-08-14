package com.ssafy.api.request;

import com.ssafy.api.dto.FeedbackDto;
import io.swagger.annotations.ApiModel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
@ApiModel("FeedbackRegPostReq")
public class FeedbackRegPostReq {

    int roomSeq;
    Integer videoSeq;
    List<FeedbackDto> feedbackList;
}
