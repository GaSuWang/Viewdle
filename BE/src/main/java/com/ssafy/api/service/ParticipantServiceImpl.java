package com.ssafy.api.service;

import com.ssafy.db.entity.Participant;
import com.ssafy.db.entity.Studyroom;
import com.ssafy.db.entity.User;
import com.ssafy.db.mapping.ParticipantResMapping;
import com.ssafy.db.repository.ParticipantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ParticipantServiceImpl implements ParticipantService {

    @Autowired
    ParticipantRepository participantRepository;

    @Override
    public int registParticipant(String isOwner, User user, Studyroom studyroom) {
        Participant participant = Participant.builder()
                .roomOwnerYN(isOwner)
                .user(user)
                .studyroom(studyroom)
                .build();
        return participantRepository.save(participant).getParticipantSeq();
    }

    @Override
    public ParticipantResMapping findRecentByUserSeq(User user) {
        return participantRepository.findTopByUserOrderByParticipantSeqDesc(user);
    }

    @Override
    public List<ParticipantResMapping> findInStudyroomUser(Studyroom studyroom, String enteryn) {
        return participantRepository.findByStudyroomAndParticipantEnterYN(studyroom, enteryn);
    }

    @Override
    public void outUser(int participantSeq) {
        Participant participant = participantRepository.findByParticipantSeq(participantSeq);
        participant.setParticipantEnterYN("N");
        participantRepository.save(participant);
    }
}
