// 이병헌
<template v-if="currentUserList">
  <!-- 방장 권한 위임 모달 -->
  <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>

        <div class="modal-body">
          <p>
            정말 나가시겠습니까? <br>
            방장 권한 위임 후 로비로 이동합니다.
          </p>

          <!-- 다음 방장 목록 -->
          <ul>
            <li v-for="user in nextSuperUserList" :key="user.myUserEmail">
              <div class="form-check">
                <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" :checked="nextSuperUser=user">
                <label class="form-check-label" for="flexRadioDefault1">
                  {{user.myUserName}}: {{user.myUserEmail}}
                </label>
              </div>
            </li>
          </ul>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="closeAPM">돌아가기</button>
          <button type="button" class="btn btn-primary" @click="superLeaveSession">로비로 나가기</button>
          <button v-if="isWR" type="button" class="btn btn-warning" @click="studyDestroy">스터디 폭파</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
// import { OpenVidu } from "openvidu-browser";
export default {
name: 'AuthorityPassModal',
created(){
    // this.OV = new OpenVidu();
    // this.session = this.OV.initSession();
    // this.session.connect(this.sessionToken)
    // .then(console.log('session connect success'))
    // .catch(err=>console.err(err.response))
},
data(){
  return{
    // OV: undefined,
    // session: undefined,
    nextSuperUser:'',
  }
},
computed: {
  ...mapGetters('lbhModule', [
    'myUserName',
    'subscribers',
    'publisher',
    'currentUserList',
    'sessionToken',
    'OV',
    'session',
    'nextSuperUserList',
    'nextSuperUserInfo',
  ]),

  isWR(){
    if(this.$router.currentRoute.value.name === 'waiting-room'){
      console.log('waiting-room')
      return true
    } else return false
  },
  currentSuperUserInfo(){
    return {
      myUserName: this.myUserName,
      myUserEmail: this.myUserEmail,
    }
  }
},
methods:{
  //방장이 면접을 폭파시킴
  studyDestroy(){
    this.$store.commit('lbhModule/SET_STUDY_DESTOY', true)
    this.session.signal({
      data: '',
      to: [],
      type: 'studyDestroy'
    })
    this.$router.push('/main')
  },
  //방장이 면접을 나감
  superLeaveSession(){
    this.$store.commit('lbhModule/SET_NEXT_SUPERUSER_INFO', this.nextSuperUser)
    const currentSuperUserName = this.myUserName
    const currentSuperUserEmail = this.myUserEmail
    const nextSuperUserName = this.nextSuperUser.myUserName
    const nextSuperUserEmail = this.nextSuperUser.myUserEmail
    //방장이 현재 면접자
    if(this.$router.currentRoute.value.name === 'ee-room' || this.$router.currentRoute.value.name === 'ee-room-ez'){
      this.session.signal({
        data:`{myUserName:${currentSuperUserName},myUserEmail:${currentSuperUserEmail}} {myUserName:${nextSuperUserName},myUserEmail:${nextSuperUserEmail}}`,
        to:[],
        type:'superEELeaveSession'
      })
      if (this.session) this.session.disconnect();
    } 
    //방장이 현재 면접관
    else if(this.$router.currentRoute.value.name === 'er-room' || this.$router.currentRoute.value.name === 'er-room-ez') {
      this.session.signal({
        // data:`${this.currentSuperUserInfo} ${this.nextSuperUserInfo}`,
        data:`{myUserName:${currentSuperUserName},myUserEmail:${currentSuperUserEmail}} {myUserName:${nextSuperUserName},myUserEmail:${nextSuperUserEmail}}`,
        to: [],
        type: 'superERLeaveSession'
      })
      if (this.session) this.session.disconnect();
    } 
    else if(this.$router.currentRoute.value.name === 'fb-room') {
      this.session.signal({
        // data:`${this.currentSuperUserInfo} ${this.nextSuperUserInfo}`,
        data:`{myUserName:${currentSuperUserName},myUserEmail:${currentSuperUserEmail}} {myUserName:${nextSuperUserName},myUserEmail:${nextSuperUserEmail}}`,
        to: [],
        type: 'superERLeaveSessionFromFB'
      })
      if (this.session) this.session.disconnect();
    } 
    else if(this.$router.currentRoute.value.name === 'waiting-room'){
      this.session.signal({
        // data:`${this.currentSuperUserInfo} ${this.nextSuperUserInfo}`,
        data:`{myUserName:${currentSuperUserName},myUserEmail:${currentSuperUserEmail}} {myUserName:${nextSuperUserName},myUserEmail:${nextSuperUserEmail}}`,
        to: [],
        type: 'superLeaveSessionWR'
      })
      if (this.session) this.session.disconnect();
    }

    alert('면접에서 성공적으로 나가셨습니다.')

    this.$router.push('/main')

  },
  closeAPM(){
    this.$store.commit('EMPTY_NEXT_SUPERUSER_INFO')
  },
},
};
</script>

<style>
</style>
