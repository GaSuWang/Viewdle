package com.ssafy.db.repository;

import com.ssafy.api.response.filterListRes;
import com.ssafy.db.entity.Common;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommonRepository extends JpaRepository<Common, Long> {

    Common findByCommonSeq(int commonSeq);
    List<filterListRes> findByImgGroup(String imgGroup);
}
