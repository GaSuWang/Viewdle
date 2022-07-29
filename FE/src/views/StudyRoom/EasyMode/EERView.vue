// 이병헌
<template>
  <div class="EERView">
    <!-- 영상 구역 -->
    <div class="EERContent">
      <!-- 면접자 영상 구역  -->
      <div class="EEVid"></div>
      <!-- 면접관 영상 구역 -->
      <div class="ERVidContainer">
        <div class="ERVid"></div>
        <div class="ERVid"></div>
        <div class="ERVid"></div>
        <div class="ERVid"></div>
      </div>
    </div>
    <!-- BtnContainer -->
    <div class="EERBtnContainer top">
      <div class="EERtoLB">
        <button >
          <i class="bi bi-x-lg"></i>
        </button>
      </div>
    </div>

    <div class="EERBtnContainer bottom">
      <div class="CLViewBtn">
        <button @click="openCL" >
          <i class="bi bi-file-earmark-text"></i>
        </button>
      </div>  
      <div class="VoiceChangeBtn">
        <button >
          <i class="bi bi-mic-fill"></i>
        </button>
      </div>
      <div class="StudyEnd">
        <button >
          <i class="bi bi-check-lg"></i>
        </button>
      </div>
      <div class="SuddenAttackBtn">
        <button >
          <i class="bi bi-exclamation-triangle-fill"></i>
        </button>
      </div>
      <div class="CaptureBtn">
        <button >
          <i class="bi bi-camera"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "EERView",
  components: {},
  methods: {
    openCL() {
      let route = this.$router.resolve({ path: "/eecl" });
      window.open(route.href);
    },
    changeVoice() {},
    suddenAttack() {},
    capture() {},
  },
};
</script>

<style scoped>
.EERView {
  position: absolute;
  width: 90vw;
  aspect-ratio: 16/9;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  box-shadow: 10px 10px 20px 6px #b5b8c0;
  border-radius: 60px;
  padding: 3%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.EERContent {
  width: 100%;
  height: 100%;
  opacity: 50%;
  border-radius: 10px;
  display: flex;
  flex-direction: row;
}

.EEVid {
  width: 80%;
  height: 100%;
  background-color: #edf0f6;
  border-radius: 5%;
  border: 1px solid rgb(161, 161, 161);
}

.ERVidContainer {
  width: 20%;
  height: 100%;
}

.ERVid {
  width: 100%;
  height: 25%;
  background-color: #edf0f6;
  border: 1px solid rgb(161, 161, 161);
  border-radius: 10%;
}

.EERBtnContainer {
  z-index: 1;
  width: 67vw;
  opacity: 30%;
  border-radius: 10px;
  display: flex;
  flex-direction: row;
}

.top{
  position: absolute;
  top: 8%; 
  align-self: flex-end;
  left: 66%;
}

.bottom{
  position: absolute;
  bottom: 10%;
  justify-content: space-evenly;
  align-items: center;
  align-self: flex-start;
}

.EERBtnContainer.top > button {
  border: none;
  background-color: rgb(209, 209, 209);
  border-radius: 50%;
  width: 3%;
  height: 3%;
  /* filter: blur(3px); */
}

.EERBtnContainer.top > div > button > i {
  font-size: 100%;
  color: black;
}
.EERBtnContainer >div> button {
  border: none;
  background-color: rgb(209, 209, 209);
  border-radius: 50%;
}

.EERBtnContainer >div> button {
  padding:15px;
}

.EERBtnContainer >div> button > i {
  font-size: 150%;
  color: black;
}
</style>
