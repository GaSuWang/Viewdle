package com.ssafy.api.service;

import com.ssafy.common.exception.*;
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
		else if (password.equals(originPassword)) {
			System.out.println(passwordEncoder.encode(password));
			System.out.println(originPassword);
			throw new SamePasswordException();
		}

		User user = userRepository.findByUserEmail(email);
		user.setUserPassword(password);
		userRepository.save(user);
	}

	@Override
	public void deleteUser(User user) {
		userRepository.delete(user);
	}

}
