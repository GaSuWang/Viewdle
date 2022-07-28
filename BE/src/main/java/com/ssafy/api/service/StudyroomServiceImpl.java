package com.ssafy.api.service;

import com.ssafy.api.request.RoomRegisterPostReq;
import com.ssafy.db.entity.Common;
import com.ssafy.db.entity.Studyroom;
import com.ssafy.db.entity.User;
import com.ssafy.db.repository.StudyroomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
}
