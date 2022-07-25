// 이병헌
<template>
  <div class="CLView">
  <!-- 상단 -->
  <!-- 면접자 이름? 이메일? -->
  <!-- 면접자 자소서 내용 -->

  <!-- 하단 -->
  <!-- 탭 닫기 버튼? -->
  <button @click="CloseTab"></button>
  </div>  
</template>

<script>
import {onCreated} from 'vue'
import { useStore } from 'vuex'
export default {
  name: 'CLView',
  setup(){
    onCreated(()=> {
      // 면접자 정보 받아오기
      // 면접자 이름, 면접자 자소서
      const store = useStore();
      const getEEInfo = store.dispatch("lbhModule/getEEInfo", params) //params에는 면접자 정보?
      getEEInfo();
    }),
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