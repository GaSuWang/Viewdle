package com.ssafy.api.service;

import com.ssafy.db.entity.Participant;
import com.ssafy.db.entity.Studyroom;
import com.ssafy.db.entity.User;
import com.ssafy.db.mapping.ParticipantResMapping;

public interface ParticipantService {

    public int registParticipant(String isOwner, User user, Studyroom studyroom);
    public ParticipantResMapping findRecentByUserSeq(User user);
}
