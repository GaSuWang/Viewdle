package com.ssafy.api.dto;

import lombok.Data;

@Data
public class FeedbackDto {

    int timeline;
    String feedbackType;
    String feedbackContent;
}
