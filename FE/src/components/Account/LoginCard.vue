// 임현탁
<template>
<section class="vh-100">
  <div class="container-fluid h-custom">
    <div class="row d-flex justify-content-center align-items-center h-100">
      <div class="col-md-9 col-lg-6 col-xl-5">
        <img id="logoimg" src="@/assets/images/anyimgs.png"
          class="img-fluid" alt="Sample image">
      </div>
      <div class="card" style="width: 25%;">
          <div class="d-flex flex-row align-items-center justify-content-center justify-content-lg-start">
            <p class="lead fw-normal mb-0 me-3">구글 로그인 해</p>

            <section class="googlelogin">
              <div v-on:click="GoogleLoginBtn"><img id="googlelogo" src="@/assets/images/Google__G__Logo.svg.png"></div>
              <div id="my-signin2" style="display: none"></div>
            </section>
          </div>

          <div class="divider d-flex align-items-center my-4">
            <p class="text-center fw-bold mx-3 mb-0">or</p>
          </div>

          <!-- 이메일 인풋 -->
          <form @submit.prevent="login(credentials)">
            <div class="form-outline mb-4">
              <input type="email" v-model="credentials.email" class="form-control form-control-lg"
                placeholder="Email address" />
            </div>

            <!-- Password input -->
            <div class="form-outline mb-4">
              <input type="password" v-model="credentials.password" class="form-control form-control-lg"
                placeholder="Password" />
            </div>

            <div class="">
              <button class="btn btn-primary btn-lg">로그인</button>
            </div>
          </form>
          <div class="">
            <!-- Checkbox -->
            <a href="pw" class="text-body">비번 찾기</a>
            <a href="signup" class="link-danger">회원가입</a>
          </div>
      </div>
    </div>
  </div>
</section>
</template>

<script>
import { useStore } from 'vuex'
import { reactive } from 'vue'

export default {
  name: 'LoginCard',
  setup () {
    const credentials = reactive({
      email: '',
      password: '',
    })

    const store = useStore()

    function login(){
      store.dispatch('rhtModule/login', credentials)
    }

        
    return {
      login, credentials
    }
  }
}

// name: "GoogleLoginView",
//   methods: {
//     GoogleLoginBtn:function(){
//       var self = this;

//       window.gapi.signin2.render('my-signin2', {
//         scope: 'profile email',
//         width: 240,
//         height: 50,
//         longtitle: true,
//         theme: 'dark',
//         onsuccess: this.GoogleLoginSuccess,
//         onfailure: this.GoogleLoginFailure,
//       });

//       setTimeout(function () {
//         if (!self.googleLoginCheck) {
//           const auth = window.gapi.auth2.getAuthInstance();
//           auth.isSignedIn.get();
//           document.querySelector('.abcRioButton').click();
//         }
//       }, 1500)

//     },
//     async GoogleLoginSuccess(googleUser) {
//       const googleEmail = googleUser.getBasicProfile().getEmail();
//       if (googleEmail !== 'undefined') {
//         console.log(googleEmail);
//       }
//     },
//     //구글 로그인 콜백함수 (실패)
//     GoogleLoginFailure(error) {
//       console.log(error);
//     },
//   }

</script>

<style>
#logoimg{
  width: 500px;
  height: 500px;
}
#googlelogo{
  color: white;
  width: 15px;
  height: 15px;
  object-fit: cover;
}
.divider:after,
.divider:before {
content: "";
flex: 1;
height: 1px;
background: #eee;
}
.h-custom {
height: calc(100% - 73px);
}
@media (max-width: 450px) {
.h-custom {
height: 100%;
}
}
</style>

