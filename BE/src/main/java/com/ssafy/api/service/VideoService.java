package com.ssafy.api.service;

import com.ssafy.db.entity.User;

public interface VideoService {

    public int registVideo(String title, String url, User user);
}
