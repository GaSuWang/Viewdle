package com.ssafy.db.repository;

import com.ssafy.db.entity.Participant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ParticipantRepository extends JpaRepository<Participant, Long> {
    @Query(value = "select participant_date from  participant group by using_date where user_seq > : userSeq", nativeQuery = true)
    List<String> findUsingDate(@Param(value = "userSeq")int userSeq);
}

