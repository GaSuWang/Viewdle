// 임현탁
<template>
  <div class="Lobbyboss">
  <NavBar class="NavView"/>
  <div class="MainView">
      <p class="pagetitle">Main</p>
      <div class="MainTop">
        <div class="MainTop1">
          <!-- 서치바 -->
          <div class="Searchbar">
            <div class="input-group">
              <input type="search" class="form-control rounded" placeholder="Search" aria-label="Search" aria-describedby="search-addon" />
              <button type="button" class="btn btn-outline-primary">search</button>
            </div>
          </div>
        </div>
      <!-- 필터링 -->
        <div class="MainTop2">
          <div class="MainTop2item">
          <div class="dropdown">
            <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
              필터
            </button>
            <ul class="dropdown-menu">
              <li>풀방여부</li>
              <li>공개방여부</li>
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
              <li>최신순</li> 
              <li>오래된순</li>
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
                <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" data-bs-target="#modecheck" aria-expanded="false">
                  모드 선택
                </button>
                <ul class="dropdown-menu" id="modecheck">
                  <li><input type="checkbox" v-model.number="credentials.type" true-value=1>StudyMode</li>
                  <li><input type="checkbox" v-model.number="credentials.type" true-value=2>Play Mode</li>
                </ul>
                </div>
                <div>
                <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" data-bs-target="#modecheck" aria-expanded="false">
                  최대인원 선택
                </button>
                <ul class="dropdown-menu" id="modecheck">
                  <li><input type="checkbox" v-model.number="credentials.limit" true-value="5"/>5</li>
                  <li><input type="checkbox" v-model.number="credentials.limit" true-value="4"/>4</li>
                  <li><input type="checkbox" v-model.number="credentials.limit" true-value="3"/>3</li>
                  <li><input type="checkbox" v-model.number="credentials.limit" true-value="2"/>2</li>
                </ul>
                </div>
                비밀방생성<input type="checkbox" v-model="credentials.privateYN" true-value="Y" false-value="N"/>
                <input type="Text" class="form-control form-control-lg" v-model="credentials.password" placeholder="Password" /> 
              </div> 
              <div class="modal-footer">
                <button class="btn btn-secondary">생성</button>
                <button class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              </div>
              </form>
            </div>
          </div>
        </div> 
    <div class="modal fade" id="enterroom" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <form @submit.prevent="">
          <div class="modal-header">
            <h5 class="modal-title" id="staticBackdropLabel">방입장</h5>
          </div>
          <div class="modal-body">
            <input type="Text" class="form-control form-control-lg" placeholder="Password" /> 
          </div> 
          <div class="modal-footer">
            <button class="btn btn-secondary">입장</button>
            <button class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>
          </form>
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
   setup() {
    const credentials = reactive({
      "type":0,
      "limit":0,
      "password":"",
      "privateYN":"",
      "title":"",
      "commonSeq":2
    })
    const store = useStore()
    function createStudyroom(){
      store.dispatch('rhtModule/createStudyroom', credentials)
    }
    return {
    credentials, createStudyroom
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