package com.ssafy.api.service;

import com.ssafy.db.entity.Participant;
import com.ssafy.db.entity.Studyroom;
import com.ssafy.db.entity.User;
import com.ssafy.db.mapping.ParticipantResMapping;

import java.util.List;

public interface ParticipantService {

    public int registParticipant(String isOwner, User user, Studyroom studyroom);
    public ParticipantResMapping findRecentByUserSeq(User user);
    public List<ParticipantResMapping> findInStudyroomUser(Studyroom studyroom, String enteryn);
    public void outUser(int participantSeq, User user, int time);
    public long countInStudyroomUser(Studyroom studyroom, String enteryn);
    public void exitOwner(int participantSeq, User user, int time);
    public void changeOwner(int participantSeq);
    public void timeUpdate(String userTime, int inputTime, User user);
}
