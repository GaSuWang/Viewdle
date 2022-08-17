// 임현탁
<template>
  <div class="Lobbyboss">
  <NavBar class="NavView"/>
  <div class="MainView">
      <div class="MainTop">
        <div class="MainTop1">
          <!-- 서치바 -->
          <form @submit.prevent="searchStudyroom(credentialsTosearch)">
          <div class="Searchbar">
              <div class="input-group d-flex flex-row align-items-center">
                <input type="text" class="form-control rounded"  v-model="credentialsTosearch.keyword" placeholder="검색어를 입력해주세요" aria-label="Search" aria-describedby="search-addon" />
                <button class="btn mainsearchbutton">검색</button>
              </div>
          </div>
          </form>
          </div>
      <!-- 필터링 -->
        <div class="MainTop2">
          <div class="MainTop2item">
          <div class="dropdown">
            <button class="btn MainTop2itembutton dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
              필터
            </button>
            
            <ul class="dropdown-menu">
              <li><input type="checkbox" @click="filterStudyRoom(credentialsToFilter)" v-model="credentialsToFilter.privateYN" true-value="Y">공개방</li>
              <li><input type="checkbox" @click="filterStudyRoom(credentialsToFilter)" v-model="credentialsToFilter.privateYN" true-value="N">비공개방</li>
            </ul>
          </div>
          </div>
          <!-- 정렬 -->
          <div class="MainTop2item">
          <div class="dropdown">
            <button class="btn MainTop2itembutton dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
              정렬
            </button>
            <ul class="dropdown-menu">
              <li><input type="checkbox" @click="sortStudyRoom(credentialsToSort)" v-model="credentialsToSort.order" true-value="ASC">최신순</li> 
              <li><input type="checkbox" @click="sortStudyRoom(credentialsToSort)" v-model="credentialsToSort.order" true-value="DESC">오래된순</li>
            </ul>
          </div>
          </div>
          <!-- 방생성 -->
          <div class="MainTop2item">
          <button class="btn MainTop2itembutton"  data-bs-toggle="modal" data-bs-target="#roommaker">
            방생성
          </button>
          </div>
        </div>
      </div>
      <hr>
      <div class="MainBody">
          <MainCard/>
      </div>
    </div>
        <div class="modal fade" id="roommaker" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header">
                <!-- <h5 class="modal-title" id="staticBackdropLabel">방생성</h5> -->
              </div>
              <form @submit.prevent="createStudyroom(credentials)">
              <div class="modal-body d-flex flex-column justify-content-center align-items-center">
                <div class="d-flex justify-content-center align-items-center">
                <input type="Text" id = "titleBox" class="form-control form-control-lg" v-model="credentials.title" placeholder="스터디룸 이름" /> 
                <div>
                   <div class="select d-flex flex-column">
                      <input type="radio" id="select" name="mode" @click="selectMode(1)"><label for="select">플레이 모드</label>
                      <input type="radio" id="select2" name="mode" @click="selectMode(2)"><label for="select2">스터디 모드</label>
                  </div>
                  <!-- <p>Play Mode : 1  /  Study Mode : 2</p>
                  <input type="number" class="form-control form-control-lg" min='1' max='2' v-model.number="credentials.type"> -->
                </div>
                </div>
                                <div>
                  <div class="select">
                      <input type="radio" id="selectlimit2" name="limit" @click="selectLimit(2)"><label for="selectlimit2">2명</label>
                      <input type="radio" id="selectlimit3" name="limit" @click="selectLimit(3)"><label for="selectlimit3">3명</label>
                      <input type="radio" id="selectlimit4" name="limit" @click="selectLimit(4)"><label for="selectlimit4">4명</label>
                      <input type="radio" id="selectlimit5" name="limit" @click="selectLimit(5)"><label for="selectlimit5">5명</label>
                  </div>
                  <!-- <p>최소 : 2   /   최대 : 5</p>
                <input type="number" class="form-control form-control-lg" min='2' max='5' v-model.number="credentials.limit"> -->
                </div>
                <div class="d-flex align-items-center">
                  <span>비밀방</span>
                  <input type="checkbox" id="privateCheck" v-model="credentials.privateYN" true-value="Y" false-value="N"/>
                  <label for="privateCheck"></label>
                  <div v-if="credentials.privateYN == 'Y'"><input type="Text" class="form-control form-control-lg" v-model="credentials.password" placeholder="비밀번호" /></div>
                </div>

              </div> 
              <div class="modal-footer">
                <button class="clCancle" @click.prevent="cleanData" data-bs-dismiss="modal"><router-link to="/main">취소</router-link></button>
                <button class="clSubmit" @click="cleanData" data-bs-dismiss="modal">생성</button>
              </div>
              </form>
            </div>
          </div>
        </div> 
        
    <div class="modal fade" id="enterroom" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <form @submit.prevent="enterStudyroom(credentialsToenter)">
          <div class="modal-header">
            <h5 class="modal-title" id="staticBackdropLabel">방입장</h5>
          </div>
          <div class="modal-body enterPwInput">
              <input type="Text" v-model="credentialsToenter.roomPassword" class="form-control" placeholder="비밀번호" />
          </div> 
          <div class="modal-footer">
            <!-- <button class="btn btn-secondary" data-bs-dismiss="modal">입장</button> -->
              <button class="clCancle" data-bs-dismiss="modal"><router-link to="/main">취소</router-link></button>
              <button class="clSubmit" data-bs-dismiss="modal">입장</button>
          </div>
          </form>
          <!-- <button class="btn btn-secondary" data-bs-dismiss="modal">Close</button> -->
        </div>
      </div>
    </div> 
    </div>
      <!-- 검색 -->
      <!-- 최신순,오래된순 정렬 -->
      <!-- 풀방여부, 공개방여부 필터 -->
      <!-- 방생성 버튼 -->
      <!-- 카드들 반응형에 따라 3*3 or 3*2 or 2*2 -->
