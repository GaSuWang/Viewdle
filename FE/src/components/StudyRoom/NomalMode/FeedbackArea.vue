// 이병헌
<template>
  <div class="FeedbackArea">
    <!-- 피드백 리스트 -->
    <ul v-if="fbList" class="FBList">
      <!-- 피드백 입력란 -->
      <div class="FBInputBox" v-if="BtnClicked">
        <input type="text" v-model="FBContent" @keypress.enter="saveFB" :style="[BtnClicked==='good' ? 'background: #47A0FF' : 'background:#FFE6B5']">
        <button @click="closeFB">X</button>
      </div>
      
      <!-- 피드백 목록 -->
      <feedback-box v-for="fb in fbList" :key="fb.id"></feedback-box>

    </ul>
    <span v-else>아직 피드백이 존재하지 않습니다.</span>

    <!-- 피드백 굿/뱃 버튼 -->
    <div class="container">
      <button @click="createFB('good')">굿</button>
      <button @click="createFB('bad')">벳</button>
    </div>

  </div>
</template>

<script>
import FeedbackBox from '@/components/StudyRoom/NomalMode/FeedbackBox.vue'
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
export default {
  name: "FeedbackArea",
  components: {FeedbackBox},
  props:{
    videoInfo: Object
  },
  setup(){
    const store = useStore()
    // 영상에 피드백이 존재하는 지 알아야 함
    // 영상 정보를 넘겨줘 해당 영상에 피드백이 달려있는지 확인
    store.dispatch('lbhModule/isFBList', videoInfo)
    const fbList= computed(()=> store.getters["lbhModule/getFBList"])

    const BtnClicked = ref('') //피드백 버튼이 클릭되지 않은 상태가 '', 굿 버튼 클릭되면 good, 뱃 버튼 클릭되면 bad
    const FBContent = ref('') //새롭게 만들어진 피드백 박스와 연동됨

    // 피드백 입력란 생성
    const createFB = (gb) => {
      if (!BtnClicked.value) { //만약 굿/뱃 버튼 둘 다 눌리지 않은 상태에서 굿/뱃 버튼이 눌린다면
        if (gb === 'good') { BtnClicked.value = 'good' }
        else { BtnClicked.value = 'bad' }
      } 
      else { //만약 굿/뱃 버튼 둘 중 하나가 눌린 상태에서 또 다시 굿/뱃 버튼이 눌린다면
        if (gb === 'good') { BtnClicked.value = 'good' }
        else { BtnClicked.value = 'bad' }        
      }
    }

    // 피드백 저장
    const saveFB = () => {
      // store.dispatch("saveFB",  FBContent.value) // 원래 로직은 이거
      fbList.unshift({ // 임시로 만든 로직, fbList가 어떤 자료를 리턴할 지 모르겄네
        gb:BtnClicked.value, 
        content: FBContent.value
      }) 
      FBContent.value = ''
    }
    
    // 피드백 입력란 닫기
    const closeFB = () => {
      BtnClicked.value=''
    }

  return {
    BtnClicked,
    FBContent,
    fbList,
    createFB,
    saveFB,
    closeFB,
  }
  }
}
</script>

<style>

</style>