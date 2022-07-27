package com.ssafy.db.entity;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@ToString
@Table(name="Studyroom")
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

    @OneToMany(mappedBy = "studyroom")
    List<Participant> participants = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "user_seq")
    User user;

    @ManyToOne
    @JoinColumn(name = "common_seq")
    Common common;

    public Studyroom(){} // 기본 생성자

    @PrePersist
    public void prePersist(){
        String now = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy:MM:dd:hh:mm:ss"));
        roomRegTime = now;
        roomCloseYN = "N";
        roomActiveYN = "N";
        roomFullYN = "N";
    }

    @Builder
    public Studyroom(int roomType, String roomTitle, String roomPrivateYN, String roomPassword, int roomLimit, User user, Common common) {
        this.roomType = roomType;
        this.roomTitle = roomTitle;
        this.roomPrivateYN = roomPrivateYN;
        this.roomPassword = roomPassword;
        this.roomLimit = roomLimit;
        this.user = user;
        this.common = common;
    }
}
