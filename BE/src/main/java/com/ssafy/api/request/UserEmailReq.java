package com.ssafy.api.request;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@ApiModel("UserDuplicateEmailReq")
public class UserEmailReq {
        @ApiModelProperty(name="이메일")
        String email;
}
