package com.ssafy.api.dto;

import lombok.Data;

@Data
public class FeedbackDto {

    float timeline;
    String feedbackType;
    String feedbackContent;
}
