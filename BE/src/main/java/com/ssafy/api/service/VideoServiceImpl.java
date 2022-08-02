package com.ssafy.api.service;

import com.ssafy.api.response.VideoListRes;
import com.ssafy.db.entity.User;
import com.ssafy.db.entity.Video;
import com.ssafy.db.repository.VideoRepository;
import com.ssafy.db.repository.VideoRepositorySupport;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VideoServiceImpl implements VideoService{

    @Autowired
    VideoRepository videoRepository;

    @Autowired
    VideoRepositorySupport videoRepositorySupport;

    @Override
    public int registVideo(String title, String url, User user) {
        Video video = Video.builder()
                .videoTitle(title)
                .videoUrl(url)
                .user(user)
                .build();
        return videoRepository.save(video).getVideoSeq();
    }

    @Override
    public List<VideoListRes> getVideoList(String order) {
        return videoRepositorySupport.findVideoByOrder(order);
    }
}
