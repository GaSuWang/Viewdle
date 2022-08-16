// 임현탁
<template>
<div class="ReplayViewBoss">
  <NavBar class="NavView"/>
  <div class="ReplayView">
    <div class='ReplayTop'>
      <div class="dropdown ReplayTopitem">
        <button class="btn replaytopitembutton dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
          정렬
        </button>
        <ul class="dropdown-menu">
          <li><input type="checkbox" @click="sortReplay(credentialsToFilterReplay)" v-model="credentialsToFilterReplay.order" true-value="ASC">오래된순</li>
          <li><input type="checkbox" @click="sortReplay(credentialsToFilterReplay)" v-model="credentialsToFilterReplay.order" true-value="DESC">최신순</li>
        </ul>
      </div>
    </div>
      <hr>
    <div class="ReplayBody">
      <ReplayCard/>
    </div>
    <!-- 오래된순, 최신순 정렬 -->
    <!-- 카드들 반응형에 따라 3*3 or 3*2 or 2*2 -->

    <!-- 영상 다시보기 -->
    <div class="modal fade" id="enterReplay" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-xl">
          <div class="modal-content">
            <div class="modalshow">

          <!-- 동영상 삽입 및 AI 평가 입력 -->
          <div style="position:relative;height:200px">
            <div style="position:absolute;">
              <video id="video" ref="video" crossOrigin='anonymous' width="640" height="480" controls="" autoplay="" name="media" >
                <!-- <source src="https://localhost:4443/openvidu/recordings/SessionA/SessionA.mp4" type="video/mp4"> -->
                <source :src="replayDetail.videoUrl" type="video/mp4">

                  <!-- <source src = "file://C:/Users/multicampus/Desktop/test.mp4"> -->
              </video>
            </div>
            <div id="selectAreaBox" ref="selectAreaBox" style="position:absolute;opacity:0" class="selectAreaBox" v-on:mousedown = "mousedown" v-on:mouseup = "mouseup" v-on:mousemove = "mousemove" ></div>        
            <div id="positionBox" ref="positionBox" :style="{ backgroundColor : positionColor }" style="position:absolute;opacity:1" class="positionBox" v-on:mousedown = "mousedown" v-on:mouseup = "mouseup" v-on:mousemove = "mousemove" >
              <div>
                {{ nowPosition }}
              </div >

            </div>        
            <div class="focus"></div>
          </div>
          <div>
            <!--  style="position:absolute"-->
            <!-- <canvas id="canvas" ref="canvas" ></canvas> -->
          </div>
          <div class="replayfeedback">
              <div :class="[item.feedbackType === 'G' ? 'replaygood' : 'replaybad']" class="replayFeedbackBox" v-for="item in replayDetail.feedbackList" :key="item.seq">
              {{item.feedbackContent}}
              <button :class="[item.feedbackType === 'G' ? 'replaygood' : 'replaybad']" @click="moveTo(item.timeline)">
                <i class="fa-solid fa-circle-play"></i>
              </button>
              </div>
            </div>
        <button class="btn btn-secondary replaymodalclose" data-bs-dismiss="modal">Close</button> 
          </div>
          </div>
        </div>

    </div> 
  </div>  
  </div>  
</template>

<script>
import NavBar from '@/components/Lobby/NavBar.vue'
import ReplayCard from '@/components/Lobby/ReplayCard.vue'
import { useStore, mapGetters } from 'vuex'
import { reactive, computed } from "vue";

// AI 코드
import * as tmPose from '@teachablemachine/pose';

