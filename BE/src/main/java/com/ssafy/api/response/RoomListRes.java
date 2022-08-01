package com.ssafy.api.response;

import com.querydsl.core.annotations.QueryProjection;
import com.ssafy.db.entity.Studyroom;
import lombok.Data;

@Data
public class RoomListRes {

    int roomSeq;
    int roomType;
    String roomTitle;
    String roomPrivateYN;
//    String roomPassword;
    int roomLimit;
    String roomRegTime;
    String roomActiveYN;
    String roomFullYN;


    // Q-type을 만들기위한 어노테이션 => 동작하는지 잘 모르겠음.
    @QueryProjection
    public RoomListRes(int roomSeq, int roomType, String roomTitle, String roomPrivateYN, int roomLimit, String roomRegTime, String roomActiveYN, String roomFullYN) {
        this.roomSeq = roomSeq;
        this.roomType = roomType;
        this.roomTitle = roomTitle;
        this.roomPrivateYN = roomPrivateYN;
        this.roomLimit = roomLimit;
        this.roomRegTime = roomRegTime;
        this.roomActiveYN = roomActiveYN;
        this.roomFullYN = roomFullYN;
    }
}
