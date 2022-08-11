// 임현탁
<template>
  <div class="loginview">     
    <div class="login">
      <h1>Log In</h1>
      <p>구글 로그인 해</p>
      <!-- <button onclick="GoogleLoginBtn()"><i class="fab fa-google"></i></button> -->
      <GoogleLogin/>
      <p>or</p>
      <!-- 이메일 인풋 -->
      <form @submit.prevent="login(credentials)">
        <div class="loginid">
          <input type="email" v-model="credentials.email" placeholder="Email address" />
        </div>
        
        <!-- Password input -->
        <div class="loginpw">
          <input type="password" v-model="credentials.password" placeholder="Password" />
        </div>
        <button class="loginsubmit btn btn-primary btn-lg">로그인</button>
      </form>
      <!-- Checkbox -->
      <div class="login_etc">
        <router-link to="/pw">비번 찾기</router-link>
        <router-link to="/signup">회원가입</router-link>
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
    function login(credentials) {

      console.log("로그인아 안녕?")
      axios({
        // url: 'https://' + location.hostname + '/api/v1/users/login', 
        url: 'http://' + location.hostname + ':8081' + '/api/v1/users/login',  
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
.loginview{
  height: 70%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.login {
  width: 80%;
  height: 100%;
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
  margin-top: 20px;
  width: 100%;
}
.loginid input{
  width: 100%;
  height: 50px;
  border-radius: 30px;
  margin-top: 10px;
  padding: 0px 20px;
  border: 1px solid lightgray;
  outline: none;
}

.loginpw{
  margin-top: 20px;
  width: 100%;
}
.loginpw input{
  width: 100%;
  height: 50px;
  border-radius: 30px;
  margin-top: 10px;
  padding: 0px 20px;
  border: 1px solid lightgray;
  outline: none;
  }

  .loginsubmit{
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
  
</style>


