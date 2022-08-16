// 이랑 -> 현탁 auth하고 다음 라우터 설정 물어보기
<template>
  <div class="SendImg">
      <form @submit.prevent="onUpload">
          <div class="form-group">
              <input type="file" name="imagesArray" @change="onChange">
          </div>
          <div class="form-group">
              <button class="btn btn-success">Submit</button>
          </div>
      </form>>>
  </div>

</template>

<script>
import axios from "axios";
import { mapGetters } from 'vuex'
export default {
    data(){
      return {
         profile: null
      };  
    },
    ...mapGetters('rhtModule',[
      'authHeader',
    ]),
    methods:{
    onChange (event) {
          this.profile = event.target.files[0]
        },
        onUpload() {
        // const BASE_URL = 'http://' + location.hostname + ':8081'
        const BASE_URL = 'https://' + location.hostname
          const formData = new FormData()
          formData.append('profile', this.profile, this.profile.name)
        axios({
            url: BASE_URL + '/api/v1/users/profile', //회원가입 api로
            method: 'post',
            data: formData,
            headers: {Authorization: this.authHeader }
        })
            // .then(() => {
            // alert('성공적으로 회원가입!')
            // router.push({ name: 'Account' })
            // })
            // .catch(err => {
            // console.error(err)
            // })
        }  
    }
};
</script>

<style>
</style>