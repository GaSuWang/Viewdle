// 임현탁dow
<template>
<div class="ReplayViewBoss">
  <NavBar class="NavView"/>
  <div class="ReplayView">
    <div class='ReplayTop'>
      <div class="dropdown ReplayTopitem">
        <button class="replaytopitembutton dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
          정렬
        </button>
        <ul class="dropdown-menu" style="padding-left:15px">
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
              <video id="video" ref="video" crossOrigin='anonymous' width="640" height="480" controls="" name="media" >
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
            <!--  -->
            <canvas id="canvas" ref="canvas" style="position:absolute; display: none;" ></canvas>
          </div>
          <div class="replayfeedback">
              <div :class="[item.feedbackType === 'G' ? 'replaygood' : 'replaybad']" class="replayFeedbackBox" v-for="item in replayDetail.feedbackList" :key="item.seq">
                <p class="mx-3">{{item.feedbackContent}}</p> 
                  <button :class="[item.feedbackType === 'G' ? 'replaygoodbutton' : 'replaybadbutton']"  @click="moveTo(item.timeline)">
                    <div class="d-flex align-items-center">
                      <i class="fa-solid fa-2x fa-circle-play mx-3 mt-1 p-0"></i>
                    </div>
                  </button>
              </div>
            </div>
        <div class="replaydis d-flex justify-content-center align-items-center"><p class="mb-0 pb-0">드래그로 자세를 확인해 보세요!</p></div>
        <button class="replaymodalclose" data-bs-dismiss="modal" @click.prevent="endPredict">닫기</button> 
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
      nowPosition : " ",

      timeout: null
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
    endPredict: function(){
      console.log("끝")
      clearTimeout(this.timeout)
    },
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
      this.context.drawImage(this.video, this.x*2, this.y*2, this.a*2-this.x*2, this.b*2-this.y*2, 0, 0, 1280, 960);
      const {pose, posenetOutput}= await this.model.estimatePose(this.canvas);

      var temp = 0;
      var tempname = " ";
      pose;
      // console.log(posenetOutput)

      this.prediction = await this.model.predict(posenetOutput);

      for (let i = 0; i < this.maxPredictions; i++) {
        if (this.prediction[i].probability>temp) {
          tempname = this.prediction[i].className;
          temp = this.prediction[i].probability;
        }        
      }
      console.log(tempname)
      console.log(temp)
      this.maxClassName = tempname

      if(this.maxClassName === "middle"){
        this.positionColor = '#47A0FF'
        this.nowPosition = "Good!"
      } else {
        this.positionColor = '#FEAA00'
        this.nowPosition = "Bad!"

        if(this.maxClassName === "close"){
          this.nowPosition = "Close!"
        } else if (this.maxClassName === "far"){
          this.nowPosition = "Far!"
        } else if (this.maxClassName === "left"){
          this.nowPosition = "Left!"
        } else if (this.maxClassName === "right"){
          this.nowPosition = "Right!"
        }
      }
                
      this.timeout = setTimeout(() => {
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
    height: 20px;
    padding: 3%;
    border-radius: 10px;
    margin-top: 5px;
    margin-bottom: 5px;
    margin-right: 5px;
    margin-left: 5px;
    overflow-wrap: break-word;
    background-color: white;
    box-shadow:  0px 1.5px 4px #aaa, inset 0px 1.5px 2px #fff;
    font-family: 'yg-jalnan';
    color: white;
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
  height: 480px;
  margin-right: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: scroll;
  background-color:#e4e6eb;
  border-radius: 10px;

}
.replayfeedback::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera*/
}
.replayFeedbackBox{
  border-radius: 10px;
  width: 430px;
  height: 90px;
  margin-bottom: 15px;
  margin-top: 15px; 
  text-align: center;
  line-height: 90px;
  display: flex;
  justify-content: space-between;
    box-shadow: 0px 1px 2px #aaa, inset 0px 1px 1.5px #fff;

}
.replaydis{
  position: absolute;
  left: 470px;
  width: 500px;
  height: 45px;
  top: 525px;
  border-radius: 10px;
  background: white;
  color: black;
  font-weight: bold;
  box-shadow: 0px 1.5px 4px #aaa, inset 0px 1px 1.5px #fff;
}
.replaymodalclose{
  position: absolute;
  left: 1000px;
  width: 100px;
  height: 45px;
  top: 525px;
  border-radius: 10px;
  background: #FEAA00;
  color: white;
  font-weight: bold;
  box-shadow: 0px 1.5px 4px #aaa, inset 0px 1px 1.5px #fff;
}
.replaymodalclose:hover{
    background: #ffcc74;
}

.replaygood{
  border: #89B2E8;
  background-color: white;
}
.replaybad{
  border: #ffcc74;
  background-color: white;
}
.replaytopitembutton{
width: 6vw;
  height: 2.5vw;
  border: 0;
  outline: none;
  border-radius: 10px;
  background: #FEAA00;
  color: white;
  font-weight: bold;
  font-size: 1.2em;
  letter-spacing: 2px;
  box-shadow: 0px 1.5px 4px #aaa, inset 0px 1px 1.5px #fff;
}
.replaytopitembutton:hover{
  background: #ffcc74;
}
.replaybadbutton{
  margin : 0;
  padding: 0; 
  /* height: 20px; */
  color:#ffcc74;
  background: white;
  border-radius: 30px;

}
.replaygoodbutton{
  margin : 0;
  padding: 0; 
  /* height: 20px; */
  color:#89B2E8;
  background: white;
  border-radius: 30px;
}
.FBBoxBtn {
  top:50px;
  width: 10%;
  border-radius: 5px;
}
 /* width="640" height="480" */
</style> 