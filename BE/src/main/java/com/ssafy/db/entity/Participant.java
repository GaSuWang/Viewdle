package com.ssafy.db.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.List;

/*
Participant_seq` INT NOT NULL,
  `Participant_date` VARCHAR(20) NOT NULL,
  `participant_enter_YN` VARCHAR(1) NOT NULL,
  `room_owner_YN` VARCHAR(1) NOT NULL,
  `user_seq` INT NOT NULL,
  `room_seq` INT NOT NULL,
* */
@Entity
@Getter
@Setter
@Table(name = "Participant")
public class Participant {
    @Id
    @Column(name = "participant_seq")
    int participantSeq;

    @Column(name = "participant_enter_YN")
    String participantEnterYN;
    @Column(name = "room_owner_YN")
    String roomOwnerYN;

//    @JoinColumn(name = "user_seq")
//    @ManyToOne(fetch = FetchType.LAZY)
//    User user;
//
//    @JoinColumn(name = "room_seq")
//    @ManyToOne(fetch = FetchType.LAZY)
//    Studyroom studyroom;


}
