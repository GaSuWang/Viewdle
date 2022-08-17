// 임현탁
<template>
<div class="pwFind">
  <div class="pwFindbody">
    <div class="pwFindcard">
      <div class="d-flex"><h1 class="frontVeiwdle">뷰들</h1><h1 class="backVeiwdle">뷰들</h1></div>
        <!-- 이메일 입력란 -->
        <!-- 버튼클릭시 이메일로 임의의 비밀번호 발송 or 원래비밀번호 발송 -->
        <!-- 취소버튼 -->
        <!-- 확인되지 않은 이메일 일 시 알람 -->
        <!-- 이메일 인풋 -->
      <form @submit.prevent="getEmailCode(credentials)">
        <div class="pwFindinput">
          <input type="email" v-model="credentials.userEmail" placeholder="Email address" />
        </div>
        <button class="pwFindsubmit">인증코드받기</button>
      </form>
      <div class="m-3">
        <router-link to="/" style="color:black" class="pwfindbackbutton"><p style="font-size:14px; font-weight:bold ">뒤로가기</p></router-link>
      </div>
    </div>
    </div>
</div>



</template>

<script>

import { reactive } from 'vue'
import axios from 'axios'
import { useRouter } from "vue-router";
export default {
  name: 'PWFindCard',
  setup () {
    const router = useRouter()
    const credentials = reactive({
      userEmail: '',
    })


    const BASE_URL = 'http://' + location.hostname + ':8081'
    // const BASE_URL = 'https://' + location.hostname
    function getEmailCode(credentials) {
        axios({
          // url: BASE_URL + '/api/v1/users/password',  // 비밀번호찾기 api
          url: BASE_URL + '/api/v1/uses/password',
          method: 'post',
          data: {"email":credentials.userEmail}
        })
          .then(() => {
            alert('가입한 이메일로 새 비밀번호가 전송 되었습니다.')
            router.push('/')
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

<style scoped>
a{
  text-decoration: none;
  color : black;
}
a:hover{
  text-decoration: none;
  color : black;
}
.pwFind{
  width: 90%;
  height: 90%;
  /* background : rgb(255,255,255,0.5); */
  /* border-radius: 20px; */
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
  min-width: 450px;
  min-height: 550px;
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
  width: 100%;
  height: 50px;
  background-color: white;
  border-radius: 10px;
  margin-top: 10px;
  padding: 0px 20px;
  border: 1px solid #47A0FF;
  outline: none;
}
.pwFindsubmit{
    margin-top: 20px;
    width: 100%;
    height: 3vw;
    border: 0;
    outline: none;
    border-radius: 10px;
    background: #FEAA00;
    color: white;
    font-weight: bold;
    font-size: 1.2em;
    letter-spacing: 2px;
    box-shadow: 0px 1.5px 4px #aaa, inset 0px 1px 1.5px #fff;
}
.pwFindsubmit:hover{

}
.pwfindbackbutton{
  text-decoration: none;
  color:#FEAA00
}
.pwfindbackbutton:hover{
  text-decoration: none;
  color:#ffcc74
}
.frontVeiwdle{
  font-family: 'yg-jalnan';
  color: #47A0FF;
}
.backVeiwdle{
  font-family: 'yg-jalnan';
  color: #FEAA00;
}
@font-face {
    font-family: 'yg-jalnan';
    src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_four@1.2/JalnanOTF00.woff') format('woff');
    font-weight: normal;
    font-style: normal;
}
</style>
