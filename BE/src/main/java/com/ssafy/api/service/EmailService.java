package com.ssafy.api.service;

public interface EmailService {
    String sendSimpleMessage(String email)throws Exception;

    String sendNewPassword(String email) throws Exception;
}
