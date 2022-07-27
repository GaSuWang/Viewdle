package com.ssafy.db.repository;

import com.ssafy.api.response.CoverLetterRes;
import com.ssafy.db.entity.CoverLetter;
import com.ssafy.db.entity.User;
import com.ssafy.db.mapping.CoverLetterResMapping;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CoverLetterRepository extends JpaRepository<CoverLetter,Integer> {
    List<CoverLetterResMapping> findByUser(User user);
}
