package com.ssafy.api.service;

import com.ssafy.db.entity.Common;
import com.ssafy.db.repository.CommonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CommonServiceImpl implements CommonService{

    @Autowired
    CommonRepository commonRepository;

    @Override
    public Common getCommonBySeq(int commonSeq) {
        Common common = commonRepository.findByCommonSeq(commonSeq);

        // 추후 exception 처리 추가 할 것
        return common;
    }
}
