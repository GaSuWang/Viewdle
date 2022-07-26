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

          <!-- <form @submit.prevent="checkEmail(credentials)"> -->
            <div class="form-outline mb-4">
              <input type="email" v-model="credentials.userEmail" id="userEmail" class="form-control form-control-lg" placeholder="Email address" />
              <button class="btn btn-primary btn-lg"> 중복 확인 </button>
            </div>
          <!-- </form> -->

          <!-- 비번 인풋 -->
          <div class="form-outline mb-3">
            <input type="password" v-model="credentials.userPassword1" id="userPassword1" class="form-control form-control-lg"
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
import { useStore } from 'vuex'
import { reactive } from 'vue'
export default {
  name: 'SignupCard',
  setup () {
    const credentials = reactive({
      userName: '',
      userEmail: '',
      userPassword1: '',
      userPassword2: ''
    })

    const store = useStore()
    function signup(){
          store.dispacth('rhtModule/signup', credentials)
    }

    // function checkEmail(){
    //   store.dispatch('rhtModule/checkEmail', credentials)
    // }
      
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