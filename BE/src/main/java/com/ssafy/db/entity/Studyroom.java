package com.ssafy.db.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter

@Table(name="Studyroom")
/*
* `room_seq` INT NOT NULL AUTO_INCREMENT,
  `room_type` TINYINT NOT NULL,
  `room_title` VARCHAR(20) NOT NULL,
  `room_private_YN` VARCHAR(1) NOT NULL DEFAULT 'N',
  `room_password` VARCHAR(15) NULL,
  `room_limit` INT NOT NULL,
  `room_reg_time` VARCHAR(20) NOT NULL,
  `room_close_time` VARCHAR(20) NULL,
  `room_close_YN` VARCHAR(1) NOT NULL DEFAULT 'N',
  `room_active_YN` VARCHAR(1) NOT NULL DEFAULT 'N',
  `room_full_YN` VARCHAR(1) NOT NULL DEFAULT 'N',
  `user_seq` INT NOT NULL,
  `common_seq` INT NOT NULL,
* */
public class Studyroom {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "room_seq")
    int roomSeq;

    @Column(name = "room_type", columnDefinition = "TINYINT", length=1)
    int roomType;

    @Column(name = "room_title")
    String roomTitle;

    @Column(name = "room_private_YN")
    String roomPrivateYN;

    @Column(name = "room_password")
    String roomPassword;

    @Column(name = "room_limit")
    int roomLimit;

    @Column(name = "room_reg_time")
    String roomRegTime;

    @Column(name = "room_close_time")
    String roomCloseTime;

    @Column(name = "room_close_YN")
    String roomCloseYN;

    @Column(name = "room_active_YN")
    String roomActiveYN;

    @Column(name = "room_full_YN")
    String roomFullYN;

    @Column(name = "user_seq")
    int UserSeq;

    @Column(name = "common_seq")
    int commonSeq;

//    @OneToMany(mappedBy = "Studyroom")
//    private List<Participant> Participants = new ArrayList<>();
}
