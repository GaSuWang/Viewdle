package com.ssafy.api.request;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@ApiModel("RoomEnterPostReq")
public class RoomEnterPostReq {

    @ApiModelProperty(name = "스터디 룸 식별번호", example = "1")
    int roomSeq;

    @ApiModelProperty(name = "스터디 룸 비밀번호", example = "1234")
    String roomPassword;
}

