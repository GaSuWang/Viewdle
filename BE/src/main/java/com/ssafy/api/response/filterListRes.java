package com.ssafy.api.response;

import io.swagger.annotations.ApiModel;
import lombok.Builder;
import lombok.Data;

@Data
@ApiModel("filterListRes")
public class filterListRes {

    String imgName;
    String imgUrl;

    @Builder
    public filterListRes(String imgName, String imgUrl){
        this.imgName = imgName;
        this.imgUrl = imgUrl;
    }
}
