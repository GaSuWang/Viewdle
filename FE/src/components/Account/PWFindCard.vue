// 임현탁
<template>
<div class="pwFind">
  <div class="pwFindbody">
    <div class="pwFindcard">
      <h1>Find Password</h1>
    <img id="logoimg" src="@/assets/images/anyimgs.png" alt="Sample image">
        <!-- 이메일 입력란 -->
        <!-- 버튼클릭시 이메일로 임의의 비밀번호 발송 or 원래비밀번호 발송 -->
        <!-- 취소버튼 -->
        <!-- 확인되지 않은 이메일 일 시 알람 -->
        <!-- 이메일 인풋 -->
      <form @submit.prevent="getEmailCode(credentials)">
        <div class="pwFindinput">
          <input type="email" v-model="credentials.userEmail" placeholder="Email address" />
        </div>
        <button class="pwFindsubmit btn btn-primary btn-lg">인증코드받기</button>
        <router-link to="/">뒤로가기</router-link>

      </form>
    </div>
    </div>
</div>



</template>

<script>

import { reactive } from 'vue'
import axios from 'axios'
export default {
  name: 'PWFindCard',
  setup () {
    const credentials = reactive({
      userEmail: '',
    })



    function getEmailCode(credentials) {
        console.log("코드보내기야 안녕?")
        axios({
          url: 'http://localhost:8081/api/v1/users/check/users/password',  // 비밀번호찾기 api
          method: 'post',
          data: credentials.userEmail
        })
          .then(() => {
            alert('가입한 이메일로 새 비밀번호가 전송 되었습니다.')
          })
          .catch(err => {
            console.error(err.response)
            alert('가입된 이메일이 아닙니다.')
          })
        
    }


    return {
      getEmailCode, credentials
    }
  }
} 
</script>

<style>
.pwFind{
  width: 90%;
  height: 90%;
  background : rgb(255,255,255,0.5);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.pwFindbody{
  width: 100%;
  height: 70%;
  display: flex;
  align-items: center;
  justify-content: center;

}
.pwFindcard{
  width: 80%;
  height: 100%;
  background: white;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.pwFindform{
  display: flex;
  align-items: center;
  justify-content: center;
}
.pwFindinput{
  margin-top: 20px;
  width: 100%;
}
.pwFindinput input{
  margin-top: 50px;
  width: 80%;
  width: 100%;
  height: 50px;
  border-radius: 30px;
  margin-top: 10px;
  padding: 0px 20px;
  border: 1px solid lightgray;
  outline: none;
}
.pwFindsubmit{
    margin-top: 50px;
    width: 80%;
    width: 100%;
    height: 50px;
    border: 0;
    outline: none;
    border-radius: 40px;
    background: linear-gradient(to left, rgb(255, 77, 46), rgb(255, 155, 47));
    color: white;
    font-size: 1.2em;
    letter-spacing: 2px;
}
</style>
