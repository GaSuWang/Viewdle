package com.ssafy.db.repository;

import com.ssafy.db.entity.Participant;
import com.ssafy.db.entity.User;
import com.ssafy.db.mapping.ParticipantResMapping;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ParticipantRepository extends JpaRepository<Participant, Long> {
    ParticipantResMapping findTopByUserOrderByParticipantSeqDesc(User user);
}
