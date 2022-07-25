package com.ssafy.db.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * 유저 모델 정의.
 */
@Entity
@Getter
@Setter
/*
*  `user_seq` INT NOT NULL AUTO_INCREMENT,
  `user_email` VARCHAR(40) NOT NULL,
  `user_name` VARCHAR(10) NOT NULL,
  `user_password` VARCHAR(20) NOT NULL,
  `user_reg_time` VARCHAR(20) NOT NULL,
  `user_mod_user_seq` INT NULL,
  `user_mod_time` VARCHAR(20) NULL,
  `user_del_YN` VARCHAR(1) NOT NULL DEFAULT 'N',
  `user_profile_image` VARCHAR(255) NOT NULL,
  `user_main_badge` VARCHAR(255) NOT NULL,
  `user_total_time` VARCHAR(20) NOT NULL DEFAULT 0,
  `user_total_video` INT NOT NULL DEFAULT 0,
* */

@Table(name="User")
public class User{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="user_seq")
    int userSeq;

    @Column(name="user_email")
    String userEmail;

    @Column(name="user_name")
    String userName;

    @Column(name="user_password")
    String userPassword;

    @Column(name="user_reg_time")
    String userRegTime;

    @Column(name="user_mod_time")
    String userModTime;

    @Column(name="user_mod_user_seq")
    int userModUserSeq;

    @Column(name="user_del_YN")
    String userDelYN;

    @Column(name="user_profile_image")
    String userProfileImage;

    @Column(name="user_main_badge")
    String userMainBadge;

    @Column(name="user_total_time")
    String userTotalTime;

    @Column(name="user_total_video")
    int userTotalVideo;

    @PrePersist
    public void prePersist(){
        String now = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy:MM:dd:hh:mm:ss"));
        userRegTime = now;
        userModTime = now;
        userDelYN = "N";
        userTotalTime = "0";
        userTotalVideo = 0;
        userProfileImage = "resources/static/image/profile.png";
        userMainBadge = "resources/static/image/welcome.png";
    }

    @PreUpdate
    public void preUpdate(){
        String now = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy:MM:dd:hh:mm:ss"));
        userModTime = now;
    }

//    @OneToMany(mappedBy = "User")
//    private List<Participant> Participants = new ArrayList<>();


    /*String position;
    String department;
    String name;
    String userId;

    @JsonIgnore
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    String password;*/
}
