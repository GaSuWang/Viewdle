package com.ssafy.api.request;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@ApiModel("UserChangePasswordRequest")
public class UserChangePwdReq {
    @ApiModelProperty(name="비밀번호 1")
    String password;
    @ApiModelProperty(name="비밀번호 2")
    String password2;
}
