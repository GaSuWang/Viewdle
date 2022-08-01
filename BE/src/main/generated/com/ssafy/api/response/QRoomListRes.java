package com.ssafy.api.response;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.ConstructorExpression;
import javax.annotation.Generated;

/**
 * com.ssafy.api.response.QRoomListRes is a Querydsl Projection type for RoomListRes
 */
@Generated("com.querydsl.codegen.ProjectionSerializer")
public class QRoomListRes extends ConstructorExpression<RoomListRes> {

    private static final long serialVersionUID = -1244811531L;

    public QRoomListRes(com.querydsl.core.types.Expression<Integer> roomSeq, com.querydsl.core.types.Expression<Integer> roomType, com.querydsl.core.types.Expression<String> roomTitle, com.querydsl.core.types.Expression<String> roomPrivateYN, com.querydsl.core.types.Expression<Integer> roomLimit, com.querydsl.core.types.Expression<String> roomRegTime, com.querydsl.core.types.Expression<String> roomActiveYN, com.querydsl.core.types.Expression<String> roomFullYN) {
        super(RoomListRes.class, new Class<?>[]{int.class, int.class, String.class, String.class, int.class, String.class, String.class, String.class}, roomSeq, roomType, roomTitle, roomPrivateYN, roomLimit, roomRegTime, roomActiveYN, roomFullYN);
    }

}

