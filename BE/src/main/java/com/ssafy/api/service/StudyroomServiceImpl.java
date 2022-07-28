package com.ssafy.api.service;

import com.ssafy.api.request.RoomRegisterPostReq;
import com.ssafy.db.entity.Common;
import com.ssafy.db.entity.Studyroom;
import com.ssafy.db.entity.User;
import com.ssafy.db.mapping.StudyroomResMapping;
import com.ssafy.db.repository.StudyroomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class StudyroomServiceImpl implements StudyroomService{

    @Autowired
    StudyroomRepository studyroomRepository;

    @Override
    public int registRoom(RoomRegisterPostReq roomRegisterPostReq, User user, Common common) {
        Studyroom studyroom = Studyroom.builder()
                .roomType(roomRegisterPostReq.getType())
                .roomTitle(roomRegisterPostReq.getTitle())
                .roomPrivateYN(roomRegisterPostReq.getPrivateYN())
                .roomPassword(roomRegisterPostReq.getPassword())
                .roomLimit(roomRegisterPostReq.getLimit())
                .user(user)
                .common(common)
                .build();
        return studyroomRepository.save(studyroom).getRoomSeq();
    }

    @Override
    public Studyroom getRoomBySeq(int roomSeq) {
        Studyroom studyroom = studyroomRepository.findByroomSeq(roomSeq);
        return studyroom;
    }

    @Override
    public void closeRoom(int roomSeq) {
        String now = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy:MM:dd:hh:mm:ss"));
        Studyroom studyroom = studyroomRepository.findByroomSeq(roomSeq);
        studyroom.setRoomCloseYN("Y");
        studyroom.setRoomCloseTime(now);
        studyroomRepository.save(studyroom);
    }

    @Override
    public void startInterview(int roomSeq) {
        Studyroom studyroom = studyroomRepository.findByroomSeq(roomSeq);
        studyroom.setRoomActiveYN("Y");
        studyroomRepository.save(studyroom);
    }

    @Override
    public void endInterview(int roomSeq) {
        Studyroom studyroom = studyroomRepository.findByroomSeq(roomSeq);
        studyroom.setRoomActiveYN("N");
        studyroomRepository.save(studyroom);
    }

    @Override
    public void fullRoom(int roomSeq) {
        Studyroom studyroom = studyroomRepository.findByroomSeq(roomSeq);
        studyroom.setRoomFullYN("Y");
        studyroomRepository.save(studyroom);
    }

    @Override
    public void notFullRoom(int roomSeq) {
        Studyroom studyroom = studyroomRepository.findByroomSeq(roomSeq);
        studyroom.setRoomFullYN("N");
        studyroomRepository.save(studyroom);
    }

    @Override
    public List<StudyroomResMapping> getRooms(String enteryn) {
        return studyroomRepository.findByRoomCloseYN(enteryn);
    }
}
