package com.ssafy.api.response;

import com.ssafy.db.entity.Common;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class UserBadgeRes {
    @ApiModelProperty(name="Common Seq")
    int commonSeq;
    @ApiModelProperty(name="img Group")
    String imgGroup;
    @ApiModelProperty(name="img Name")
    String imgName;
    @ApiModelProperty(name="img Url")
    String imgUrl;

    public UserBadgeRes(Common common) {
    }
}
