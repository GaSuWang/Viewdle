package com.ssafy.db.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * 모델 간 공통 사항 정의.
 */
@Getter
@Setter
@MappedSuperclass
public class BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id = null;

    @Column(updatable = false)
    private LocalDateTime reg_time;
    private LocalDateTime mod_time;

    @PrePersist
    public void prePersist(){
        LocalDateTime now = LocalDateTime.now();
        reg_time = now;
        mod_time = now;
    }

    @PreUpdate
    public void preUpdate(){
        mod_time = LocalDateTime.now();
    }

}
