// 이병헌
// 면접실과 피드백실에서 면접관이 면접자의 자소서를 보기 위해 새롭게 여는 페이지 (CoverLetter View => CLView)
<template>
  <div class="CLView">
    <!-- 상단 -->
    <h1>{{coverLetterTitle}}</h1>

    <!-- 면접자 자소서 내용 -->
    <div class="CLContent">
      <p>{{coverLetterContent}}</p>
    </div>

    <!-- 탭 닫기 버튼 -->
    <div class="CLButtonFooter">
      <button class="CLCloseBtn" @click="CloseTab">
        <i class="bi bi-x-lg"></i>
      </button>
    </div>

  </div>  
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'CLView',
  computed:{
    ...mapGetters('lbhModule',[
      'studyRoomCL',
      'session',
      'sessionToken',
    ]),

  },
  data(){
    return{
      coverLetterTitle: '',
      coverLetterContent: '',
    }
  },
  created(){
    console.log('자소서는 이거다', this.studyRoomCL)
    let cl = {}
    try {
      cl = JSON.parse(localStorage['cl'])
      this.coverLetterTitle = cl.coverLetterTitle
      this.coverLetterContent = cl.coverLetterContent
} catch (error) {
    }
  },
  setup(){
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

<style scoped>
.CLView{
  position: absolute;
  width: 45vw;
  aspect-ratio: 1/1;
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

.ClContent{
  height: 80%;
  
}

.CLButtonFooter{
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}
/* 버튼 시작 */
.CLCloseBtn{
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
.CLCloseBtn:before{
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
.CLCloseBtn:after{
  content: "";
  display: block;
  background: #fff;
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
.CLCloseBtn:hover{
  text-decoration: none;
  color: #555;
  background: #f5f5f5;
}

/* 버튼 끝 */
</style>
