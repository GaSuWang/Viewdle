// 이랑 -> 현탁 auth하고 다음 라우터 설정 물어보기
<template>
  <div class="SendImg">
      <form @submit.prevent="onUpload">
          <div class="form-group filebox">
            <label for="sendimgsubmitbutton">파일선택</label>
            <input class="modifySubmit" id="sendimgsubmitbutton" type="file" name="imagesArray" @change="onChange">
            <div v-if="this.changing===true">
              <button class="modifySubmit" @click="onsubmit">프로필 수정</button>
            </div>
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
        },
        onUpload() {
        const BASE_URL = 'http://' + location.hostname + ':8081'
        // const BASE_URL = 'https://' + location.hostname
          const formData = new FormData()
          formData.append('profile', this.profile, this.profile.name)
        axios({
            url: BASE_URL + '/api/v1/users/profile', //회원가입 api로
            method: 'post',
            data: formData,
            headers: {Authorization: this.$store.getters['rhtModule/authHeader'] }
        })
            .then(() => {
            alert('프로필수정이 완료되었습니다!')
            this.$router.push({ name: 'main' })
            this.changing = false
            })
            .catch(err => {
              alert('더 작은 데이터크기의 이미지를 가져오세요!')
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
.filebox button{
  background: #FEAA00;
}
.filebox button:hover{
  background: #ffcc74;
}
.filebox label{
  /* margin-top: 20px; */
  width: 8vw;
  height: 2.5vw;
  border: 0;
  outline: none;
  border-radius: 10px;
  background: #47A0FF;
  color: white;
  font-weight: bold;
  font-size: 1.2em;
  letter-spacing: 2px;
  box-shadow: 0px 1.5px 4px #aaa, inset 0px 1px 1.5px #fff;
  margin-right: 5px;
}
.filebox label:hover{
  background: #89B2E8;
}
.filebox input[type="file"] {  /* 파일 필드 숨기기 */
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip:rect(0,0,0,0);
  border: 0;
}
.form-group{
  line-height: 35px;
  text-align: center;
}
.filebox{
  display: flex;
  flex-flow: row;
}
</style>