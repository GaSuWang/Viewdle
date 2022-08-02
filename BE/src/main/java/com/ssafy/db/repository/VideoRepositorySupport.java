package com.ssafy.db.repository;

import com.querydsl.core.types.Order;
import com.querydsl.core.types.OrderSpecifier;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.api.response.QVideoListRes;
import com.ssafy.api.response.VideoListRes;
import com.ssafy.db.entity.QFeedback;
import com.ssafy.db.entity.QVideo;
import com.ssafy.db.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Locale;

@Repository
@RequiredArgsConstructor
public class VideoRepositorySupport {

    private final JPAQueryFactory jpaQueryFactory;
    QVideo video = QVideo.video;
    QFeedback feedback = QFeedback.feedback;

    public List<VideoListRes> findVideoByOrder(User user, String order){
        return jpaQueryFactory
                .select(new QVideoListRes(
                        video.videoSeq,
                        video.videoTitle,
                        video.videoUrl,
                        video.videoRegTime))
                .from(video)
                .where(video.user.eq(user))
                .orderBy(orderEq(order))
                .fetch();
    }

    private OrderSpecifier<String> orderEq(String order){
        if(order != null) {
            if(order.toUpperCase().equals("ASC")) return new OrderSpecifier(Order.ASC, video.videoSeq);
            else if(order.toUpperCase().equals("DESC")) return new OrderSpecifier(Order.DESC, video.videoSeq);
        }
        return new OrderSpecifier(Order.DESC, video.videoSeq);
    }

}
