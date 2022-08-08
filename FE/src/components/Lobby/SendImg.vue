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
// import { useStore } from 'vuex'
export default {
    data(){
      return {
         profile: null
      };  
    },
    methods:{
    onChange (event) {
          this.profile = event.target.files[0]
        },
        onUpload() {
          const formData = new FormData()
          formData.append('profile', this.profile, this.profile.name)
        axios({
            url: 'http://localhost:8081/api/v1/users/profile', //회원가입 api로
            method: 'post',
            data: formData,
            headers : {"Authorization" : "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJzdHJpbmciLCJpc3MiOiJzc2FmeS5jb20iLCJleHAiOjE2NjEyNDQ1NTcsImlhdCI6MTY1OTk0ODU1N30.ikiUm-s9X26H2ty74ySpZPh-0Qpi82jPanQ18HVtZ2G5ugTXc0JDE5Z6rWJECbs1hH6V-NwQ3o-1GlMDggZPOw"}
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