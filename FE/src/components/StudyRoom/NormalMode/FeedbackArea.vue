// 이병헌
<template>
  <div class="FeedbackArea">
    <!-- 피드백 리스트 -->
    <ul class="FBList">
      <!-- 피드백 입력란 -->
      <!-- 피드백 목록 -->
      <li v-for="fb in FBList" :key="fb.reg_dt">
        <feedback-box :fb="fb"></feedback-box>
      </li>
    </ul>
    <!-- 피드백 없을 때 보여줄 문구 -->
    <span v-if="FBList === []">아직 피드백이 존재하지 않습니다.</span>

    <!-- 피드백 굿/뱃 버튼 -->
    <div class="FBBtncontainer inputOn" v-if="FBInputType">
      <textarea
        type="text"
        class="form-control"
        v-model="FBContent"
        @keypress.enter="saveFB"
        placeholder="피드백을 등록하려면 엔터를 누르세요."/>
      <div class="FBGoodBtn" v-if="FBInputType==='good'">
        <button @click="createFB('good')">
          <i class="bi bi-hand-thumbs-up-fill"></i>
        </button>
      </div>
      <div class="FBBadBtn" v-else-if="FBInputType==='bad'">
        <button @click="createFB('bad')">
          <i class="bi bi-hand-thumbs-down-fill"></i>
        </button>
      </div>
    </div>

    <div class="FBBtncontainer inputOff" v-else>
      <div class="FBGoodBtn">
        <button @click="createFB('good')">
          <i class="bi bi-hand-thumbs-up-fill"></i>
        </button>
      </div>
      <div class="FBBadBtn">
        <button @click="createFB('bad')">
          <i class="bi bi-hand-thumbs-down-fill"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>




import FeedbackBox from "@/components/StudyRoom/NormalMode/FeedbackBox.vue";
// import { ref, computed } from "vue";
import { mapGetters } from "vuex";
export default {
  name: "FeedbackArea",
  components: { FeedbackBox },
  props: {
    videoInfo: Object,
  },
  data(){
    return{
      FBInputType: undefined,
      FBContent: "",
    }
  },
  computed:{
    ...mapGetters('lbhModule',[
      'FBList',
    ])
  },
  methods:{
    createFB(gb){
      if (!this.FBInputType) {
        //만약 굿/뱃 버튼 둘 다 눌리지 않은 상태에서 굿/뱃 버튼이 눌린다면
        if (gb === "good") {
          this.FBInputType = "good";
        } else {
          this.FBInputType = "bad";
        }
      } else {
        //만약 굿/뱃 버튼 둘 중 하나가 눌린 상태에서 또 다시 굿/뱃 버튼이 눌린다면
        if (gb === "good") {
          this.FBInputType= "good";
        } else {
          this.FBInputType = "bad";
        }
      }
    },
    saveFB(){
      const data = {
        gb: this.FBInputType,
        content: this.FBContent,
        reg_dt: Date.now(),
      }
      this.$store.commit('lbhModule/ADD_FB', data)
      this.FBContent = "";
      this.FBInputType= undefined;
    },
    closeFBInput(){
      this.FBContent = "";
      this.FBInputType= undefined;
    },

  },
};
</script>

<style scoped>
.FeedbackArea {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  height: 80%;
  width: 100%;
  max-height: 80%;
  padding: 0;
  margin: 0;
  border-radius: 20px;

}

.FBList {
  width: 100%;
  height: 80%;
  padding-right: 0;
  max-height: 80%;
  overflow-y: scroll;
  scrollbar-color: #d4aa70 #e4e4e4;
  scrollbar-width: thin;
}

.FBList::-webkit-scrollbar {
  width: 10px;
}

.FBList::-webkit-scrollbar-thumb {
  border-radius: 100px;
  background-image: #cdd2dc;
  box-shadow: inset 2px 2px 5px 0 rgba(#fff, 0.5);
}
.FBList::-webkit-scrollbar-track {
  background-color: none;
  border-radius: 100px;
}

.FBInputBox {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 97%;
  height: 20%;
  padding: 5%;
  border-radius: 30px;
  margin-top: 2%;
  margin-bottom: 2%;
  overflow-wrap: break-word;
  word-wrap: break-all;
  hyphens: auto;
}

.good{
  /* background: #47A0FF */
  background: linear-gradient(#e1f3f2, #f0f9f9)

}

.bad{
  /* background:#FFE6B5 */
  background: linear-gradient(#fee7e7, #fff3f3)
}

.FBBtncontainer{
  width: 90%;
  height: 20%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}

.form-control {
  background: none;
  width: 80%;
  height: 100%;
  border: none;
  overflow-y: scroll;
}

.form-control:focus {
  box-shadow: none;
}

.FBInputBoxBtn {
  background: none;
  border: none;
}

/* 버튼 양식 */
.FBGoodBtn > button{
  border: none;
  display: block;
  background-color: #89B2E8;
  color: #fff;
  margin: 18px;
  width: 36px;
  height: 36px;
  position: relative;
  text-align: center;
  line-height: 36px;
  border-radius: 50%;
  box-shadow: 0px 1.5px 4px #aaa, inset 0px 1px 1.5px #fff;
}
.FBBadBtn > button{
  border: none;
  display: block;
  background-color: #ffcc74;
  color: #fff;
  margin: 18px;
  width: 36px;
  height: 36px;
  position: relative;
  text-align: center;
  line-height: 36px;
  border-radius: 50%;
  box-shadow: 0px 1.5px 4px #aaa, inset 0px 1px 1.5px #fff;
}

.FBGoodBtn > button:before,
.FBBadBtn > button:before {
  content: "";
  display: block;
  border-top: 1px solid #ddd;
  border-bottom: 1px solid #fff;
  width: 100%;
  height: 1px;
  position: absolute;
  top: 50%;
  z-index: -1;
}

.FBGoodBtn > button:after,
.FBBadBtn > button:after {
  content: "";
  display: block;
  background: rgb(255, 255, 255);
  border-top: 2px solid #ddd;
  position: absolute;
  top: -9px;
  left: -9px;
  bottom: -9px;
  right: -9px;
  z-index: -1;
  border-radius: 50%;
  box-shadow: inset 0px 4px 24px #ddd;
}

.FBGoodBtn > button:hover,
.FBBadBtn > button:hover {
  text-decoration: none;
  color: #555;
  background: #f5f5f5;
}

/* 버튼 양식 */

.FBList > li {
  list-style: none;
  padding-left: 0;
}

.inputOff {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-self: center;
  /* width: 80%; */
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0px 4px 4px 3px #d8dae3; 
}

.inputOn{
  display: flex;
  flex-direction: row;
  /* justify-content: space-evenly; */
  align-self: center;
  /* width: 80%; */
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0px 4px 4px 3px #d8dae3; 
}
</style>
