package com.ssafy.api.service;

import com.ssafy.api.request.UserRegisterPostReq;
import com.ssafy.api.response.UserHistoryRes;
import com.ssafy.db.entity.Common;
import com.ssafy.db.entity.User;
import org.springframework.stereotype.Service;

/**
 *	유저 관련 비즈니스 로직 처리를 위한 서비스 인터페이스 정의.
 */
@Service
public interface UserService {
	User createUser(String email, String name, String password, String password2);
	User getUserByUserEmail(String userEmail);
	User loginUser(String email, String password);
	User getUserByUserSeq(int userSeq);
	void changePwdUser(String email, String originPassword, String password, String password2);
	void deleteUser(User user);
	void checkPassword(String userPassword, String password);
	void changeProfile(User user, String proflePath);
	void changeBadge(User user, String badge);
	UserHistoryRes getUserHistory(User user);
	void getNewBadge(User user, Common common);

	void cretaeGoogleUser(String userEmail, String name, String profile_image);
}
