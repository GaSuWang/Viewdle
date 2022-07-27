package com.ssafy.api.request;


import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@ApiModel("RoomRegisterPostReq")
public class RoomRegisterPostReq {

    @ApiModelProperty(name = "스터디 룸 타입", example = "1")
    int type;

    @ApiModelProperty(name = "스터디 룸 이름", example = "같이 면접 스터디 할 사람")
    String title;

    @ApiModelProperty(name = "스터디 룸 공개여부", example = "Y")
    String privateYN;

    @ApiModelProperty(name = "스터디 룸 비밀번호", example = "1234")
    String password;

    @ApiModelProperty(name = "스터디 룸 최대인원", example = "5")
    int limit;
    
    @ApiModelProperty(name = "스터디 룸 썸네일 일련번호", example = "1")
    int commonSeq;

}
