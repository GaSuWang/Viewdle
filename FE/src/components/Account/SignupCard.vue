// 임현탁
<template>
  <div class="container" id="SignupCard">
    <!-- 이름 -->
    <!-- 이메일 -->
    <!-- 비밀번호 -->
    <!-- 비밀번호 확인 -->
    <!-- 가입완료 버튼  and 취소버튼-->
    <!-- 가입 실패시 알람 -->
      <div class="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
        <form @submit.prevent="signup(credentials)">
          <!-- 이름 -->
          <div class="form-outline mb-4">
            <input type="text" v-model="credentials.userName" id="userName" class="form-control form-control-lg"
              placeholder="Nick Name" />
          </div>
          <!-- 이메일 인풋 -->

          <form @submit.prevent="checkEmail(credentials)">
            <div class="form-outline mb-4">
              <input type="email" v-model="credentials.userEmail" id="userEmail" class="form-control form-control-lg" placeholder="Email address" />
              <button class="btn btn-primary btn-lg"> 중복 확인 </button>
            </div>
          </form>

          <!-- 비번 인풋 -->
          <div class="form-outline mb-3">
            <input type="password" v-model="credentials.userPassword" id="userPassword1" class="form-control form-control-lg"
              placeholder="Password" />
          </div>

          <!-- 비번 확인 인풋 -->
          <div class="form-outline mb-3">
            <input type="password" v-model="credentials.userPassword2" id="userPassword2" class="form-control form-control-lg"
              placeholder="Password Check" />
          </div>


          <button class="btn btn-primary btn-lg">가입완료</button>
  
        </form>
      </div>
  </div>
</template>

<script>
// import { mapActions } from 'vuex'
import { reactive } from 'vue'
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
          // router.push({ name: 'main' })
        })
        .catch(err => {
          console.error(err.response.data)
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
</style>