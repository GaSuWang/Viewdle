package com.ssafy.db.entity;

import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Entity
@Getter
@Table(name = "Feedback")
public class Feedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "feedback_seq")
    int feedbackSeq;

    @Column(name = "timeline")
    float timeline;

    @Column(name = "feedback_type")
    String feedbackType;

    @Column(name = "feedback_content")
    String feedbackContent;

    @Column(name = "feedback_reg_time")
    String feedbackRegTime;

    @ManyToOne
    @JoinColumn(name = "video_seq")
    Video video;

    public Feedback() {};

    @PrePersist
    public void prePersist(){
        String now = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy:MM:dd:hh:mm:ss"));
        feedbackRegTime = now;
    }

    @Builder
    public Feedback(float timeline, String feedbackType, String feedbackContent, Video video) {
        this.timeline = timeline;
        this.feedbackType = feedbackType;
        this.feedbackContent = feedbackContent;
        this.video = video;
    }
}
