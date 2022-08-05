package com.ssafy.db.entity;

import com.fasterxml.jackson.annotation.JsonAnyGetter;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Table (name = "Video")
public class Video {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "video_seq")
    int videoSeq;

    @Column(name = "video_title")
    String videoTitle;

    @Column(name = "video_url")
    String videoUrl;

    @Column(name = "video_reg_time")
    String videoRegTime;

    @ManyToOne
    @JoinColumn(name = "user_seq")
    User user;

    @OneToMany(mappedBy = "video")
    List<Feedback> feedbacks = new ArrayList<>();

    public Video() {};

    @PrePersist
    public void prePersist(){
        String now = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy:MM:dd:hh:mm:ss"));
        videoRegTime = now;
    }

    @Builder
    public Video(String videoTitle, String videoUrl, User user) {
        this.videoTitle = videoTitle;
        this.videoUrl = videoUrl;
        this.user = user;
    }
}
