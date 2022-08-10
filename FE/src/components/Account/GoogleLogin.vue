<template>
  <section class="test">
    <div v-on:click="GoogleLoginBtn"><i class="fab fa-google"></i></div>
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
      const profile = googleUser.getBasicProfile()
      // console.log('idToken: ', googleUser.getAuthResponse().id_token); // 실제 토큰
      // console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
      // console.log('Name: ' + profile.getName());
      // console.log('ImageURL: ' + profile.getImageUrl());
      // console.log('Email: ' + profile.getEmail());

      axios({
        // url: 'https://' + location.hostname + `/api/v1/users/check/duplicate`,  // 이메일확인 api
        url: 'http://' + location.hostname + ':8081' + '/api/v1/users/check/duplicate',
        method: 'post',
        data: {'email' : profile.getEmail()},
        
      })
        .then(() => {
          console.log('ㅎ2ㅎ2')
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
              // url: 'https://' + location.hostname + '/api/v1/social/google/login',
              url: 'http://' + location.hostname + ':8081' + '/api/v1/social/google/login',
              method:'post',
              data: {'idToken':googleUser.getAuthResponse().id_token}           
            }).then(tq => {
              console.log("해윙")
              console.log(tq)
      
              const token = tq.data.accessToken
              console.log('1')
              this.$store.dispatch('rhtModule/saveToken', token)
              console.log('2')
              this.$store.dispatch('rhtModule/fetchCurrentUser')
              console.log('3')
              this.$store.dispatch('rhtModule/fetchHistories')
              console.log('4')
              this.$store.dispatch('rhtModule/getBadge')
              console.log('5')
              this.$store.dispatch('rhtModule/getCoverLetter')
              console.log('6')
              this.$store.dispatch('rhtModule/getStudyRoom')
              console.log('7')
              this.$store.dispatch('rhtModule/getReplay')
              console.log('8')
              this.$router.push('/main')
              console.log('9')
            }).catch(err => {
              console.error(err.response)
              alert('로그인 실패')
            })
          }
          else{
            console.error(err.response)
            console.log(profile.getEmail())
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
