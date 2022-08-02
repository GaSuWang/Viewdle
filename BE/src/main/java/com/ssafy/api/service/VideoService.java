package com.ssafy.api.service;

import com.ssafy.api.response.VideoListRes;
import com.ssafy.db.entity.User;

import java.util.List;

public interface VideoService {

    public int registVideo(String title, String url, User user);
    public List<VideoListRes> getVideoList(String order);
}
