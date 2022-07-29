package com.ssafy.api.request;

import io.swagger.annotations.ApiModel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@ToString
@Setter
@Getter
@NoArgsConstructor
@ApiModel("RoomListGetReq")
public class RoomListGetReq {

    int roomType;
    String roomPrivateYN;
    String roomFullYN;
    String order;
}
