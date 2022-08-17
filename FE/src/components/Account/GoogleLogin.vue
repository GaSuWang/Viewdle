<template>
  <section class="test">
    <div v-on:click="GoogleLoginBtn"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/800px-Google_%22G%22_Logo.svg.png" style="width:20px" alt=""></div>
    <div id="my-signin2" style="display: none"></div>
    
    <!-- <a href="http://localhost:8081/login/oauth2/code/google"> 현탁이가만든 버튼 </a> -->
    <!-- <div v-on:click="GoogleLoginBtn">현탁이가만든 버튼</div> -->
  </section>
</template>

<script>
import axios from 'axios'
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
      const BASE_URL = 'http://' + location.hostname + ':8081'
      // const BASE_URL = 'https://' + location.hostname
      const profile = googleUser.getBasicProfile()

      axios({
        // url: BASE_URL + `/api/v1/users/check/duplicate`,  // 이메일확인 api
        url: BASE_URL + '/api/v1/users/check/duplicate',
        method: 'post',
        data: {'email' : profile.getEmail()},
        
      })
        .then(() => {
          this.$router.push({
            name:'GoogleSignup',
            params:{
              'idToken':googleUser.getAuthResponse().id_token
            }
          })
        })
        .catch(err => {
          if (err.response && err.response.status === 400 ){
            axios({
              // url: BASE_URL + '/api/v1/social/google/login',
              url: BASE_URL + '/api/v1/social/google/login',
              method:'post',
              data: {'idToken':googleUser.getAuthResponse().id_token}           
            }).then(tq => {
      
              const token = tq.data.accessToken
              this.$store.dispatch('rhtModule/saveToken', token)
              this.$store.dispatch('rhtModule/fetchCurrentUser')
              this.$store.dispatch('rhtModule/fetchHistories')
              this.$store.dispatch('rhtModule/getBadge')
              this.$store.dispatch('rhtModule/getCoverLetter')
              this.$store.dispatch('rhtModule/getStudyRoom')
              this.$store.dispatch('rhtModule/getReplay')
              this.$router.push('/main')
            }).catch(err => {
              console.error(err.response)
              alert('로그인 실패')
            })
          }
          else{
            alert('이미 가입된 이메일입니다.')

            // this.$router.push({
            // name:'GoogleSignup',
            // params:{
            //   'idToken':googleUser.getAuthResponse().id_token
            // }
          // })
          }
      })
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
