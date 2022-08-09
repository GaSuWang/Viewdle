package com.ssafy.api.request;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@ApiModel("소셜로그인 회원가입")
public class SocialSignupInfoReq {
    @ApiModelProperty(name="아이디 토큰")
    String idToken;

    @ApiModelProperty(name="비밀번호")
    String password;

    @ApiModelProperty(name="비밀번호2")
    String password2;
}
