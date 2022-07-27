package com.ssafy.db.entity;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Table(name = "Common")
public class Common {
    
    @Id
    @Column(name = "common_seq")        
    int commonSeq;
    
    @Column(name = "img_group")
    String imgGroup;
    
    @Column(name = "img_name")
    String imgName;
    
    @Column(name = "img_url")
    String imgUrl;

    @OneToMany(mappedBy = "common")
    List<Studyroom> studyrooms = new ArrayList<>();

    @OneToMany(mappedBy = "common")
    List<Badge> badges = new ArrayList<>();

    public Common() {} // 기본 생성자

    @Builder
    public Common(String imgGroup, String imgName, String imgUrl) {
        this.imgGroup = imgGroup;
        this.imgName = imgName;
        this.imgUrl = imgUrl;
    }
}
