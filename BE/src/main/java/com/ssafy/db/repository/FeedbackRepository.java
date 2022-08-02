package com.ssafy.db.repository;

import com.ssafy.db.entity.Feedback;
import com.ssafy.db.entity.Video;
import com.ssafy.db.mapping.FeedbackResMapping;
import org.kurento.client.internal.server.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {

    public List<FeedbackResMapping> findByVideo(Video video);

    @Modifying
    @Query(value = "delete from feedback f where f.video_seq = :videoSeq", nativeQuery = true)
    public void deleteAllByWhere(@Param("videoSeq") int videoSeq);
}