</template>

<script>
import NavBar from '@/components/Lobby/NavBar.vue'
import MainCard from '@/components/Lobby/MainCard.vue'
import { mapGetters, useStore } from 'vuex'
import { reactive } from "vue";
export default {
  components:{
    NavBar,
    MainCard
  },
///이병헌 시작
  computed:{
    ...mapGetters('lbhModule', [
      'roomSeq',
      'userType',
      'nextSuperUserInfo',
    ])
  },
  methods: {
    selectMode(mode){
      console.log(mode)
      this.credentials.type = mode
    },
    selectLimit(limit){
      console.log(limit)
      this.credentials.limit = limit
    },
    cleanData(){
      // this.credentials.type = '',
      // this.credentials.limit = '',
      // this.credentials.password = '',
      // this.credentials.privateYN = "N",
      // this.credentials.title = '',
      // this.credentials.commonSeq = '',
    },
  },
  created(){
    // if(this.roomSeq){
    //   if(this.userType === 'user'){
    //     console.log('일반 유저 방나가기 실행')
    //     this.$store.dispatch('lbhModule/userLeaveSessionAxios')
    //   } else {
    //     if(this.studyDestroy === true){
    //       console.log('방장 유저 방폭파 실행')
    //       this.$store.dispatch('lbhModule/studyDestroyFirstAxios')
    //       this.$store.dispatch('lbhModule/studyDestorySecondAxios')
    //       this.$store.commit('lbhModule/SET_STUDY_DESTOY', false)
    //     } else {
    //       console.log('방장 유저 방나가기 실행')
    //       this.$store.dispatch('lbhModule/superUserLeaveSessionAxios', this.nextSuperUserInfo.myUserEmail)
    //     }
    //   }
    
    // // this.$store.commit('lbhModule/GET_ROOM_INFO', {roomSeq: undefined, roomTitle: undefined, roomType: '1', isSuperUser:false})
    // // this.$store.commit('lbhModule/SET_OV', undefined)
    // // this.$store.commit('lbhModule/SET_SESSION', undefined)
    // // this.$store.commit('lbhModule/SET_SESSION_TOKEN', undefined)
    // // this.$store.commit('lbhModule/SET_PUBLISHER', undefined)
    // // this.$store.commit('lbhModule/SET_SUBSCRIBERS', [])
    // // // this.$store.commit('lbhModule/SET_MYSESSIONID', undefined)
    // // this.$store.commit('lbhModule/SELECT_CAMERA', {})
    // // this.$store.commit('lbhModule/SELECT_MIC', {})
    // // this.$store.commit('lbhModule/SELECT_CL', {})
    // // this.$store.commit('lbhModule/EMPTY_WR_PARTICIPANT_LIST')
    // // this.$store.commit('lbhModule/EMPTY_CURRENT_USER_LIST')
    // // this.$store.commit('lbhModule/SET_ISEE', false)
    // // this.$store.commit('lbhModule/SET_ISER', false)
    // // this.$store.commit('lbhModule/EMPTY_EE')
    // // this.$store.commit('lbhModule/EMPTY_ERS')
    // // this.$store.commit('lbhModule/EMPTY_FB')
    // // this.$store.commit('lbhModule/EMPTY_NEXT_SUPERUSER_INFO')
    // }
  },
///이병헌 끝
   setup() {
    const credentials = reactive({
      "type":'',
      "limit":'',
      "password":"",
      "privateYN":"N",
      "title":"",
      "commonSeq":''
    })
    const credentialsToenter = reactive({
      "roomPassword" : "",
    })
    const credentialsTosearch = reactive({
      keyword:""
    })
    const credentialsToFilter= reactive({
      privateYN: "",
    })
      const credentialsToSort= reactive({
      order: "",
    })
    const store = useStore()
    function createStudyroom(info){
      console.log(credentials.privateYN)
      if (info.type == 1 && info.privateYN == 'Y'){
        credentials.commonSeq = 10
      } 
      else if (info.type == 1 && info.privateYN == 'N'){
        credentials.commonSeq = 8
      }
      else if (info.type == 2 && info.privateYN == 'Y'){
        credentials.commonSeq = 11
      }
      else if (info.type == 2 && info.privateYN == 'N'){
        credentials.commonSeq = 9
      } 
      store.dispatch('rhtModule/createStudyroom', credentials)
    }
    function enterStudyroom(){
      store.dispatch('rhtModule/enterStudyroom', credentialsToenter)
    }
    function searchStudyroom(){
      store.dispatch('rhtModule/searchStudyroom', credentialsTosearch)
    }
    function filterStudyRoom(){
      store.dispatch('rhtModule/filterStudyRoom', credentialsToFilter)
    }
     function sortStudyRoom(){
      store.dispatch('rhtModule/sortStudyRoom', credentialsToSort)
    }
    return {
      credentials, createStudyroom, credentialsToenter, enterStudyroom, credentialsTosearch, searchStudyroom, credentialsToFilter,filterStudyRoom, credentialsToSort, sortStudyRoom
   }
}
}
</script>

