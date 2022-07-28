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
    <div
      class="FBInputBox"
      v-if="BtnClicked"
      :style="[
        BtnClicked === 'good' ? 'background: #47A0FF' : 'background:#FFE6B5',
      ]"
    >
      <input
        type="text"
        class="form-control"
        v-model="FBContent"
        @keypress.enter="saveFB"
      />
      <button class="FBInputBoxBtn" @click="closeFB">X</button>
    </div>
    <!-- 피드백 없을 때 보여줄 문구 -->
    <span v-if="FBList == []">아직 피드백이 존재하지 않습니다.</span>

    <!-- 피드백 굿/뱃 버튼 -->
    <div class="FBBtncontainer">
      <div class="FBGoodBtn">
        <button @click="createFB('good')">
          <i class="bi bi-hand-thumbs-up"></i>
        </button>
      </div>
      <div class="FBBadBtn">
        <button @click="createFB('bad')">
          <i class="bi bi-hand-thumbs-down"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import FeedbackBox from "@/components/StudyRoom/NormalMode/FeedbackBox.vue";
import { ref, computed } from "vue";
import { useStore } from "vuex";
export default {
  name: "FeedbackArea",
  components: { FeedbackBox },
  props: {
    videoInfo: Object,
  },
  setup() {
    // 영상에 피드백이 존재하는 지 알아야 함
    // 영상 정보를 넘겨줘 해당 영상에 피드백이 달려있는지 확인
    const store = useStore();
    const FBList = computed(() => store.getters["lbhModule/FBList"]);
    const BtnClicked = ref(""); //피드백 버튼이 클릭되지 않은 상태가 '', 굿 버튼 클릭되면 good, 뱃 버튼 클릭되면 bad
    const FBContent = ref(""); //새롭게 만들어진 피드백 박스와 연동됨

    // 피드백 입력란 생성
    const createFB = (gb) => {
      if (!BtnClicked.value) {
        //만약 굿/뱃 버튼 둘 다 눌리지 않은 상태에서 굿/뱃 버튼이 눌린다면
        if (gb === "good") {
          BtnClicked.value = "good";
        } else {
          BtnClicked.value = "bad";
        }
      } else {
        //만약 굿/뱃 버튼 둘 중 하나가 눌린 상태에서 또 다시 굿/뱃 버튼이 눌린다면
        if (gb === "good") {
          BtnClicked.value = "good";
        } else {
          BtnClicked.value = "bad";
        }
      }
    };

    // 피드백 저장
    const saveFB = () => {
      // store.dispatch("saveFB",  FBContent.value) // 원래 로직은 이거
      FBList.value.push({
        // 임시로 만든 로직, fbList가 어떤 자료를 리턴할 지 모르겄네
        gb: BtnClicked.value,
        content: FBContent.value,
        reg_dt: Date.now(),
      });
      console.log(BtnClicked.value, FBContent.value, Date.now());
      FBContent.value = "";
      BtnClicked.value = "";
    };

    // 피드백 입력란 닫기
    const closeFB = () => {
      FBContent.value = "";
      BtnClicked.value = "";
    };

    return {
      BtnClicked,
      FBContent,
      FBList,
      createFB,
      saveFB,
      closeFB,
    };
  },
};
</script>

<style scoped>
.FeedbackArea {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 80%;
  width: 100%;
  max-height: 80%;
  padding: 0;
  margin: 0;
  border-radius: 20px;
  background: rgb(183, 183, 183);

}

.FeedbackArea > ul {
  padding: 0;
}

.FBList {
  width: 100%;
  max-height: 80%;
  overflow-y: scroll;
  padding-bottom: 20px;
  scrollbar-color: #d4aa70 #e4e4e4;
  scrollbar-width: thin;
}

.FBList::-webkit-scrollbar {
  width: 10px;
}

.FBList::-webkit-scrollbar-thumb {
  border-radius: 100px;
  background-image: linear-gradient(180deg, #f7f7f7 0%, #e7e7e7 99%);
  box-shadow: inset 2px 2px 5px 0 rgba(#fff, 0.5);
}
.FBList::-webkit-scrollbar-track {
  background-color: #e4e4e4;
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
.form-control {
  background: none;
  width: 85%;
  border: none;
}

.form-control:focus {
  box-shadow: none;
}

.FBInputBoxBtn {
  background: none;
  border: none;
}

/* 버튼 양식 */
.FBGoodBtn > button,
.FBBadBtn > button {
  border: none;
  display: block;
  background: linear-gradient(#f7f7f7, #e7e7e7);
  color: #a7a7a7;
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

.FBBtncontainer {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  background: none;
}
</style>
