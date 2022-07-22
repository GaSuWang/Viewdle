package com.ssafy.api.request;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Column;

/**
 * 유저 회원가입 API ([POST] /api/v1/users) 요청에 필요한 리퀘스트 바디 정의.
 */
@Getter
@Setter
@ApiModel("UserRegisterPostRequest")
public class UserRegisterPostReq {
	/*@ApiModelProperty(name="유저 ID", example="ssafy_web")
	String id;
	@ApiModelProperty(name="유저 Password", example="your_password")
	String password;*/

	String userEmail;

	String userName;


	String userPassword;

	String userRegTime;


	int userModUserSeq;


	String userModTime;


	String userDelYN;


	String userProfileImage;


	String userMainBadge;


	String userTotalTime;


	String userTotalVideo;

}
