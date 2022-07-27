package com.ssafy.api.service;

import com.ssafy.db.entity.Studyroom;
import com.ssafy.db.entity.User;

public interface ParticipantService {

    public int registParticipant(String isOwner, User user, Studyroom studyroom);
}
