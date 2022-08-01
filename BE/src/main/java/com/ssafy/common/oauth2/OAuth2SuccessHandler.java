package com.ssafy.common.oauth2;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.api.request.UserRegisterPostReq;
import com.ssafy.api.response.UserLoginPostRes;
import com.ssafy.api.service.UserService;
import com.ssafy.common.util.JwtTokenUtil;
import com.ssafy.db.entity.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import lombok.var;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@RequiredArgsConstructor
@Component
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {
    private final TokenService tokenService;
    private final UserRequestMapper userRequestMapper;
    private final ObjectMapper objectMapper;

    @Autowired
    UserService userService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication)
            throws IOException, ServletException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String name = (String) oAuth2User.getAttributes().get("name");
        String email = (String) oAuth2User.getAttributes().get("email");
        String picture = (String) oAuth2User.getAttributes().get("picture");

        // 최초 로그인이라면 회원가입 처리를 한다.
        User user =  userService.getUserByUserEmail(email);
        if(user == null){
            UserRegisterPostReq userInfo = new UserRegisterPostReq(email, name, "google", "google");
            userService.createUser(userInfo);

        }

        String token = JwtTokenUtil.getToken(email);

        writeTokenResponse(response, token);
    }

    private void writeTokenResponse(HttpServletResponse response, String token)
            throws IOException {

        Map<String, String> resToken = new HashMap<>();
        resToken.put("token", token);

        var writer = response.getWriter();
        writer.println(objectMapper.writeValueAsString(resToken));
        writer.flush();
    }
}
