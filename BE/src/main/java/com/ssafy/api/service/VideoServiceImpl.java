package com.ssafy.api.service;

import com.ssafy.api.dto.FeedbackDto;
import com.ssafy.api.response.VideoListRes;
import com.ssafy.db.entity.Feedback;
import com.ssafy.db.entity.User;
import com.ssafy.db.entity.Video;
import com.ssafy.db.repository.FeedbackRepository;
import com.ssafy.db.repository.VideoRepository;
import com.ssafy.db.repository.VideoRepositorySupport;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;

@Service
public class VideoServiceImpl implements VideoService{

    @Autowired
    VideoRepository videoRepository;

    @Autowired
    VideoRepositorySupport videoRepositorySupport;

    @Autowired
    FeedbackRepository feedbackRepository;

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

    @Transactional
    @Override
    public void registFeedback(Video video, List<FeedbackDto> feedbackList) {
        List<Feedback> feedback = new ArrayList<>();

        for(FeedbackDto feedbacks : feedbackList){
            Feedback fb = Feedback.builder()
                    .timeline(feedbacks.getTimeline())
                    .feedbackType(feedbacks.getFeedbackType())
                    .feedbackContent(feedbacks.getFeedbackContent())
                    .video(video)
                    .build();
            feedback.add(fb);
        }
        feedbackRepository.saveAll(feedback);
    }

    @Override
    public Video getVideoBySeq(int videoSeq) {
        Video video = videoRepository.findByVideoSeq(videoSeq);
        return video;
    }
}
