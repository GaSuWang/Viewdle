package com.ssafy.api.request;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@ApiModel("UserBadge")
public class UserBadgePutReq {

    @ApiModelProperty(name="매인 뱃지 URL")
    private String Badge;

}
