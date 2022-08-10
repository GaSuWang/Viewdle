// 임현탁
<template>
  <div class="Googlesignup">
    <div class="Googlesignupbody">
      <div class="Googlesignupcard">
        <h1>GoogleSignup</h1>
        <form @submit.prevent="googlesignup(credentials)">
          <!-- 비번 인풋 -->
          <div class="pwinput">
            <input type="password" v-model="credentials.password" class="form-control form-control-lg"
              placeholder="Password" />
          </div>
          <!-- 비번 확인 인풋 -->
          <div class="pwcheckinput">
            <input type="password" v-model="credentials.password2" class="form-control form-control-lg"
              placeholder="Password Check" />
          </div>

          <button class="signupsubmit btn btn-primary btn-lg">가입완료</button>
          <router-link to="/">뒤로가기</router-link>
        </form>
      </div>
      </div>
  </div>
</template>

<script>
import { reactive } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from "vue-router";
import axios from 'axios'
export default {
  name: 'SignupCard',
  setup () {
    const store = useStore()
    const router = useRouter();
    const route= useRoute()
    const credentials = reactive({
      "idToken" : route.params.idToken,
      "password": '',
      "password2": ''
    })
    function googlesignup(credentials) {
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
        // url: 'https://' + location.hostname + '/api/v1/social/google/signup', //회원가입 api로
        url: 'http://' + location.hostname + ':8081' + '/api/v1/social/google/signup',
        method: 'post',
        data: credentials
      })
        .then((res) => {
          alert('성공적으로 회원가입!')
          const token = res.data.accessToken
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
          console.log(credentials)
          router.push('/main')
        })
    }

      
    return {
      googlesignup, credentials
    }
  }
}
</script>

<style>
.Googlesignup{
  width: 90%;
  height: 90%;
  background : rgb(255,255,255,0.5);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.Googlesignupbody{
  width: 100%;
  height: 70%;
  display: flex;
  align-items: center;
  justify-content: center;

}
.Googlesignupcard{
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