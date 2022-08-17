// 임현탁
<template>
  <div class="signup">
    <div class="signupbody">
      <div class="signupcard">
        <div class="d-flex"><h1 class="frontVeiwdle">뷰들</h1><h1 class="backVeiwdle">뷰들</h1></div>
    <!-- 이름 -->
    <!-- 이메일 -->
    <!-- 비밀번호 -->
    <!-- 비밀번호 확인 -->
    <!-- 가입완료 버튼  and 취소버튼-->
    <!-- 가입 실패시 알람 -->
        <form @submit.prevent="signup(credentials)">
          <!-- 이름 -->
          <div class="nameinput">
            <input type="text" v-model="credentials.userName" placeholder="Nick Name" />
          </div>
          <!-- 이메일 인풋 -->

          <form @submit.prevent="checkEmail(credentials)">
            <div class="emailinput">
              <input type="email" v-model="credentials.userEmail" placeholder="Email address" />
              <div v-if="credentialsTocheckEmail.EmailCheck == false">
              <button class="pwchecksubmit"> 중복 확인 </button>
              </div>
            </div>
          </form>

          <div v-if="credentialsTocheckEmail.EmailCheck == true">
          <!-- 비번 인풋 -->
            <div class="pwinput">
              <input type="password" v-model="credentials.userPassword" placeholder="Password" />
            </div>

            <!-- 비번 확인 인풋 -->
            <div class="pwcheckinput">
              <input type="password" v-model="credentials.userPassword2" placeholder="Password Check" />
            </div>

            <button class="signupsubmit">가입완료</button>
          </div>
        </form>
        <div class="signupbackbutton"><router-link to="/">뒤로가기</router-link></div>
      </div>
      </div>
  </div>
</template>

<script>
// import { mapActions } from 'vuex'
import { reactive } from 'vue'
import { useRouter } from "vue-router";
import axios from 'axios'
export default {
  name: 'SignupCard',
  setup () {
    const credentials = reactive({
      userEmail: '',
      userName: '',
      userPassword: '',
      userPassword2: ''
    })
    const credentialsTocheckEmail = reactive({
      EmailCheck: false
    })
    const router = useRouter();
    const BASE_URL = 'http://' + location.hostname + ':8081'
    // const BASE_URL = 'https://' + location.hostname
    function signup(credentials) {
      /* 
      POST: 사용자 입력정보를 signup URL로 보내기
        성공하면
          응답 토큰 저장
          현재 사용자 정보 받기
          메인 페이지(ArticleListView)로 이동
        실패하면
          에러 메시지 표시
      */
      console.log("회원가입아 안녕?")
      axios({
        // url: BASE_URL + '/api/v1/users', //회원가입 api로
        url: BASE_URL + '/api/v1/users',
        method: 'post',
        data: credentials
      })
        .then(() => {
          alert('성공적으로 회원가입!')
          router.push({ name: 'Account' })
        })
        .catch(err => {
          console.error(err)
        })
    }

    function checkEmail(credentials) {
    console.log("중복확인아 안녕?")
      axios({
        // url: BASE_URL + '/api/v1/users/check/duplicate',  // 이메일확인 api
        url: BASE_URL + '/api/v1/users/check/duplicate',
        method: 'post',
        data: {"email":credentials.userEmail}
      })
        .then((res) => {
          alert('가입가능한 이메일입니다.')
          console.log(res)
          if(res.status == 200 ){
            credentialsTocheckEmail.EmailCheck = true
          }
        })
        .catch(err => {
          console.log(credentials)
          console.error(err.response)
          alert('이미 가입된 이메일입니다.')
        })
    }
      
    return {
      signup, checkEmail, credentials, credentialsTocheckEmail
    }
  }
  // data() {
  //   return {
  //     credentials: {
  //       username: '',
  //       useremail: '',
  //       password1: '',
  //       password2: '',
  //     }
  //   }
  // },
  // methods: {
  //   ...mapActions(['signup'])
  // },
}
</script>

<style>
.signup{
  width: 90%;
  height: 90%;
  /* background : rgb(255,255,255,0.5);
  border-radius: 20px; */
  display: flex;
  align-items: center;
  justify-content: center;
}
.signupbody{
  width: 100%;
  height: 70%;
  display: flex;
  align-items: center;
  justify-content: center;

}
.signupcard{
  min-width: 450px;
  min-height: 550px;
  background: white;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.nameinput{
  margin-top: 20px;
  width: 100%;
}
.nameinput input{
  width: 100%;
  height: 50px;
  background-color: white;
  border-radius: 10px;
  margin-top: 10px;
  padding: 0px 20px;
  border: 1px solid #47A0FF;
  outline: none;
}

.emailinput{
  margin-top: 20px;
  width: 100%;
}
.emailinput input{
  width: 100%;
  height: 50px;
  background-color: white;
  border-radius: 10px;
  margin-top: 10px;
  padding: 0px 20px;
  border: 1px solid #47A0FF;
  outline: none;
}

.pwinput{
  margin-top: 50px;
  width: 100%;
}
.pwinput input{
  width: 100%;
  height: 50px;
  background-color: white;
  border-radius: 10px;
  margin-top: 10px;
  padding: 0px 20px;
  border: 1px solid #47A0FF;
  outline: none;
}
.pwcheckinput{
  margin-top: 20px;
  width: 100%;
}
.pwcheckinput input{
  width: 100%;
  height: 50px;
  background-color: white;
  border-radius: 10px;
  margin-top: 10px;
  padding: 0px 20px;
  border: 1px solid #47A0FF;
  outline: none;
}
.pwchecksubmit{
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
.signupsubmit{
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
.signupbackbutton a{
  text-decoration: none;
  color:#FEAA00
}
.signupbackbutton a:hover{
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