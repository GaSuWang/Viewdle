// 이병헌
<template>
  <div class="FeedbackBox" >
    <textarea
      type="text"
      class="form-control"
      v-if="updateClick"
      v-model="FBContent"
      @keypress.enter="updateFB"/>
    <span v-if="!updateClick" @click="openUpdateFB">{{ fb.content }}</span>
    <button :class="[fb.gb === 'good' ? 'good' : 'bad']" class="FBBoxBtn" @click="deleteFB">
      <i class="bi bi-trash3"></i>
    </button>
  </div>
</template>

<script>
export default {
  name: "FeedbackBox",
  props: {
    fb: Object,
  },
  created(){
    console.log('이 피드백의 생성일시', this.fb.reg_dt)
  },
  data() {
    return {
      id: this.fb.reg_dt,
      FBContent: this.fb.content,
      updateClick: false,
    };
  },
  methods: {
    deleteFB() {
      this.$store.commit("lbhModule/DELETE_FB", this.fb.reg_dt); //store action에 추가
    },
    openUpdateFB(){
      this.updateClick = true
    },
    updateFB(){
      const data = {
        gb: this.fb.gb,
        content: this.FBContent,
        reg_dt: this.fb.reg_dt,
      }
      this.$store.commit('lbhModule/UPDATE_FB', data)
      this.updateClick = false 
    },
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