<style>
a{
  text-decoration: none;
  color : white;
}
a:hover{
  text-decoration: none;
  color : white;
}
input[id="privateCheck"] + label {
  display: inline-block;
  width: 20px;
  height: 20px;
  border-radius: 10%;
  box-shadow: 0px 1.5px 4px #aaa, inset 0px 1px 1.5px #fff;
  cursor: pointer;
}
input[id="privateCheck"]:checked + label {
  background-color: #FEAA00;
  content: '✔';
  color: white;

}
input[id="privateCheck"] {
  display: none;
}

input[type=text] {
  background-color: #f6f6f6;
  border: none;
  color: #0d0d0d;
  padding: 10px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 5px;
  width: 85%;
  border: 2px solid #f6f6f6;
  -webkit-transition: all 0.5s ease-in-out;
  -moz-transition: all 0.5s ease-in-out;
  -ms-transition: all 0.5s ease-in-out;
  -o-transition: all 0.5s ease-in-out;
  transition: all 0.5s ease-in-out;
  -webkit-border-radius: 5px 5px 5px 5px;
  border-radius: 5px 5px 5px 5px;
}

input[type=password]:placeholder {
  color: #cccccc;
}
.select {
    padding: 15px 10px;
}
.select input[type=radio]{
    display: none;
}
.select input[type=radio]+label{
    display: inline-block;
    cursor: pointer;
    height: 24px;
    width: 105px;
    border-radius: 10%;
    box-shadow: 0px 1.5px 4px #aaa, inset 0px 1px 1.5px #fff;
    line-height: 24px;
    text-align: center;
    font-weight:bold;
    font-size:13px;
}
.select input[type=radio]+label{
    background-color: #fff;
    color: #333;
}
.select input[name=mode]:checked+label{
    background-color: #FEAA00;
    color: #fff;
}
.select input[name=limit]:checked+label{
    background-color: #47A0FF;
    color: #fff;
}

.Lobbyboss{
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
.MainView{
  top:50px;
  left: 300px;
  height: 100%;
  width: 80%;
  overflow: scroll;
}
.MainView::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera*/
}
.MainTop{
  margin-top: 20px;
  margin-left: 20px;
  background: white;
  border-radius: 20px;
  width:95%;
  height: 80px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
      box-shadow: 0px 1px 2px #aaa, inset 0px 2.5px 6px #fff;


}
.pagetitle{
  margin-top: 20px;
}
.MainTop1{
  display: flex;
  flex-direction: row;
}
.MainTop2{
  margin: 20px;
  display: flex;
  flex-direction: row;
}
.MainTop2item{
  margin: 0 20px;
}
.MainTop2itembutton{
  width: 6vw;
  height: 2.5vw;
  border: 0;
  outline: none;
  border-radius: 10px;
  background: #FEAA00;
  color: white;
  font-weight: bold;
  font-size: 1em;
  letter-spacing: 2px;
  box-shadow: 0px 1.5px 4px #aaa, inset 0px 1px 1.5px #fff;
}
.MainTop2itembutton:hover{
  background: #ffcc74;
}
.MainBody{
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
.MainBody::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera*/
}
.Searchbar{
  margin-left:30px;
}
.mainsearchbutton{
  width: 5vw;
  height: 3vw;
  border: 0;
  outline: none;
  border-radius: 10px;
  background: #47A0FF;
  color: white;
  font-weight: bold;
  font-size: 1em;
  letter-spacing: 2px;
  box-shadow: 0px 1.5px 4px #aaa, inset 0px 1px 1.5px #fff;
}
.mainsearchbutton:hover{
  background: #89B2E8;
}

.clCancle{
  /* margin-top: 20px; */
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
.clCancle:hover{
  background: #ffcc74;
}

.clSubmit{
  /* margin-top: 20px; */
  width: 6vw;
  height: 2.5vw;
  border: 0;
  outline: none;
  border-radius: 10px;
  background: #47A0FF;
  color: white;
  font-weight: bold;
  font-size: 1.2em;
  letter-spacing: 2px;
  box-shadow: 0px 1.5px 4px #aaa, inset 0px 1px 1.5px #fff;
}
.clSubmit:hover{
  background: #89B2E8;
}

.enterPwInput{
  display:flex;
  justify-content: center;
}

</style>