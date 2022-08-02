package com.ssafy.api.service;

import com.ssafy.api.dto.FeedbackDto;
import com.ssafy.api.response.VideoDetailRes;
import com.ssafy.api.response.VideoListRes;
import com.ssafy.db.entity.User;
import com.ssafy.db.entity.Video;

import java.util.List;

public interface VideoService {

    public int registVideo(String title, String url, User user);
    public List<VideoListRes> getVideoList(String order);
    public void registFeedback(Video video, List<FeedbackDto> feedbackList);
    public Video getVideoBySeq(int videoSeq);
    public VideoDetailRes getVideoDetail(int videoSeq);
}
