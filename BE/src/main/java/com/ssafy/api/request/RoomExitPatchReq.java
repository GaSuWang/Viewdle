package com.ssafy.api.request;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@ApiModel("RoomExitPatchReq")
public class RoomExitPatchReq {

    @ApiModelProperty(name = "스터디 룸 식별번호", example = "1")
    int roomSeq;

//    @ApiModelProperty(name = "방장 여부", example = "Y")
//    String ownerYN;

    @ApiModelProperty(name = "다음 방장 이메일", example = "kimssafy@ssafy.com")
    String nextOwnerEmail;

    @ApiModelProperty(name = "이용 시간", example = "7200")
    int time;

}
