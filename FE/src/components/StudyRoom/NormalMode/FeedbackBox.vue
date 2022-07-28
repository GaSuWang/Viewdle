// 이병헌
<template>
  <div :class="[fb.gb === 'good' ? 'FeedbackBox good' : 'FeedbackBox bad']">
    {{ fb.content }}
    <button class="FBBoxBtn" @click="deleteFB">X</button>
  </div>
</template>

<script>
export default {
  name: "FeedbackBox",
  props: {
    fb: Object,
  },
  data() {
    return {
      id: this.fb.reg_dt,
    };
  },
  methods: {
    deleteFB(id) {
      this.$store.dispatch("lbhModule/deleteFB", id); //store action에 추가
    },
  },
  setup() {
    return {};
  },
};
</script>

<style scoped>
.FeedbackBox {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 20%;
  padding: 5%;
  border-radius: 30px;
  margin-top: 2%;
  margin-bottom: 2%;
  overflow-wrap: break-word;
  word-wrap: break-all;
  hyphens: auto;
}

.good {
  /* background-color: #47a0ff; */
  background: linear-gradient(#47a0ff, #7ebdff)
}

.bad {
  /* background-color: #ffe6b5; */
  background: linear-gradient(#ffe6b5, #ffefd0)

}

.FBBoxBtn {
  background: none;
  border: none;
}
</style>
