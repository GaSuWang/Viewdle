package com.ssafy.api.request;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
@ApiModel("UserPwdReq")
public class UserPwdReq {
    @ApiModelProperty(name="비밀번호")
    String Password;
}
