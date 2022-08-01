package com.ssafy.api.controller;

import com.ssafy.api.request.UserGoogleLoginReq;
import com.ssafy.api.request.UserLoginPostReq;
import com.ssafy.api.request.UserRegisterPostReq;
import com.ssafy.api.response.UserLoginPostRes;
import com.ssafy.common.model.response.BaseResponseBody;
import com.ssafy.common.oauth2.CustomOAuth2UserService;
import com.ssafy.common.oauth2.TokenService;
import com.ssafy.common.util.JwtTokenUtil;
import com.ssafy.db.entity.User;
import io.swagger.annotations.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.api.service.UserService;
import springfox.documentation.annotations.ApiIgnore;

/**
 * 인증 관련 API 요청 처리를 위한 컨트롤러 정의.
 */
@Api(value = "인증 API", tags = {"Auth."})
@RestController
@RequestMapping("/api/v1/social")
public class SocialController {

	CustomOAuth2UserService customOAuth2UserService;

	TokenService tokenService;

	UserService userService;

//	@PostMapping("/google")
//	@ApiOperation(value = "구글 로그인", notes = "구글 엑세스 토큰으로 사용자 정보 받아 저장하기")
//    @ApiResponses({
//        @ApiResponse(code = 200, message = "성공", response = UserLoginPostRes.class),
//        @ApiResponse(code = 401, message = "인증 실패", response = BaseResponseBody.class),
//        @ApiResponse(code = 404, message = "사용자 없음", response = BaseResponseBody.class),
//        @ApiResponse(code = 500, message = "서버 오류", response = BaseResponseBody.class)
//    })
//	public ResponseEntity<UserLoginPostRes> googleAuthRequest(@RequestBody UserGoogleLoginReq googleLoginReq) {
//		if(tokenService.verifyToken(googleLoginReq.getGoogleToken())){
//			String email = tokenService.getUid(googleLoginReq.getGoogleToken());
//
//			if(userService.getUserByUserEmail(email) == null){
//				//이메일이 없으면 회원가입하고 로그인하고 토큰발급
//
//			} else {
//				//이메일 있으면 로그인하고 토큰 발급
//
//			}
//
//			return ResponseEntity.status(401).body(UserLoginPostRes.of(401, "인증에 실패했습니다.", null));
//		} else {
//			return ResponseEntity.status(401).body(UserLoginPostRes.of(401, "인증에 실패했습니다.", null));
//		}
//	}

	@PostMapping("/google")
	@ApiOperation(value = "구글 로그인", notes = "구글 엑세스 토큰으로 사용자 정보 받아 저장하기")
	@ApiResponses({
			@ApiResponse(code = 200, message = "성공", response = UserLoginPostRes.class),
			@ApiResponse(code = 401, message = "인증 실패", response = BaseResponseBody.class),
			@ApiResponse(code = 404, message = "사용자 없음", response = BaseResponseBody.class),
			@ApiResponse(code = 500, message = "서버 오류", response = BaseResponseBody.class)
	})
	public ResponseEntity<UserLoginPostRes> googleAuthRequest(@ApiIgnore Authentication authentication, @RequestBody String email) {
		OAuth2User googleUser = (OAuth2User) authentication.getPrincipal();
		if(userService.getUserByUserEmail(email) == null){
			// 회원가입
			UserRegisterPostReq userInfo = new UserRegisterPostReq(email, googleUser.getName(), "google", "google");
			userService.createUser(userInfo);
		}
		return ResponseEntity.status(200).body(UserLoginPostRes.of(200, "로그인 되었습니다.", JwtTokenUtil.getToken(email)));
	}
}
