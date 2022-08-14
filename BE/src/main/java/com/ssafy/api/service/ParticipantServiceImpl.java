package com.ssafy.api.service;

import com.ssafy.db.entity.Participant;
import com.ssafy.db.entity.Studyroom;
import com.ssafy.db.entity.User;
import com.ssafy.db.mapping.ParticipantResMapping;
import com.ssafy.db.repository.ParticipantRepository;
import com.ssafy.db.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.StringTokenizer;

@Service
public class ParticipantServiceImpl implements ParticipantService {

    @Autowired
    ParticipantRepository participantRepository;

    @Autowired
    UserRepository userRepository;

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
    public void outUser(int participantSeq, User user, int time) {
        Participant participant = participantRepository.findByParticipantSeq(participantSeq);
        participant.setParticipantEnterYN("N");
        participantRepository.save(participant);

        // 시간 업데이트
        timeUpdate(user.getUserTotalTime(), time, user);
    }

    @Override
    public long countInStudyroomUser(Studyroom studyroom, String enteryn) {
        return participantRepository.countByStudyroomAndParticipantEnterYN(studyroom, enteryn);
    }

    @Override
    public void exitOwner(int participantSeq, User user, int time) {
        Participant participant = participantRepository.findByParticipantSeq(participantSeq);
        participant.setParticipantEnterYN("N");
        participant.setRoomOwnerYN("N");
        participantRepository.save(participant);

        // 시간 업데이트
        timeUpdate(user.getUserTotalTime(), time, user);
    }

    @Override
    public void changeOwner(int participantSeq) {
        Participant participant = participantRepository.findByParticipantSeq(participantSeq);
        participant.setRoomOwnerYN("Y");
        participantRepository.save(participant);
    }

    @Override
    public void timeUpdate(String userTime, int inputTime, User user) {
        StringTokenizer st = new StringTokenizer(userTime, ":");
        int userHour = Integer.parseInt(st.nextToken());
        int userMin = Integer.parseInt(st.nextToken());
        int userSec = Integer.parseInt(st.nextToken());

        int inputHour = 0, inputMin = 0, inputSec = 0;
        inputHour = inputTime/3600;
        inputTime %= 3600;
        inputMin = inputTime/60;
        inputSec = inputTime%60;

        int hour = userHour + inputHour;
        int min = userMin + inputMin;
        int sec = userSec + inputSec;

        if(sec >= 60){
            min++;
            sec -= 60;
        }

        if(min >= 60){
            hour++;
            min -= 60;
        }

        StringBuilder sb = new StringBuilder();
        sb.append(hour).append(":").append(min).append(":").append(sec);
        user.setUserTotalTime(sb.toString());
        userRepository.save(user);
    }
}
