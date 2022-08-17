package com.ssafy.api.service;

import com.ssafy.api.response.UserHistoryRes;
import com.ssafy.common.exception.*;
import com.ssafy.db.entity.Badge;
import com.ssafy.db.entity.Common;
import com.ssafy.db.repository.BadgeRepository;
import com.ssafy.db.repository.ParticipantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.ssafy.api.request.UserRegisterPostReq;
import com.ssafy.db.entity.User;
import com.ssafy.db.repository.UserRepository;
import com.ssafy.db.repository.UserRepositorySupport;

import java.util.Optional;

/**
 *	유저 관련 비즈니스 로직 처리를 위한 서비스 구현 정의.
 */
@Service("userService")
public class UserServiceImpl implements UserService {
	@Autowired
	UserRepository userRepository;
	
	@Autowired
	UserRepositorySupport userRepositorySupport;

	@Autowired
	ParticipantRepository participantRepository;

	@Autowired
	BadgeRepository badgeRepository;
	
	@Autowired
	PasswordEncoder passwordEncoder;
	
	@Override
	public User createUser(String email, String name, String password, String password2){
		if(userRepository.findByUserEmail(email) != null){
			throw new AlreadyExistEmailException();
		} else if (!password.equals(password2)) {
			throw new NotMatchPasswordException();
		}

		User user = new User();
		user.setUserEmail(email);
		user.setUserPassword(passwordEncoder.encode(password));
		user.setUserName(name);
		return userRepository.save(user);
	}

	@Override
	public User getUserByUserEmail(String userEmail) {
		// 디비에 유저 정보 조회 (userId 를 통한 조회).
		User user = userRepository.findByUserEmail(userEmail);
		return user;
	}

	@Override
	public User loginUser(String email, String password) {
		User user = userRepository.findByUserEmail(email);

		if (user == null) {
			throw new NotExistEmailException();
		} else if (!passwordEncoder.matches(password, user.getUserPassword())) {
			throw new NotMatchPasswordException();
		}
		return user;
	}

	@Override
	public User getUserByUserSeq(int userSeq) {
		User user = userRepository.findByUserSeq(userSeq);

		if (user == null) {
			throw new NotExistUserException();
		}
		return user;
	}

	@Override
	public void changePwdUser(String email, String originPassword, String password, String password2) {
		if(!password.equals(password2)){
			throw new NotMatchPasswordException();
		}
		else if (passwordEncoder.matches(password, originPassword)) {
			System.out.println(passwordEncoder.encode(password));
			System.out.println(originPassword);
			throw new SamePasswordException();
		}

		User user = userRepository.findByUserEmail(email);
		user.setUserPassword(passwordEncoder.encode(password));
		userRepository.save(user);
	}

	@Override
	public void deleteUser(User user) {
		user.setUserDelYN("Y");
		userRepository.delete(user);
	}

	@Override
	public void checkPassword(String userPassword, String password) {
		if (!passwordEncoder.matches(password, userPassword)){
			throw new NotMatchPasswordException();
		}
	}

	@Override
	public void changeProfile(User user, String proflePath) {
		user.setUserProfileImage(proflePath);
		userRepository.save(user);
	}

	@Override
	public void changeBadge(User user, String badge) {
		user.setUserMainBadge(badge);
		userRepository.save(user);
	}

	public UserHistoryRes getUserHistory(User user) {
		UserHistoryRes res = UserHistoryRes.builder().
				userTotalTime(user.getUserTotalTime()).
				userTotalVideo(user.getUserTotalVideo()).
				usingDates(participantRepository.findUsingDate(user.getUserSeq())).
				build();
		return res;
	}

	@Override
	public void getNewBadge(User user, Common common) {
		Badge badge = new Badge();
		badge.setUser(user);
		badge.setCommon(common);
		badgeRepository.save(badge);
	}

	@Override
	public void cretaeGoogleUser(String userEmail, String name, String profile_image) {
		User user = new User(userEmail, name, profile_image);
		userRepository.save(user);
	}

}
