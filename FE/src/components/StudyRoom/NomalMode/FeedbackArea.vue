// 이병헌
<template>
  <div class="FeedbackArea">
    <!-- 피드백 리스트 -->
    <ul class="FBList">
      <!-- 피드백 입력란 -->
      <div class="FBInputBox" v-if="BtnClicked">
        <input type="text" v-model="FBContent" @keypress.enter="saveFB" :style="[BtnClicked==='good' ? 'background: #47A0FF' : 'background:#FFE6B5']">
        <button @click="closeFB">X</button>
      </div>
      
      <!-- 피드백 목록 -->
      <!-- <feedback-box v-for="fb in fbs" :key="fb.id"></feedback-box> -->

      <!-- 임시로 만든 목록 -->
      <ul>
        <li v-for="fb in FBList" :key="fb.id" :style="[fb.gb==='good' ? 'background: #47A0FF' : 'background:#FFE6B5']">{{fb.content}}</li>
      </ul>

    </ul>

    <!-- 피드백 굿/뱃 버튼 -->
    <div class="container">
      <button @click="createFB('good')">굿</button>
      <button @click="createFB('bad')">벳</button>
    </div>

  </div>
</template>

<script>
import FeedbackBox from '@/components/StudyRoom/NomalMode/FeedbackBox.vue'
import { ref } from 'vue'
export default {
  name: "FeedbackArea",
  components: {FeedbackBox},
  setup(){
    const BtnClicked = ref('') //피드백 버튼이 클릭되지 않은 상태가 '', 굿 버튼 클릭되면 good, 뱃 버튼 클릭되면 bad
    const FBContent = ref('') //새롭게 만들어진 피드백 박스와 연동됨
    const FBList = ref([]) // 데이터가 없으니 임시로 만든 피드백 리스트
    // 피드백 입력란 생성
    const createFB = (gb) => {
      if (!BtnClicked.value) { //만약 굿/뱃 버튼 둘 다 눌리지 않은 상태에서 굿/뱃 버튼이 눌린다면
        if (gb === 'good') {
          BtnClicked.value = 'good'
        }
        else {
          BtnClicked.value = 'bad'
        }
      } else { //만약 굿/뱃 버튼 둘 중 하나가 눌린 상태에서 또 다시 굿/뱃 버튼이 눌린다면
        if (gb === 'good') {
          BtnClicked.value = 'good'
        }
        else {
          BtnClicked.value = 'bad'
        }        
      }

    }

    // 피드백 저장
    const saveFB = () => {
      // store.dispatch("saveFB",  FBContent.value) // 원래 로직은 이거
      FBList.value.unshift({ // 임시로 만든 로직
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
    FBList,
    createFB,
    saveFB,
    closeFB,
  }
  }
}
</script>

<style>

</style>