// 이랑 -> 현탁 auth하고 다음 라우터 설정 물어보기
<template>
  <div class="SendImg">
      <form @submit.prevent="onUpload">
          <div class="form-group">
              <input class="modifySubmit" type="file" name="imagesArray" @change="onChange">
          </div>
          <div v-if="this.changing===true">
              <button class="modifySubmit" style="width:8vw" @click="onsubmit">프로필 수정</button>
          </div>
      </form>
  </div>

</template>

<script>
import axios from "axios";
export default {
    data(){
      return {
        profile: null,
        changing: null,
      };  
    },
    methods:{
    onChange (event) {
          this.profile = event.target.files[0]
          this.changing = true
          console.log(this.$store.getters['rhtModule/authHeader'])
        },
        onUpload() {
        const BASE_URL = 'http://' + location.hostname + ':8081'
        // const BASE_URL = 'https://' + location.hostname
          const formData = new FormData()
          formData.append('profile', this.profile, this.profile.name)
          console.log(this.profile)
          console.log(this.$store.getters['rhtModule/authHeader'])
        axios({
            url: BASE_URL + '/api/v1/users/profile', //회원가입 api로
            method: 'post',
            data: formData,
            headers: {Authorization: this.$store.getters['rhtModule/authHeader'] }
        })
            .then(() => {
            alert('성공적으로 회원가입!')
            router.push({ name: 'Account' })
            this.changing = false
            })
            .catch(err => {
              alert('성공적으로 회원가입!')
            console.error(err)
            })
        }  
    }
};
</script>

<style>
.deleteSubmit{
  /* margin-top: 20px; */
  width: 6vw;
  height: 2vw;
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
.deleteSubmit:hover{
  background: #ffcc74;
}

.modifySubmit{
  /* margin-top: 20px; */
  width: 6vw;
  height: 2vw;
  border: 0;
  outline: none;
  border-radius: 10px;
  background: #47A0FF;
  color: white;
  font-weight: bold;
  font-size: 1.2em;
  letter-spacing: 2px;
  box-shadow: 0px 1.5px 4px #aaa, inset 0px 1px 1.5px #fff;
}
.modifySubmit:hover{
  background: #89B2E8;
}
</style>