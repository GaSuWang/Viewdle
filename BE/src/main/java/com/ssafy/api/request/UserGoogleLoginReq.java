package com.ssafy.api.request;

import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserGoogleLoginReq {
    @ApiModelProperty(name="구글 로그인 토큰", example="구글 로그인 토큰")
    String googleToken;
}
