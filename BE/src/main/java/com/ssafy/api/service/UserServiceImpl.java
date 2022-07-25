package com.ssafy.api.service;

import com.ssafy.common.exception.AlreadyExistEmailException;
import com.ssafy.common.exception.NotExistEmailException;
import com.ssafy.common.exception.NotMatchPasswordException;
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
	PasswordEncoder passwordEncoder;
	
	@Override
	public User createUser(UserRegisterPostReq userRegisterInfo) {
		if(userRepository.findByUserEmail(userRegisterInfo.getUserEmail()) != null){
			throw new AlreadyExistEmailException();
		} else if (!userRegisterInfo.getUserPassword().equals(userRegisterInfo.getUserPassword2())) {
			throw new NotMatchPasswordException();
		}

		User user = new User();
		user.setUserEmail(userRegisterInfo.getUserEmail());
		user.setUserPassword(passwordEncoder.encode(userRegisterInfo.getUserPassword()));
		user.setUserName(userRegisterInfo.getUserName());
		return userRepository.save(user);
	}

	@Override
	public User getUserByUserId(String userId) {
		// 디비에 유저 정보 조회 (userId 를 통한 조회).
		User user = userRepositorySupport.findUserByUserId(userId).get();
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


}
