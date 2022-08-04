// 이병헌
<template>
  <teleport :to='APMDestination' />
  <div class="AuthorityPassModal" v-if="APMOpen">
    <!-- 상단 -->
    <!-- 방장 권한 넘겨주기 -->

    <!-- 중단 -->
    <!-- 유저 체크박스 리스트 -->
    <ul>
      <li v-for="user in nextSuperUserList" :key="user.id">
        <div class="form-check" @click="sleectSuperUser(user)">
          <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1">
          <label class="form-check-label" for="flexRadioDefault1">
            {{user.name}}
          </label>
        </div>
      </li>
    </ul>
    <!-- 하단 -->
    <!-- 취소 버튼 -->
    <button class="btn btn-white" @click="closeAPM">취소</button>
    <!-- 로비로 나가기 버튼 -->
    <button class="btn btn-warning" @click="superUserOut">나가기</button>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
name: 'AuthorityPassModal',
computed: {
  ...mapGetters('lbhModule', [
    'WRParticipantList',
    'myUserName',
    'APMOpen',
    'APMDestination'
  ]),
  nextSuperUserList(){
    return this.WRParticipantList.filter(p => p.name !== this.myUserName)
  }
},
data(){
  return{
  }
},
methods:{
  selectSuperUser(user){
    this.$store.commit('lbhModule/SET_SUPERUSER', user)
  },
  superUserOut(){
    this.$store.commit('lbhModule/SET_SUPERUSER_OUT', true)
    this.$router.push('/main')
  },
  closeAPM(){
    this.$store.commit('lbhModule/SET_APM_OPEN', false)
    this.$store.commit('lbhModule/SET_APM_DESTINATION', undefined)
  },
},
};
</script>

<style></style>
