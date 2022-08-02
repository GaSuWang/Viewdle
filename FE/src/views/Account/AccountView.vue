// 임현탁
<template>
<div class="loginbody">
  <LoginCard/>
</div>
</template>

<script>
import LoginCard from '@/components/Account/LoginCard.vue'
export default {
  components:{
    LoginCard
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
.loginbody{
  width: 90%;
  height: 90%;
  background : rgb(255,255,255,0.5);
  border-radius: 20px;
    display:flex;
  justify-content: center;
  flex-direction: column;
}
</style>


