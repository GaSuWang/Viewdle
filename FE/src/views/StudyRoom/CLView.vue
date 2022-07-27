// 이병헌
<template>
  <div class="CLView">
  <!-- 상단 -->
  <!-- 면접자 이름? 이메일? -->
  <h1>김싸피의 자소서</h1>
  <!-- 면접자 자소서 내용 -->
  <p>자소서 쓰기 어렵다</p>
  <p>눈이 아프다</p>
  <p>진짜 코드 개더러워</p>
  <p>주석을 못 다는 거야, 아니면 주석을 쓸데없이 많이 다는 거야?</p>
  <!-- 하단 -->
  <!-- 탭 닫기 버튼? -->
  <button @click="CloseTab">자소서 탭 닫기</button>
  </div>  
</template>

<script>
// import {onCreated} from 'vue'
// import { useStore } from 'vuex'
export default {
  name: 'CLView',
  setup(){
    // onCreated(()=> {
    //   // 면접자 정보 받아오기
    //   // 면접자 이름, 면접자 자소서
    //   const store = useStore();
    //   const getEEInfo = store.dispatch("lbhModule/getEEInfo", params) //params에는 면접자 정보?
    //   getEEInfo();
    // }),
    function CloseTab () {
      if(confirm("면접자의 자소서를 닫으시겠습니까?")){
        close(); //현재 탭 닫기
      }
    }

    return {
      CloseTab,
    }
  },
}
</script>

<style>

</style>