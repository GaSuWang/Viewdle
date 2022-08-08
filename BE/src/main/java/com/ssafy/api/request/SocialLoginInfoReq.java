package com.ssafy.api.request;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@ApiModel("소셜로그인 아이디")
public class SocialLoginInfoReq {
    @ApiModelProperty(name="아이디 토큰")
    String idToken;
}
