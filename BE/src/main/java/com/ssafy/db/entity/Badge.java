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
    int badgeSeq;

    @ManyToOne
    @JoinColumn(name = "common_seq")
    Common common;
    
    public Badge() {} // 기본 생성자
}
