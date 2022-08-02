// 임현탁
<template>
  <div class="signup">
    <div class="signupbody">
      <div class="signupcard">
        <h1>Signup</h1>
    <!-- 이름 -->
    <!-- 이메일 -->
    <!-- 비밀번호 -->
    <!-- 비밀번호 확인 -->
    <!-- 가입완료 버튼  and 취소버튼-->
    <!-- 가입 실패시 알람 -->
        <form @submit.prevent="signup(credentials)">
          <!-- 이름 -->
          <div class="nameinput">
            <input type="text" v-model="credentials.userName" class="form-control form-control-lg"
              placeholder="Nick Name" />
          </div>
          <!-- 이메일 인풋 -->

          <form @submit.prevent="checkEmail(credentials)">
            <div class="emailinput">
              <input type="email" v-model="credentials.userEmail" class="form-control form-control-lg" placeholder="Email address" />
              <button class="pwchecksubmit btn btn-primary btn-lg"> 중복 확인 </button>
            </div>
          </form>

          <!-- 비번 인풋 -->
          <div class="pwinput">
            <input type="password" v-model="credentials.userPassword" class="form-control form-control-lg"
              placeholder="Password" />
          </div>

          <!-- 비번 확인 인풋 -->
          <div class="pwcheckinput">
            <input type="password" v-model="credentials.userPassword2" class="form-control form-control-lg"
              placeholder="Password Check" />
          </div>

          <button class="signupsubmit btn btn-primary btn-lg">가입완료</button>
        </form>
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

    const router = useRouter();
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
        url: 'http://localhost:8081/api/v1/users', //회원가입 api로
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
        url: 'http://localhost:8081/api/v1/users/check/duplicate',  // 이메일확인 api
        method: 'get',
        data: credentials.userEmial
      })
        .then(() => {
          alert('! 가입 가능 한 이메일입니다.')
        })
        .catch(err => {
          console.error(err.response)
          alert('이미 가입된 이메일입니다.')
        })
    }
      
    return {
      signup, checkEmail, credentials
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
  background : rgb(255,255,255,0.5);
  border-radius: 20px;
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
  width: 80%;
  height: 100%;
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

.emailinput{
  margin-top: 20px;
  width: 100%;
}
.emailinput input{
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

.pwinput{
  margin-top: 50px;
  width: 100%;
}
.pwinput input{
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
.pwcheckinput{
  margin-top: 20px;
  width: 100%;
}
.pwcheckinput input{
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
.pwchecksubmit{
    margin-top: 20px;
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
.signupsubmit{
     margin-top:20px;
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