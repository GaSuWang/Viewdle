// 이병헌
<template>
  <div class="FeedbackBox" >
    <textarea
      type="text"
      class="form-control"
      v-if="updateClick"
      v-model="feedbackContent"
      @keypress.enter="updateFB"/>
    <span v-if="!updateClick" @click="openUpdateFB">{{ fb.feedbackContent }}</span>
    <div class="FBBtnContainer">
      <button :class="[fb.feedbackType === 'good' ? 'good' : 'bad']" class="FBBoxBtn" @click="deleteFB">
        <i class="bi bi-trash3"></i>
      </button>
      <!-- [김이랑] 비디오 시간 이동 / 임시로 버튼 삽입 -->
      <button :class="[fb.feedbackType === 'good' ? 'good' : 'bad']" class="FBBoxBtn" @click="moveTo">
        <i class="fa-solid fa-circle-play"></i>
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: "FeedbackBox",
  props: {
    fb: Object,
  },
  computed:{
    ...mapGetters('lbhModule', [
      'myUserEmail',
    ])
  },
  created(){
    console.log('이 피드백의 생성일시', this.fb.timeline)
  },
  data() {
    return {
      id: this.fb.timeline,
      feedbackContent: this.fb.feedbackContent,
      updateClick: false,
    };
  },
  methods: {
    deleteFB() {
      this.$store.commit("lbhModule/DELETE_FB", this.fb.timeline); //store action에 추가
    },
    openUpdateFB(){
      this.updateClick = true
    },
    updateFB(){
      const data = {
        feedbackType: this.fb.feedbackType,
        feedbackContent: this.feedbackContent,
        timeline: this.fb.timeline,
      }
      this.$store.commit('lbhModule/UPDATE_FB', data)
      this.updateClick = false 
    },
    // [김이랑] 비디오 시간 이동
    moveTo(){
      this.$store.commit('lbhModule/SET_VIDEO_TIME', this.fb.timeline)
    }
  },
};
</script>

<style scoped>
.FeedbackBox {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  justify-self: center;
  align-items: center;
  width: 98%;
  /* height: 20%; */
  padding: 3%;
  border-radius: 10px;
  margin-top: 2%;
  margin-bottom: 2%;
  margin-right: 0;
  overflow-wrap: break-word;
  background-color: white;
}

.FBBtnContainer{
  display: flex;
  width: 30%;
}

.good {
  /* background-color: #47a0ff; */
  background-color: #89B2E8;
  border: 1px #0f70ed solid;
}

.bad {
  /* background-color: #ffe6b5; */
  background-color: #ffcc74;
  border: 1px #fcab1f solid
}

.FBBoxBtn {
  width: 10%;
  border-radius: 5px;
}

.FBBoxBtn i{
  color: white;
}
</style>
