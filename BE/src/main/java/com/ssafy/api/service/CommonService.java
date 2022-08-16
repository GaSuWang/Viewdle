package com.ssafy.api.service;

import com.ssafy.api.response.filterListRes;
import com.ssafy.db.entity.Common;

import java.util.List;

public interface CommonService {

    Common getCommonBySeq(int commonSeq);
    List<filterListRes> getFilter();
}
