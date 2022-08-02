package com.ssafy.db.repository;

import com.ssafy.db.entity.Feedback;
import com.ssafy.db.entity.Video;
import com.ssafy.db.mapping.FeedbackResMapping;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {

    public List<FeedbackResMapping> findByVideo(Video video);
}
