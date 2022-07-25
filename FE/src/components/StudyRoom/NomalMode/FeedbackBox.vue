// 이병헌
<template>
  <div class="FeedbackBox" :style="[fb.gb==='good' ? 'background: #47A0FF' : 'background:#FFE6B5']">
    {{fb.content}}
    <button @click="deleteFB">X</button>
  </div>
</template>

<script>
import {useStore} from 'vuex'
export default {
    name: "FeedbackBox",
    props: {
        fb:Object
    },
    setup(){
      const store = useStore()
      function deleteFB(){
          store.dispacth('lbhModule/deleteFB', this.fb.id) //store action에 추가
      }
      return {
        deleteFB
      }
    }
}

</script>

<style>

</style>