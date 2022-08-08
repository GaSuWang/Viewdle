package com.ssafy.api.controller;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.jackson2.JacksonFactory;

import com.ssafy.api.request.SocialLoginInfoReq;
import com.ssafy.api.request.SocialSignupInfoReq;
import com.ssafy.api.response.UserLoginPostRes;
import com.ssafy.common.exception.AlreadyExistEmailException;
import com.ssafy.common.exception.NotMatchPasswordException;
import com.ssafy.common.model.response.BaseResponseBody;

import com.ssafy.common.util.JwtTokenUtil;
import com.ssafy.db.entity.User;
import io.swagger.annotations.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.api.service.UserService;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;

import java.util.Collections;


/**
 * 인증 관련 API 요청 처리를 위한 컨트롤러 정의.
 */
@Api(value = "인증 API", tags = {"Social"})
@RestController
@RequestMapping("/api/v1/social")
public class SocialController {
	@Value("${google.client.id}")
	private String googleClientId;
	@Autowired
	UserService userService;

	@PostMapping("/google/signup")
	@ApiOperation(value = "구글 회원가입", notes = "구글 엑세스 토큰으로 사용자 정보 받아 저장하기")
	@ApiResponses({
			@ApiResponse(code = 200, message = "성공", response = UserLoginPostRes.class),
			@ApiResponse(code = 401, message = "구글 로그인 실패", response = BaseResponseBody.class),
			@ApiResponse(code = 404, message = "사용자 없음", response = BaseResponseBody.class),
			@ApiResponse(code = 500, message = "서버 오류", response = BaseResponseBody.class)
	})
	public ResponseEntity<UserLoginPostRes> googleAuthSignup(@RequestBody SocialSignupInfoReq signupInfoReq) {

		String Token = signupInfoReq.getIdToken();
		String password1 = signupInfoReq.getPassword();
		String password2 = signupInfoReq.getPassword2();

		HttpTransport transport = new NetHttpTransport();
		JsonFactory jsonFactory = JacksonFactory.getDefaultInstance();

		GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(transport, jsonFactory)
				.setAudience(Collections.singletonList(googleClientId))
				.build();

		try {
			GoogleIdToken idToken = verifier.verify(Token);
			GoogleIdToken.Payload payload = idToken.getPayload();

			String email = payload.getEmail();
			String name = (String) payload.get("name");
			String pictureUrl = (String) payload.get("picture");

			if(userService.getUserByUserEmail(email) == null){
				//이메일이 없으면 회원가입하고 로그인하고 토큰발급
				try {
					User user = userService.createUser(email, name, password1, password2);
					userService.changeProfile(user, pictureUrl);
				} catch (AlreadyExistEmailException e) {
					return ResponseEntity.status(e.getStatus()).body(UserLoginPostRes.of(e.getStatus(), e.getMessage(), null));
				} catch (NotMatchPasswordException e) {
					return ResponseEntity.status(e.getStatus()).body(UserLoginPostRes.of(e.getStatus(), e.getMessage(), null));
				}
			}
			return ResponseEntity.status(200).body(UserLoginPostRes.of(200, "로그인 되었습니다.", JwtTokenUtil.getToken(email)));
		} catch (Exception e){
			return ResponseEntity.status(401).body(UserLoginPostRes.of(401, "로그인에 실패하였습니다.", null));
		}

	}

	@PostMapping("/google/login")
	@ApiOperation(value = "구글 로그인", notes = "구글 엑세스 토큰으로 로그인하기")
	@ApiResponses({
			@ApiResponse(code = 200, message = "성공", response = UserLoginPostRes.class),
			@ApiResponse(code = 401, message = "구글 로그인 실패", response = BaseResponseBody.class),
			@ApiResponse(code = 404, message = "사용자 없음", response = BaseResponseBody.class),
			@ApiResponse(code = 500, message = "서버 오류", response = BaseResponseBody.class)
	})
	public ResponseEntity<UserLoginPostRes> googleAuthLogin(@RequestBody SocialLoginInfoReq loginInfoReq) {
		String Token = loginInfoReq.getIdToken();

		HttpTransport transport = new NetHttpTransport();
		JsonFactory jsonFactory = JacksonFactory.getDefaultInstance();

		GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(transport, jsonFactory)
				.setAudience(Collections.singletonList(googleClientId))
				.build();

		try {
			GoogleIdToken idToken = verifier.verify(Token);
			GoogleIdToken.Payload payload = idToken.getPayload();

			String email = payload.getEmail();

			return ResponseEntity.status(200).body(UserLoginPostRes.of(200, "로그인 되었습니다.", JwtTokenUtil.getToken(email)));
		} catch (Exception e){
			return ResponseEntity.status(401).body(UserLoginPostRes.of(401, "로그인에 실패하였습니다.", null));
		}

	}
}
