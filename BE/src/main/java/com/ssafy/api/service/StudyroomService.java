package com.ssafy.api.service;

import com.ssafy.api.request.RoomRegisterPostReq;
import com.ssafy.db.entity.Common;
import com.ssafy.db.entity.Studyroom;
import com.ssafy.db.entity.User;

public interface StudyroomService {

    public int registRoom(RoomRegisterPostReq roomRegisterPostReq, User user, Common common) ;
    public Studyroom getRoomBySeq(int roomSeq);
    public void closeRoom(int roomSeq);
    public void startInterview(int roomSeq);
    public void endInterview(int roonSeq);

}
