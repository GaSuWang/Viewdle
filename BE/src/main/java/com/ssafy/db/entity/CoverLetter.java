package com.ssafy.db.entity;

import lombok.*;
import org.checkerframework.checker.units.qual.C;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Entity
@Getter
@Setter
//@builder 사용을 위한 기본생성자 접근 제한
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class CoverLetter {
    /*
    *   `coverletter_seq` INT NOT NULL AUTO_INCREMENT,
  `coverletter_title` INT NOT NULL,
  `coverletter_content` TEXT NOT NULL,
  `coverletter_reg_time` VARCHAR(20) NOT NULL,
  `user_seq` INT NOT NULL,
  PRIMARY KEY (`coverletter_seq`),
  INDEX `fk_CoverLetter_User_idx` (`user_seq` ASC) VISIBLE,
  CONSTRAINT `fk_CoverLetter_User`
    FOREIGN KEY (`user_seq`)
    REFERENCES `viewdle`.`User` (`user_seq`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
    *
    * */




    @Id
    @Column(name="coverletter_seq")
    private int coverLetterSeq;

    @Column(name="coverletter_title")
    private String coverLetterTitle;

    @Column(name="coverletter_content")
    private String coverLetterContent;

    @Column(name="coverletter_reg_time")
    private String coverLetterRegTime;

    @ManyToOne
    @JoinColumn(name="user_seq")
    private User user;

    //builder 사용을 위한 생성자
    @Builder
    public CoverLetter(String coverLetterTitle, String coverLetterContent, User user){
        this.coverLetterTitle = coverLetterTitle;
        this.coverLetterContent = coverLetterContent;
        this.user = user;
    }

    //insert 전에 등록시간 넣어주기
    @PrePersist
    public void prePersist(){
        String now = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy:MM:dd:hh:mm:ss"));
        coverLetterRegTime = now;
    }



}
