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
                <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" :checked="nextSuperUser = user">
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
    nextSuperUserInfo: {},
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
  ]),
  nextSuperUserList(){
    if(this.currentUserList.length) {
      return this.currentUserList.filter(p => p.myUserEmail !== this.myUserEmail)
    } else return []
  },
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
  async studyDestroy(){
    this.$store.dispatch('lbhModule/studyDestroyAxios')
    // this.OV = new OpenVidu()
    // this.session = this.OV.initSession()
    // this.session.connect(this.sesionToken)
    this.session.signal({
      data: '',
      to: [],
      type: 'studyDestroy'
    })
  },
  //방장이 면접을 나감
  superLeaveSession(){
    this.$store.dispatch('lbhModule/superUserLeaveSessionAxios', this.nextSuperUserInfo.myUserEmail)

    //방장이 현재 면접자
    if(this.$router.currentRoute.value.name === 'ee-room' || this.$router.currentRoute.value.name === 'ee-room-ez'){
      this.session.signal({
        data:`${this.currentSuperUserInfo} ${this.nextSuperUserInfo}`,
        to:[],
        type:'superEELeaveSession'
      })
      if (this.session) this.session.disconnect();
    } 
    //방장이 현재 면접관
    else if(this.$router.currentRoute.value.name === 'er-room' || this.$router.currentRoute.value.name === 'er-room-ez') {
      this.session.signal({
        data:`${this.currentSuperUserInfo} ${this.nextSuperUserInfo}`,
        to: [],
        type: 'superERLeaveSession'
      })
      if (this.session) this.session.disconnect();
    } 
    else if(this.$router.currentRoute.value.name === 'fb-room') {
      this.session.signal({
        data:`${this.currentSuperUserInfo} ${this.nextSuperUserInfo}`,
        to: [],
        type: 'superERLeaveSessionFromFB'
      })
      if (this.session) this.session.disconnect();
    } 
    else if(this.$router.currentRoute.value.name === 'waiting-room'){
      this.session.signal({
        data:`${this.currentSuperUserInfo} ${this.nextSuperUserInfo}`,
        to: [],
        type: 'superLeaveSessionWR'
      })
      if (this.session) this.session.disconnect();
    }

    alert('면접에서 성공적으로 나가셨습니다.')
    this.$store.commit('lbhModule/SET_SESSION', undefined)
    this.$store.commit('lbhModule/SET_OV', undefined)
    this.$store.commit('lbhModule/SET_PUBLISHER', undefined)
    this.$store.commit('lbhModule/SET_SUBSCRIBERS', [])
    this.$store.commit("lbhModule/EMPTY_WR_PARTICIPANT_LIST");
    this.$store.commit("lbhModule/EMPTY_CURRENT_USER_LIST");
    this.$router.push('/main')
    this.nextSuperUserInfo = {}

  },
  closeAPM(){
    this.nextSuperUser = {}
  },
},
};
</script>

<style>
</style>
