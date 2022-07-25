package com.ssafy.api.controller;

import com.ssafy.api.request.UserLoginPostReq;
import com.ssafy.api.response.UserLoginPostRes;
import com.ssafy.common.exception.AlreadyExistEmailException;
import com.ssafy.common.exception.NotExistEmailException;
import com.ssafy.common.exception.NotMatchPasswordException;
import com.ssafy.common.util.JwtTokenUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.api.request.UserRegisterPostReq;
import com.ssafy.api.response.UserRes;
import com.ssafy.api.service.UserService;
import com.ssafy.common.auth.VudleUserDetails;
import com.ssafy.common.model.response.BaseResponseBody;
import com.ssafy.db.entity.User;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import springfox.documentation.annotations.ApiIgnore;

/**
 * 유저 관련 API 요청 처리를 위한 컨트롤러 정의.
 */
@Api(value = "유저 API", tags = {"User"})
@RestController
@RequestMapping("/api/v1/users")
public class UserController {
	
	@Autowired
	UserService userService;
	
	@PostMapping()
	@ApiOperation(value = "회원 가입", notes = "<strong>이메일, 이름, 패스워드</strong>를 통해 회원가입 한다.")
    @ApiResponses({
        @ApiResponse(code = 200, message = "성공"),
        @ApiResponse(code = 400, message = "사용자 입력 오류(이미 존재하는 이메일입니다., 비밀번호가 일치하지 않습니다.)"),
		@ApiResponse(code = 404, message = "사용자 없음"),
        @ApiResponse(code = 500, message = "서버 오류")
    })
	public ResponseEntity<? extends BaseResponseBody> register(
			@RequestBody @ApiParam(value="회원가입 정보", required = true) UserRegisterPostReq registerInfo) {
		
		//임의로 리턴된 User 인스턴스. 현재 코드는 회원 가입 성공 여부만 판단하기 때문에 굳이 Insert 된 유저 정보를 응답하지 않음.
		try {
			userService.createUser(registerInfo);
		} catch (AlreadyExistEmailException e) {
			return ResponseEntity.status(e.getStatus()).body(BaseResponseBody.of(e.getStatus(), e.getMessage()));
		} catch (NotMatchPasswordException e) {
			return ResponseEntity.status(e.getStatus()).body(BaseResponseBody.of(e.getStatus(), e.getMessage()));
		}
		
		return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
	}
	
	@GetMapping("/detail")
	@ApiOperation(value = "회원 본인 정보 조회", notes = "로그인한 회원 본인의 정보를 응답한다.") 
    @ApiResponses({
        @ApiResponse(code = 200, message = "성공"),
        @ApiResponse(code = 401, message = "인증 실패"),
        @ApiResponse(code = 404, message = "사용자 없음"),
        @ApiResponse(code = 500, message = "서버 오류")
    })
	public ResponseEntity<UserRes> getUserInfo(@ApiIgnore Authentication authentication) {
		/**
		 * 요청 헤더 액세스 토큰이 포함된 경우에만 실행되는 인증 처리이후, 리턴되는 인증 정보 객체(authentication) 통해서 요청한 유저 식별.
		 * 액세스 토큰이 없이 요청하는 경우, 403 에러({"error": "Forbidden", "message": "Access Denied"}) 발생.
		 */
		VudleUserDetails userDetails = (VudleUserDetails)authentication.getDetails();
		return ResponseEntity.status(200).body(UserRes.of(userDetails.getUser()));
	}

	@PostMapping("/login")
	@ApiOperation(value = "회원 로그인", notes = "로그인 하세용")
	@ApiResponses({
			@ApiResponse(code = 200, message = "성공"),
			@ApiResponse(code = 401, message = "인증 실패"),
			@ApiResponse(code = 404, message = "사용자 없음"),
			@ApiResponse(code = 500, message = "서버 오류")
	})
	public ResponseEntity<UserLoginPostRes> login(
			@RequestBody @ApiParam(value="회원가입 정보", required = true) UserLoginPostReq loginInfo) {
		try {
			userService.loginUser(loginInfo.getEmail(), loginInfo.getPassword());
		} catch (NotExistEmailException e) {
			return ResponseEntity.status(e.getStatus()).body(UserLoginPostRes.of(e.getStatus(), e.getMessage(), null));
		} catch (NotMatchPasswordException e) {
			return ResponseEntity.status(e.getStatus()).body(UserLoginPostRes.of(e.getStatus(), e.getMessage(), null));
		}

		return ResponseEntity.status(200).body(UserLoginPostRes.of(200, "success", JwtTokenUtil.getToken(loginInfo.getEmail())));
	}
}
