// 임현탁
<template>
  <div class="Lobbyboss">
  <NavBar class="NavView"/>
  <div class="MainView">
      <p class="pagetitle">Main</p>
      <div class="MainTop">
        <div class="MainTop1">
          <!-- 서치바 -->
          <form @submit.prevent="searchStudyroom(credentialsTosearch)">
          <div class="Searchbar">
              <div class="input-group">
                <input type="text" class="form-control rounded"  v-model="credentialsTosearch.keyword" placeholder="Search" aria-label="Search" aria-describedby="search-addon" />
                <button class="btn btn-outline-primary">search</button>
              </div>
          </div>
          </form>
          </div>
      <!-- 필터링 -->
        <div class="MainTop2">
          <div class="MainTop2item">
          <div class="dropdown">
            <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
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
            <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
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
          <button class="btn btn-secondary"  data-bs-toggle="modal" data-bs-target="#roommaker">
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
                <h5 class="modal-title" id="staticBackdropLabel">방생성</h5>
              </div>
              <form @submit.prevent="createStudyroom(credentials)">
              <div class="modal-body">
                <input type="Text" class="form-control form-control-lg" v-model="credentials.title" placeholder="Title" /> 
                <div>
                  <p>Play Mode : 1  /  Study Mode : 2</p>
                  <input type="number" class="form-control form-control-lg" min='1' max='2' v-model.number="credentials.type">
                </div>
                <div>
                  <p>최소 : 2   /   최대 : 5</p>
                <input type="number" class="form-control form-control-lg" min='2' max='5' v-model.number="credentials.limit">
                </div>
                비밀방생성<input type="checkbox" v-model="credentials.privateYN" true-value="Y" false-value="N"/>
                <div v-if="credentials.privateYN == 'Y'"><input type="Text" class="form-control form-control-lg" v-model="credentials.password" placeholder="Password" /></div>
              </div> 
              <div class="modal-footer">
                <button class="btn btn-secondary" data-bs-dismiss="modal">생성</button>
              </div>
              </form>
              <button class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
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
          <div class="modal-body">
            <input type="Text" v-model="credentialsToenter.roomPassword" class="form-control form-control-lg" placeholder="Password" />
          </div> 
          <div class="modal-footer">
            <button class="btn btn-secondary" data-bs-dismiss="modal">입장</button>
          </div>
          </form>
          <button class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
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
import { useStore } from 'vuex'
import { reactive } from "vue";
export default {
  components:{
    NavBar,
    MainCard
  },
///이병헌 시작
  created(){
    this.$store.commit('lbhModule/GET_ROOM_INFO', {roomSeq: undefined, roomTitle: undefined, roomType: 'study', userType:'user'})
    this.$store.commit('lbhModule/SET_OV', undefined)
    this.$store.commit('lbhModule/SET_SESSION', undefined)
    this.$store.commit('lbhModule/SET_SESSION_TOKEN', undefined)
    this.$store.commit('lbhModule/SET_PUBLISHER', undefined)
    this.$store.commit('lbhModule/SET_SUBSCRIBERS', [])
    // this.$store.commit('lbhModule/SET_MYSESSIONID', undefined)
    this.$store.commit('lbhModule/SELECT_CAMERA', {})
    this.$store.commit('lbhModule/SELECT_MIC', {})
    this.$store.commit('lbhModule/SELECT_CL', {})
    this.$store.commit('lbhModule/EMPTY_WR_PARTICIPANT_LIST')
    this.$store.commit('lbhModule/EMPTY_CURRENT_USER_LIST')
    this.$store.commit('lbhModule/SET_ISEE', false)
    this.$store.commit('lbhModule/SET_ISER', false)
    this.$store.commit('lbhModule/SET_EE', [])
    this.$store.commit('lbhModule/SET_ERS', [])
    this.$store.commit('lbhModule/EMPTY_FB')
  },
///이병헌 끝
   setup() {
    const credentials = reactive({
      "type":'',
      "limit":'',
      "password":"",
      "privateYN":"",
      "title":"",
      "commonSeq":2
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
    function createStudyroom(){
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
.Lobbyboss{
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
}
.MainTop{
  background: white;
  border-radius: 20px;
  width:98%;
  width: 98%;
  height: 80px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

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
.MainBody{
  display: flex;
  flex-direction: row;
  flex-flow: row wrap;
  justify-content: space-around;
  width: 98%;
  height: 80%;
  background: white;
  border-radius: 20px;
  padding: 20px;
  overflow: scroll;
}
.Searchbar{
  margin-left:30px;
}

</style>