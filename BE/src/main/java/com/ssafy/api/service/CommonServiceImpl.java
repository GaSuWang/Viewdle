package com.ssafy.api.service;

import com.ssafy.api.response.filterListRes;
import com.ssafy.db.entity.Common;
import com.ssafy.db.repository.CommonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

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

    @Override
    public List<filterListRes> getFilter() {
        return commonRepository.findByImgGroup("filter");
    }
}
