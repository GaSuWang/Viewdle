package com.ssafy.db.entity;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Entity
@Getter
@Setter
@ToString
@Table(name = "Participant")
public class Participant {
    @Id
    @Column(name = "participant_seq")
    int participantSeq;

    @Column(name = "participant_date")
    String participantDate;

    @Column(name = "participant_enter_YN")
    String participantEnterYN;

    @Column(name = "room_owner_YN")
    String roomOwnerYN;

    @ManyToOne
    @JoinColumn(name = "user_seq")
    User user;

    @ManyToOne
    @JoinColumn(name = "room_seq")
    Studyroom studyroom;

    public Participant() {} // 기본 생성자

    @PrePersist
    public void prePersist(){
        String now = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy:MM:dd"));
        participantDate = now;
        participantEnterYN = "Y";
    }

    @Builder
    public Participant(String roomOwnerYN, User user, Studyroom studyroom) {
        this.roomOwnerYN = roomOwnerYN;
        this.user = user;
        this.studyroom = studyroom;
    }
}
