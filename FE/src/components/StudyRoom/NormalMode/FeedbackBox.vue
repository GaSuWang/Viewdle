// 이병헌
<template>
  <div class="FeedbackBox" :style="[fb.gb==='good' ? 'background: #47A0FF' : 'background:#FFE6B5']">
    {{fb.content}}
    <button @click="deleteFB">X</button>
  </div>
</template>

<script>
export default {
    name: "FeedbackBox",
    props: {
        fb:Object
    },
    data(){
      return{ 
        id: this.fb.reg_dt
      }
    },
    methods:{
      deleteFB(id){
          this.$store.dispatch('lbhModule/deleteFB', id) //store action에 추가
      }
    },
    setup(){
      return {
      }
    }
}

</script>

<style scoped>
.FeedbackBox{
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 2%;
  margin-bottom: 2%;
  width: 100%;
  height: 20%;
  border-radius: 30px;
}
</style>