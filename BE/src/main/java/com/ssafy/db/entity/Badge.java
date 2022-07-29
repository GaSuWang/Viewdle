package com.ssafy.db.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Getter
@Setter
@Table(name = "Badge")
public class Badge {
    
    @Id
    @Column(name = "badge_seq")        
    private int badgeSeq;

    @ManyToOne
    @JoinColumn(name="user_seq")
    private User user;

    @ManyToOne
    @JoinColumn(name = "common_seq")
    private Common common;

    public Badge() {} // 기본 생성자
}
