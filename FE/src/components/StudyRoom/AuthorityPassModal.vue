// 이병헌
<template>
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
            정말 면접 도중에 나가시겠습니까? <br>
            지금까지의 피드백이 면접자에게 제공되지 않고 방장 권한 위임 후 로비로 이동합니다.
          </p>

          <ul>
            <li v-for="user in nextSuperUserList" :key="user.id">
              <div class="form-check">
                <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" :checked="nextSuperUser = user.name">
                <label class="form-check-label" for="flexRadioDefault1">
                  {{user.name}}
                </label>
              </div>
            </li>
          </ul>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="closeAPM">돌아가기</button>
          <button type="button" class="btn btn-primary" @click="superLeaveSession">로비로 나가기</button>
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
  }
},
computed: {
  ...mapGetters('lbhModule', [
    'myUserName',
    'subscribers',
    'publisher',
    'currentUserList',
    'sessionToken',
    'session',
  ]),
  nextSuperUserList(){
    return this.currentUserList.filter(p => p.name !== this.myUserName)
  }
},
methods:{
  //방장이 면접을 나감
  superLeaveSession(){
    //방장이 현재 면접자
    if(this.$router.currentRoute.value.name === 'ee-room' || this.$router.currentRoute.value.name === 'ee-room-ez'){
      this.session.signal({
        data:`${this.myUserName} ${this.nextSuperUser}`,
        to:[],
        type:'superEELeaveSession'
      })
      if (this.session) this.session.disconnect();
    } 
    //방장이 현재 면접관
    else if(this.$router.currentRoute.value.name === 'er-room' || this.$router.currentRoute.value.name === 'er-room-ez' || this.$router.currentRoute.value.name === 'fb-room') {
      this.session.signal({
        data: `${this.myUserName} ${this.nextSuperUser}`,
        to: [],
        type: 'superERLeaveSession'
      })
    } 
    
    else if(this.$router.currentRoute.value.name === 'waiting-room'){
      this.session.signal({
        data: `${this.myUserName} ${this.nextSuperUser}`,
        to: [],
        type: 'superLeaveSessionWR'
      })
      if (this.session) this.session.disconnect();
    }

    // window.removeEventListener("beforeunload", this.ERleaveSession);
    // document.body.remove('.modal-open')
    // $('.modal-backdrop').remove();
    alert('면접에서 성공적으로 나가셨습니다.')
    this.$store.commit('lbhModule/SET_SESSION', undefined)
    this.$store.commit('lbhModule/SET_OV', undefined)
    this.$store.commit('lbhModule/SET_PUBLISHER', undefined)
    this.$store.commit('lbhModule/SET_SUBSCRIBERS', [])
    this.$store.commit("lbhModule/EMPTY_WR_PARTICIPANT_LIST");
    this.$router.push('/main')
    this.nextSuperUser = ''

  },
  closeAPM(){
    this.nextSuperUser = ''
  },
},
};
</script>

<style>
</style>
