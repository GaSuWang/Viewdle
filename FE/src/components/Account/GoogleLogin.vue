<template>
  <section class="test">
    <div v-on:click="GoogleLoginBtn"><i class="fab fa-google"></i></div>
    <div id="my-signin2" style="display: none"></div>
    <a href="http://localhost:8081/login/oauth2/code/google"> 현탁이가만든 버튼 </a>
    <!-- <div v-on:click="GoogleLoginBtn">현탁이가만든 버튼</div> -->
  </section>
</template>

<script>
// import { useStore } from 'vuex'
// import { useRouter } from "vue-router"; 
export default {
    // setup(){
    //     const store = useStore()
    //     const router = useRouter()
    //     function GoogleLoginBtn(){
    //         store.dispatch('rhtModule/googleLoginButton')
    //         router.push({name:"main"})
    //     }
    // return {
    //   GoogleLoginBtn
    // }
    // }
name: "GoogleLoginView",
  methods: {
    GoogleLoginBtn:function(){
      var self = this;

      window.gapi.signin2.render('my-signin2', {
        scope: 'profile email',
        width: 240,
        height: 50,
        longtitle: true,
        theme: 'dark',
        onsuccess: this.GoogleLoginSuccess,
        onfailure: this.GoogleLoginFailure,
      });

      setTimeout(function () {
        if (!self.googleLoginCheck) {
          const auth = window.gapi.auth2.getAuthInstance();
          auth.isSignedIn.get();
          document.querySelector('.abcRioButton').click();
        }
      }, 1500)

    },
    async GoogleLoginSuccess(googleUser) {
      const profile = googleUser.getBasicProfile()
      console.log('ID Token: ', googleUser.getAuthResponse().id_token); // 실제 토큰
      console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
      console.log('Name: ' + profile.getName());
      console.log('Image URL: ' + profile.getImageUrl());
      console.log('Email: ' + profile.getEmail());
    },
    //구글 로그인 콜백함수 (실패)
    GoogleLoginFailure(error) {
      console.log(error);
    },
  }
}
</script>
<style>

</style>
