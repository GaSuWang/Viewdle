package com.ssafy.db.repository;

import com.ssafy.db.entity.Studyroom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudyroomRepository extends JpaRepository<Studyroom, Long> {

    Studyroom findByroomSeq(int roomSeq);
}