// 임현탁
<template>
  <div class="Googlesignup">
    <div class="Googlesignupbody">
      <div class="Googlesignupcard">
        <div class="d-flex"><h1 class="frontVeiwdle">뷰들</h1><h1 class="backVeiwdle">뷰들</h1></div>
        <form @submit.prevent="googlesignup(credentials)">
          <!-- 비번 인풋 -->
          <div class="pwinput">
            <input type="password" v-model="credentials.password" class="form-control form-control-lg"
              placeholder="비밀번호" />
          </div>
          <!-- 비번 확인 인풋 -->
          <div class="pwcheckinput">
            <input type="password" v-model="credentials.password2" class="form-control form-control-lg"
              placeholder="비밀번호 확인" />
          </div>

          <button class="signupsubmit">가입완료</button>
          <div class="d-flex justify-content-center m-3">
            <div class="signupbackbutton" style="color:black"><router-link to="/"><p style="font-size:14px; font-weight:bold; color:black">뒤로가기</p></router-link></div>
          </div>
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
    const BASE_URL = 'http://' + location.hostname + ':8081'
// const BASE_URL = 'https://' + location.hostname
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
      axios({
        // url: BASE_URL + '/api/v1/social/google/signup', //회원가입 api로
        url: BASE_URL + '/api/v1/social/google/signup',
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
a{
  text-decoration: none;
  color : black;
}
a:hover{
  text-decoration: none;
  color : black;
}
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
  margin-top: 20px;
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
    height: 50px;
    border: 0;
    outline: none;
    border-radius: 40px;
    background-color: rgb(230,198,132);
    color: white;
    font-size: 1.2em;
    letter-spacing: 2px;
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
.frontVeiwdle{
  font-family: 'yg-jalnan';
  color: #47A0FF;
}
.backVeiwdle{
  font-family: 'yg-jalnan';
  color: #FEAA00;
}
.googlebackbutton a{
  text-decoration: none;
  color:#FEAA00
}
.googlebackbutton a:hover{
  text-decoration: none;
  color:#ffcc74
}
@font-face {
    font-family: 'yg-jalnan';
    src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_four@1.2/JalnanOTF00.woff') format('woff');
    font-weight: normal;
    font-style: normal;
}
</style>