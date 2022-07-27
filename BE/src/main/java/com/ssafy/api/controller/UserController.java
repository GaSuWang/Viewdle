package com.ssafy.api.controller;

import com.ssafy.api.request.*;
import com.ssafy.api.response.UserLoginPostRes;
import com.ssafy.api.service.EmailService;
import com.ssafy.common.exception.*;
import com.ssafy.common.util.JwtTokenUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

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

	@Autowired
	EmailService emailService;
	
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
		
		return ResponseEntity.status(200).body(BaseResponseBody.of(200, "회원가입이 완료되었습니다."));
	}

	@PostMapping("/check/duplicate")
	@ApiOperation(value = "중복 이메일 확인합니당", notes = "가입할때 필요할걸용?")
	@ApiResponses({
			@ApiResponse(code = 200, message = "성공"),
			@ApiResponse(code = 400, message = "이미 존재하는 이메일입니다."),
			@ApiResponse(code = 404, message = "사용자 없음"),
			@ApiResponse(code = 500, message = "서버 오류")
	})
	public ResponseEntity<? extends BaseResponseBody> emailDeplicateCheck(
			@RequestBody UserEmailReq emailInfo) {
		//임의로 리턴된 User 인스턴스. 현재 코드는 회원 가입 성공 여부만 판단하기 때문에 굳이 Insert 된 유저 정보를 응답하지 않음.
		try {

			if (userService.getUserByUserEmail(emailInfo.getEmail()) != null){
				throw new AlreadyExistEmailException();
			}
		}
 		catch (AlreadyExistEmailException e) {
			return ResponseEntity.status(e.getStatus()).body(BaseResponseBody.of(e.getStatus(), e.getMessage()));
		}

		return ResponseEntity.status(200).body(BaseResponseBody.of(200, "사용 가능한 이메일입니다."));
	}
	
	@GetMapping("/detail")
	@ApiOperation(value = "회원 본인 정보 조회", notes = "자기 정보 조회하는거긴한뎅 API 명세에는 없어용")
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

	@GetMapping("/detail/{userSeq}")
	@ApiOperation(value = "회원 본인 정보 조회", notes = "로그인한 회원 본인의 정보를 응답한다.")
	@ApiResponses({
			@ApiResponse(code = 200, message = "성공"),
			@ApiResponse(code = 400, message = "회원이 존재하지 않습니다."),
			@ApiResponse(code = 401, message = "인증 실패"),
			@ApiResponse(code = 404, message = "사용자 없음"),
			@ApiResponse(code = 500, message = "서버 오류")
	})
	public ResponseEntity<?> getUserDetail(@PathVariable int userSeq) {
		/**
		 * 요청 헤더 액세스 토큰이 포함된 경우에만 실행되는 인증 처리이후, 리턴되는 인증 정보 객체(authentication) 통해서 요청한 유저 식별.
		 * 액세스 토큰이 없이 요청하는 경우, 403 에러({"error": "Forbidden", "message": "Access Denied"}) 발생.
		 */

		User user = userService.getUserByUserSeq(userSeq);
		try {
			User temp = userService.getUserByUserSeq(userSeq);
		} catch (NotExistUserException e) {
			return ResponseEntity.status(e.getStatus()).body(BaseResponseBody.of(e.getStatus(), e.getMessage()));
		}

		return ResponseEntity.status(200).body(UserRes.of(user));
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

		return ResponseEntity.status(200).body(UserLoginPostRes.of(200, "로그인 되었습니다.", JwtTokenUtil.getToken(loginInfo.getEmail())));
	}


	@PutMapping("/password")
	@ApiOperation(value = "회원 비밀번호 수정", notes = "비번수정하세요")
	@ApiResponses({
			@ApiResponse(code = 200, message = "성공"),
			@ApiResponse(code = 400, message = "기존 비번하고 같습니다, 비밀번호 두개가 안맞 오류"),
			@ApiResponse(code = 401, message = "인증 실패"),
			@ApiResponse(code = 404, message = "사용자 없음"),
			@ApiResponse(code = 500, message = "서버 오류")
	})
	public ResponseEntity<?> changePassword(
			@ApiIgnore Authentication authentication,
			@RequestBody @ApiParam(value="비밀번호 수정", required = true) UserChangePwdReq pwdInfo) {

		VudleUserDetails userDetails = (VudleUserDetails)authentication.getDetails();
		User user = userDetails.getUser();

		try {
			userService.changePwdUser(user.getUserEmail(), user.getUserPassword(), pwdInfo.getPassword(), pwdInfo.getPassword2());
		} catch (SamePasswordException e) {
			return ResponseEntity.status(e.getStatus()).body(UserLoginPostRes.of(e.getStatus(), e.getMessage(), null));
		} catch (NotMatchPasswordException e) {
			return ResponseEntity.status(e.getStatus()).body(UserLoginPostRes.of(e.getStatus(), e.getMessage(), null));
		}

		return ResponseEntity.status(200).body(UserLoginPostRes.of(200, "비밀번호 변경을 완료하였습니다."));
	}

	@DeleteMapping()
	@ApiOperation(value = "회원탈퇴", notes = "회원탈퇴합니당")
	@ApiResponses({
			@ApiResponse(code = 200, message = "성공"),
			@ApiResponse(code = 401, message = "인증 실패"),
			@ApiResponse(code = 404, message = "사용자 없음"),
			@ApiResponse(code = 500, message = "서버 오류")
	})
	public ResponseEntity<?> deleteUser(@ApiIgnore Authentication authentication) {

		VudleUserDetails userDetails = (VudleUserDetails)authentication.getDetails();
		User user = userDetails.getUser();

		userService.deleteUser(user);

		return ResponseEntity.status(200).body(UserLoginPostRes.of(200, "회원 탈퇴를 완료하였습니다."));
	}

	@PostMapping("/check/password")
	@ApiOperation(value = "비밀번호 확인", notes = "내정보 수정할때 비번 확인하는 API 입니당")
	@ApiResponses({
			@ApiResponse(code = 200, message = "성공"),
			@ApiResponse(code = 400, message = "비밀번호가 일치하지 않습니다"),
			@ApiResponse(code = 401, message = "인증 실패"),
			@ApiResponse(code = 404, message = "사용자 없음"),
			@ApiResponse(code = 500, message = "서버 오류")
	})
	public ResponseEntity<? extends BaseResponseBody> checkPassword(@ApiIgnore Authentication authentication, @RequestBody UserPwdReq pwdInfo) throws Exception {

		VudleUserDetails userDetails = (VudleUserDetails)authentication.getDetails();
		User user = userDetails.getUser();

		System.out.println(user.getUserPassword()+" "+pwdInfo.getPassword());
		System.out.println();

		try {
			userService.checkPassword(user.getUserPassword(), pwdInfo.getPassword());
		} catch (NotMatchPasswordException e) {
			return ResponseEntity.status(e.getStatus()).body(BaseResponseBody.of(e.getStatus(), e.getMessage()));
		}

		return ResponseEntity.status(200).body(BaseResponseBody.of(200, "비밀번호 인증이 완료되었습니다."));
	}

	@PostMapping("/check/email")
	@ApiOperation(value = "회원 가입시 이메일로 인증번호 보내기", notes = "사용가능한 이메일이면 인증 보내기 버튼 만들어주면 될거같아용")
	@ApiResponses({
			@ApiResponse(code = 200, message = "성공"),
			@ApiResponse(code = 401, message = "인증 실패"),
			@ApiResponse(code = 404, message = "사용자 없음"),
			@ApiResponse(code = 500, message = "서버 오류")
	})
	public ResponseEntity<? extends BaseResponseBody> emailConfirm(@RequestBody UserEmailReq emailInfo) throws Exception {
		System.out.println(emailInfo.getEmail());
		String confirm = emailService.sendSimpleMessage(emailInfo.getEmail());

		return ResponseEntity.status(200).body(BaseResponseBody.of(200, confirm));
	}

	@PostMapping("/password")
	@ApiOperation(value = "비밀번호 재발급", notes = "이메일 입력받고 이메일 있으면 새로운 비번 줄거예용")
	@ApiResponses({
			@ApiResponse(code = 200, message = "비밀번호 재발급이 완료되었습니다."),
			@ApiResponse(code = 400, message = "이메일이 존재하지 않습니다."),
			@ApiResponse(code = 401, message = "인증 실패"),
			@ApiResponse(code = 404, message = "사용자 없음"),
			@ApiResponse(code = 500, message = "서버 오류")
	})
	public ResponseEntity<? extends BaseResponseBody> newPassword(@RequestBody UserEmailReq emailInfo) throws Exception {

		try {
			userService.getUserByUserEmail(emailInfo.getEmail());
		} catch (NotExistEmailException e) {
			return ResponseEntity.status(e.getStatus()).body(BaseResponseBody.of(e.getStatus(), e.getMessage()));
		}

		String newPassword = emailService.sendNewPassword(emailInfo.getEmail());
		User user = userService.getUserByUserEmail(emailInfo.getEmail());
		userService.changePwdUser(emailInfo.getEmail(), user.getUserPassword(), newPassword, newPassword);

		return ResponseEntity.status(200).body(BaseResponseBody.of(200, "비밀번호 재발급이 완료되었습니다."));
	}
}
