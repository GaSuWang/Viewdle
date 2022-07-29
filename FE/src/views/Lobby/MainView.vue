// 임현탁
<template>
  <div class="Lobbyboss">
  <NavBar/>
  <div class="MainView">
      <p>Main</p>
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
        <button class="btn btn-secondary">
          방생성
        </button>
        </div>
      </div>
    </div>
    <hr>
    <div class="MainBody">
        <MainCard/>
        <MainCard/>
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
export default {
  components:{
    NavBar,
    MainCard
  }
}
</script>

<style>
.Lobbyboss{
  height: 100%;
}
.MainView{
  position:fixed;
  top:50px;
  left: 300px;
  height: 100%;
  width: 80%;
  overflow:scroll;
}
.MainTop{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
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
  width: 98%;
  height: 85%;
  background: white;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

</style>