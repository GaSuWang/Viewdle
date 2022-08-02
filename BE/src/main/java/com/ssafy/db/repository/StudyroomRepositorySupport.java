package com.ssafy.db.repository;

import com.querydsl.core.types.Order;
import com.querydsl.core.types.OrderSpecifier;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.api.response.RoomListRes;
import com.ssafy.db.entity.QCommon;
import com.ssafy.db.entity.QStudyroom;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class StudyroomRepositorySupport {

    private final JPAQueryFactory jpaQueryFactory;
    QStudyroom studyroom = QStudyroom.studyroom;
    QCommon common = QCommon.common;

    public List<RoomListRes> findStudyroomByWhere(String order, Integer type, String privateYN, String FullYN){
        return jpaQueryFactory
                .select(Projections.constructor(RoomListRes.class,
                        studyroom.roomSeq,
                        studyroom.roomType,
                        studyroom.roomTitle,
                        studyroom.roomPrivateYN,
                        studyroom.roomLimit,
                        studyroom.roomRegTime,
                        studyroom.roomActiveYN,
                        studyroom.roomFullYN,
                        common.imgUrl
                ))
                .from(studyroom)
                .leftJoin(studyroom.common, common)
//                .join(studyroom.common, common).fetchJoin()
                .where(
                        typeEq(type),
                        privateEq(privateYN),
                        fullEq(FullYN),
                        studyroom.roomCloseYN.eq("N")
                )
                .orderBy(orderEq(order))
                .fetch();
    }

    private BooleanExpression typeEq(Integer type){
        return type != null ? studyroom.roomType.eq(type) : null;
    }

    private BooleanExpression privateEq(String privateYN){
        return privateYN != null ? studyroom.roomPrivateYN.eq(privateYN) : null;
    }

    private BooleanExpression fullEq(String fullYN){
        return fullYN != null ? studyroom.roomFullYN.eq(fullYN) : null;
    }

    private OrderSpecifier<String> orderEq(String order){
        if(order != null) {
            if(order.toUpperCase().equals("ASC")) return new OrderSpecifier(Order.ASC, studyroom.roomSeq);
            else if(order.toUpperCase().equals("DESC")) return new OrderSpecifier(Order.DESC, studyroom.roomSeq);
        }
        return new OrderSpecifier(Order.DESC, studyroom.roomSeq);
    }

    public List<RoomListRes> searchStudyroom(String keyword){
        return jpaQueryFactory
                .select(Projections.constructor(RoomListRes.class,
                        studyroom.roomSeq,
                        studyroom.roomType,
                        studyroom.roomTitle,
                        studyroom.roomPrivateYN,
                        studyroom.roomLimit,
                        studyroom.roomRegTime,
                        studyroom.roomActiveYN,
                        studyroom.roomFullYN,
                        common.imgUrl
                ))
                .from(studyroom)
                .leftJoin(studyroom.common, common)
                .where(studyroom.roomTitle.contains(keyword),
                        studyroom.roomCloseYN.eq("N"))
                .fetch();
    }
}
