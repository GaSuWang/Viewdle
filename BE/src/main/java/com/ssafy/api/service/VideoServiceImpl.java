package com.ssafy.api.service;

import com.ssafy.db.entity.User;
import com.ssafy.db.entity.Video;
import com.ssafy.db.repository.VideoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class VideoServiceImpl implements VideoService{

    @Autowired
    VideoRepository videoRepository;

    @Override
    public int registVideo(String title, String url, User user) {
        Video video = Video.builder()
                .videoTitle(title)
                .videoUrl(url)
                .user(user)
                .build();
        return videoRepository.save(video).getVideoSeq();
    }
}