export default {
  components:{
    NavBar,
    ReplayCard,
  },
  computed:{
    ...mapGetters('lbhModule', [
      "videoTime",
    ]),
    checkVideoTime(){
      return this.$store.getters['lbhModule/videoTime']
    },
  },
  watch:{
    checkVideoTime(time){
      console.log("실행됨")
      this.video = this.$refs.video
      console.log(this.video.currentTime)
      this.video.currentTime = time
      console.log(this.video.currentTime)
    }
  },
  setup(){
    const credentialsToFilterReplay= reactive({
      order:"",
    })
    const store = useStore()
    const replayDetail = computed(
      () => store.state.rhtModule.ReplayDetail
    );
    function sortReplay(){
      store.dispatch('rhtModule/sortReplay', credentialsToFilterReplay)
    }
    function moveTo(replaytimeline){
      store.commit('lbhModule/SET_VIDEO_TIME', replaytimeline)
    }
    return {
      replayDetail,sortReplay, credentialsToFilterReplay, moveTo
    }
  },

  // AI 자세평가 코드
  data () {
    return {
      context : null,
      model : null,
      maxPredictions : null,
      result : null,

      maxClassName : null,
      maxProbability : null,
      posenetOutput : null,
      prediction : null,

      video : null,
      canvas : null,

      x : 0,
      y : 0,
      a : 640,
      b : 480,

      focusWidth : null,
      focusHeight : null,

      temp : null,
      isClick : null,

      positionColor : '#89B2E8',
      nowPosition : " "
    }
  },

  async mounted() {

    this.video = this.$refs.video;
    this.canvas = this.$refs.canvas;

    this.context = this.$refs.canvas.getContext('2d');

  
    this.canvas.setAttribute("width", 1280);
    this.canvas.setAttribute("height", 960);

    const modelURL = `https://teachablemachine.withgoogle.com/models/Td01sX2R5/model.json`
    const metadataURL = `https://teachablemachine.withgoogle.com/models/Td01sX2R5/metadata.json`

    this.model = Object.freeze(await tmPose.load(modelURL, metadataURL));
    
    this.maxPredictions = this.model.getTotalClasses();    


    await this.predict();
  },

  methods : { 
      mousedown: function (event) {
      this.x = event.offsetX, 
      this.y = event.offsetY
    },

    mousemove: function(event) {
      if(this.isClick == "Y"){
        this.a = event.offsetX, 
        this.b = event.offsetY
      }
    },

    mouseup: function (event) {
      this.a = event.offsetX, 
      this.b = event.offsetY
      
      // 드래그 역방향 고려
      if(this.a < this.x){
        this.temp = this.a;
        this.a = this.x;
        this.x = this.temp;
      }
      this.isClick == "N"
    },
   async predict() {
      this.context.drawImage(this.video, this.x*2, this.y*2, this.a*2, this.b*2, 0, 0, 1280, 960);
      const {pose, posenetOutput}= await this.model.estimatePose(this.canvas);

      this.maxProbability = 0;
      pose;
      // console.log(posenetOutput)

      this.prediction = await this.model.predict(posenetOutput);

      for (let i = 0; i < this.maxPredictions; i++) {
        if (this.prediction[i].probability>this.maxProbability) {
          this.maxClassName = this.prediction[i].className;
          this.maxProbability = this.prediction[i].probability;
        }        
      }

      if(this.maxClassName === "middle"){
        this.positionColor = '#89B2E8'
        this.nowPosition = "Good!"
      } else {
        this.positionColor = 'ffcc74'
        this.nowPosition = "Bad!"

        // if(this.maxClassName === "close"){
        //   this.nowPosition = "너무 가까워요!"
        // } else if (this.maxClassName === "far"){
        //   this.nowPosition = "너무 멀어요!"
        // } else if (this.maxClassName === "left"){
        //   this.nowPosition = "오른쪽으로 기울었어요!"
        // } else if (this.maxClassName === "right"){
        //   this.nowPosition = "왼쪽으로 기울었어요!"
        // }
      }
                
      setTimeout(() => {
        this.predict();
      }, 100);         
    },
  }

}
</script>

<style>
.selectAreaBox{
    width: 640px;
    height: 400px;
    background-color: red;
}
.positionBox{
    /* width: 100px;
    height: 50px;
    background-color: #FEA713; */
    display: flex;
    flex-direction: row;
    justify-content: center;
    justify-self: center;
    align-items: center;
    width: 100px;
    height: 30px;
    padding: 3%;
    border-radius: 10px;
    margin-top: 5px;
    margin-bottom: 5px;
    margin-right: 5px;
    margin-left: 5px;
    overflow-wrap: break-word;
    background-color: white;
    box-shadow: 1px 1px 1px 1px gray;
}
.ReplayViewBoss{
  min-width: 1000px;
  width: 90%;
  height: 90%;
  background : rgb(255,255,255,0.5);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.NavView{
  height: 100%;
  width: 250px;
}
.ReplayView{

  height: 100%;
  width: 80%;
  overflow: scroll;
}
.ReplayView::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera*/
}
.ReplayTop{
  margin-top: 20px;
  margin-left: 20px;
  background: white;
  border-radius: 20px;
  width:95%;
  height: 80px;
  display: flex;
  flex-direction: row;
  justify-content: end;
  align-items: center;
}
.ReplayTopitem{
  margin:0 20px;
  margin-left: 20px;
}
.pagetitle{
  margin-top: 20px;
}
.ReplayBody{
  margin-left: 20px;
  display: flex;
  flex-direction: row;
  flex-flow: row wrap;
  justify-content: space-around;
  width: 95%;
  height: 80%;
  background: white;
  border-radius: 20px;
  padding: 20px;
  overflow-y: scroll;
}
.ReplayBody::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera*/
}
.modalshow{
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 20px;
  padding: 20px;
  height: 600px;
}
.replayfeedback{
  position: absolute;
  left: 680px;
  width: 450px;
  height: 510px;
  margin-right: 15px;
  overflow-y: scroll;
}
.replayfeedback::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera*/
}
.replayFeedbackBox{
  border-radius: 20px;
  width: 430px;
  height: 90px;
  margin-bottom: 30px; 
}
.replaymodalclose{
  position: absolute;
  left: 1000px;
  width: 100px;
  height: 45px;
  top: 540px
}
.replaygood{
  background-color: #89B2E8;
  border: 1px #0f70ed solid;
}
.replaybad{
  background-color: #ffcc74;
  border: 1px #fcab1f solid
}
.replaytopitembutton{
  background-color: rgb(230,198,132);
  color: white
}
 /* width="640" height="480" */
</style> 