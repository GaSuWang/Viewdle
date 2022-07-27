package com.ssafy.api.response;

import com.ssafy.common.model.response.BaseResponseBody;
import com.ssafy.db.entity.User;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Column;

/**
 * 회원 본인 정보 조회 API ([GET] /api/v1/users/me) 요청에 대한 응답값 정의.
 */
@Getter
@Setter
@ApiModel("UserResponse")
public class UserRes{
	@ApiModelProperty(name="User Seq")
	int userSeq;

	@ApiModelProperty(name="userEmail")
	String userEmail;

	@ApiModelProperty(name="userName")
	String userName;

	@ApiModelProperty(name="userProfileImage")
	String userProfileImage;

	@ApiModelProperty(name="userProfileImage")
	String userMainBadge;

	@ApiModelProperty(name="userTotalTime")
	String userTotalTime;

	@ApiModelProperty(name="userTotalVideo")
	int userTotalVideo;

	public static UserRes of(User user) {
		UserRes res = new UserRes();
		res.setUserSeq(user.getUserSeq());
		res.setUserEmail(user.getUserEmail());
		res.setUserName(user.getUserName());
		res.setUserProfileImage(user.getUserProfileImage());
		res.setUserMainBadge(user.getUserMainBadge());
		res.setUserTotalTime(user.getUserTotalTime());
		res.setUserTotalVideo(user.getUserTotalVideo());
		return res;
	}
}
