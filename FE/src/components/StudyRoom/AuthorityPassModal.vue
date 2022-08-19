// 이병헌
<template v-if="currentUserList">
  <!-- 방장 권한 위임 모달 -->
  <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">방장 권한 넘기기</h5>
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
                <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" @click="setNextSuperUser(user)">
                <label class="form-check-label" for="flexRadioDefault1">
                  {{user.myUserName}}: {{user.myUserEmail}}
                </label>
              </div>
            </li>
          </ul>
        </div>

        <div class="modal-footer">
          <button v-if="nextSuperUserList.length != 0" type="button" class="btn" data-bs-dismiss="modal" @click="superUserLeaveSessionAxios">로비로 나가기</button>
          <button v-if="nextSuperUserList.length == 0 || isWR" type="button" class="btn" data-bs-dismiss="modal" @click="studyDestroy">스터디 폭파</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
name: 'AuthorityPassModal',
data(){
  return{
    // OV: undefined,
    // session: undefined,
    nextSuperUser:{},
  }
},
computed: {
  ...mapGetters('lbhModule', [
    'myUserName',
    'myUserEmail',
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
    return !!(this.$router.currentRoute.value.name === 'waiting-room')
  },
  currentSuperUserInfo(){
    return {
      myUserName: this.myUserName,
      myUserEmail: this.myUserEmail,
    }
  }
},
methods:{
  setNextSuperUser(user){
    this.nextSuperUser = user
  },
  //방장이 면접을 폭파시킴
  studyDestroy(){
    this.session.signal({
      data: '',
      to: [],
      type: 'studyDestroy'
    })
    this.$store.dispatch('lbhModule/studyDestroyFirstAxios')
  },
  //방장이 면접을 나감
  superUserLeaveSessionAxios(){
    this.$store.commit('lbhModule/SET_NEXT_SUPERUSER_INFO', this.nextSuperUser)
    this.$router.push('/main')
    const currentSuperUserEmail = this.myUserEmail
    const nextSuperUserEmail = this.nextSuperUser.myUserEmail
    //방장이 현재 면접자
    if(this.$router.currentRoute.value.name === 'ee-room' || this.$router.currentRoute.value.name === 'ee-room-ez'){
      this.$store.dispatch('lbhModule/EELeaveSessionAxios')
      this.session.signal({
        data:`${currentSuperUserEmail} ${nextSuperUserEmail}`,
        to:[],
        type:'superEELeaveSession'
      })
      if (this.session) this.session.disconnect();
    } 
    //방장이 현재 면접관
    else if(this.$router.currentRoute.value.name === 'er-room' || this.$router.currentRoute.value.name === 'er-room-ez') {
      this.session.signal({
        data:`${currentSuperUserEmail} ${nextSuperUserEmail}`,
        to: [],
        type: 'superERLeaveSession'
      })
      if (this.session) this.session.disconnect();
    } 
    else if(this.$router.currentRoute.value.name === 'fb-room') {
      this.session.signal({
        data:`${currentSuperUserEmail} ${nextSuperUserEmail}`,
        to: [],
        type: 'superERLeaveSessionFromFB'
      })
      if (this.session) this.session.disconnect();
    } 
    else if(this.$router.currentRoute.value.name === 'waiting-room'){
      this.session.signal({
        data:`${currentSuperUserEmail} ${nextSuperUserEmail}`,
        to: [],
        type: 'superLeaveSessionWR'
      })
      if (this.session) this.session.disconnect();
    }
    alert('면접에서 성공적으로 나가셨습니다.')
    this.$store.dispatch('lbhModule/superUserLeaveSessionAxios', nextSuperUserEmail)
  },
  closeAPM(){
    this.$store.commit('lbhModule/EMPTY_NEXT_SUPERUSER_INFO')
  },
},
};
</script>

<style>
.modal-body ul{
  list-style: none;
}
</style>
