package com.ssafy.api.response;

import com.ssafy.common.model.response.BaseResponseBody;
import io.swagger.annotations.ApiModel;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@ApiModel("RoomRegisterPostRes")
public class RoomRegisterPostRes extends BaseResponseBody {

    int roomSeq;

    public static RoomRegisterPostRes of(Integer statusCode, String message, int roomSeq){
        RoomRegisterPostRes res = new RoomRegisterPostRes();
        res.setStatusCode(statusCode);
        res.setMessage(message);
        res.setRoomSeq(roomSeq);

        return res;
    }

}
