package com.ssafy.api.service;

import org.springframework.stereotype.Service;

@Service
public interface EmailService {
    String sendSimpleMessage(String email)throws Exception;

    String sendNewPassword(String email) throws Exception;
}
