package com.ssafy.api.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class UserHistoryRes {
    private String userTotalTime;
    private int userTotalVideo;
    private List<String> usingDates;

    @Builder
    public UserHistoryRes(String userTotalTime, int userTotalVideo, List<String> usingDates) {
        this.userTotalTime = userTotalTime;
        this.userTotalVideo = userTotalVideo;
        this.usingDates = usingDates;
    }
}
