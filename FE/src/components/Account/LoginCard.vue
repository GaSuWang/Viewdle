// 임현탁
<template>
  <div class="loginview">     
    <div class="login">
      <div class="d-flex"><h1 class="frontVeiwdle">뷰들</h1><h1 class="backVeiwdle">뷰들</h1></div>
      <!-- <button onclick="GoogleLoginBtn()"><i class="fab fa-google"></i></button> -->
      <!-- 이메일 인풋 -->
      <form @submit.prevent="login(credentials)">
        <div class="loginid">
          <input type="email" v-model="credentials.email" placeholder="Email address" />
        </div>
        
        <!-- Password input -->
        <div class="loginpw">
          <input type="password" v-model="credentials.password" placeholder="Password" />
        </div>
        <button class="loginsubmit btn btn-primary btn-lg d-flex justify-content-center align-items-center">로그인</button>
      </form>
      <!-- Checkbox -->
      <div class="login_etc d-flex flex-column">
        <div class="d-flex justify-content-center mt-3 mb-2"><p class="mt-0">SNS 간편 로그인</p> <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
            <GoogleLogin/>
        </div>

        <div class="d-flex justify-content-center"><p class="m-0">계정이 없으신가요?</p> <span>&nbsp;&nbsp;</span>
            <div class="userButtonBox"><router-link to="/signup">회원가입</router-link></div>
        </div>

        <div><span>&nbsp;&nbsp;</span></div>
        <div class="userButtonBox"><router-link to="/pw">비밀번호 찾기</router-link></div>
      </div>

    </div>
  </div>
</template>

<script>
import { useStore } from 'vuex'
import axios from 'axios'
import { reactive } from 'vue'
import { useRouter } from "vue-router";
import GoogleLogin from "@/components/Account/GoogleLogin.vue"

export default {
  name: 'LoginCard',
  components:{
    GoogleLogin
  },
  setup () {
    const credentials = reactive({
      email: '',
      password: '',
    })
    const credentialsTogetReplay = reactive({
      order:''
    })
    const store = useStore()
    const router = useRouter()

     
    // function login(){
    //   store.dispatch('rhtModule/login', credentials)
    //   router.push('/main')
    // }
    const BASE_URL = 'http://' + location.hostname + ':8081'
    // const BASE_URL = 'https://' + location.hostname
    function login(credentials) {

      console.log("로그인아 안녕?")
      axios({
        // url: BASE_URL + '/api/v1/users/login', 
        url: BASE_URL + '/api/v1/users/login',  
        method: 'post',
        data: credentials
      })
        .then(res => {
          console.log("해윙")
          console.log(res)
          const token = res.data.accessToken
          console.log(token)
          store.dispatch('rhtModule/saveToken', token)
          store.dispatch('rhtModule/fetchCurrentUser')
          store.dispatch('rhtModule/fetchHistories')
          store.dispatch('rhtModule/getBadge')
          store.dispatch('rhtModule/getCoverLetter')
          store.dispatch('rhtModule/getStudyRoom')
          store.dispatch('rhtModule/getReplay')
          router.push('/main')
        })
        .catch(err => {
          console.error(err)
          alert("이메일 및 비밀번호를 확인하세요")
        })
    }
      
    return {
      login, credentials, credentialsTogetReplay
    }
  }
}

</script>

<style>
.frontVeiwdle{
  font-family: 'yg-jalnan';
  color: #0f70ed;
}
.backVeiwdle{
  font-family: 'yg-jalnan';
  color: #fcab1f;
}
a{
  text-decoration: none;
  color : black;
}
a:hover{
  text-decoration: none;
  color : black;
}
.userButtonBox a{
  color:#FEAA00
}
.userButtonBox a:hover{
  color:#ffcc74
}

p{
  margin: auto;
  /* padding:  */
}

.loginview{
  height: 70%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.login {
  min-width: 450px;
  min-height: 550px;
  background: white;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.googleloginbtn{
  padding: 20px;
  display: flex;
  padding: 0px 15px;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  border-radius: 50px;
  background: white;
  font-size: 20px;
  box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.4), -3px -3px 5px rgba(0, 0, 0, 0.1);
}

.loginid{
  margin-top: 10px;
  width: 100%;
}
.loginid input{
  width: 100%;
  height: 50px;
  background-color: #89B2E8;
  border-radius: 10px;
  margin-top: 10px;
  padding: 0px 20px;
  border: 1px solid #0f70ed;
  outline: none;
}

.loginpw{
  margin-top: 0px;
  width: 100%;
}
.loginpw input{
  width: 100%;
  height: 50px;
  background-color: #89B2E8;
  border-radius: 10px;
  margin-top: 10px;
  padding: 0px 20px;
  border: 1px solid #0f70ed;
  outline: none;
  }

  .loginsubmit{
    margin-top: 20px;
    width: 100%;
    height: 3vw;
    border: 0;
    outline: none;
    border-radius: 10px;
    background: #fcab1f;
    color: white;
    font-weight: bold;
    font-size: 1.2em;
    letter-spacing: 2px;
    box-shadow: 0px 1.5px 4px #aaa, inset 0px 1px 1.5px #fff;
  }
  .loginsubmit:hover{
    background: #ffcc74;

  }
  .login_etc {
  padding: 10px;
  width: 80%;
  font-size: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
  text-decoration: none;
}

@font-face {
    font-family: 'yg-jalnan';
    src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_four@1.2/JalnanOTF00.woff') format('woff');
    font-weight: normal;
    font-style: normal;
}
</style>


