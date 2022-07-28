// 임현탁
<template>
  <div class="MainView">
    <div id="MainTop">
      <p>
        Main
      </p>
      <div>
      <div class="Searchbar">
        <div class="input-group">
          <input type="search" class="form-control rounded" placeholder="Search" aria-label="Search" aria-describedby="search-addon" />
          <button type="button" class="btn btn-outline-primary">search</button>
        </div>
      </div>
      <div class="dropdown">
        <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
          필터
        </button>
        <ul class="dropdown-menu">
          <li>풀방여부</li>
          <li>공개방여부</li>
        </ul>
      </div>
      <div class="dropdown">
        <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
          정렬
        </button>
        <ul class="dropdown-menu">
          <li>최신순</li> 
          <li>오래된순</li>
        </ul>
      </div>
      <div class="dropdown">
      <button class="btn btn-secondary dropdown-toggle">
        방생성
      </button>
      </div>
      </div>
    </div>
    <div  id="MainBody">
      <div class="">
        <MainCard/>
      </div>
    </div>
      <NavBar/>
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
#MainView{

}
#MainTop{
  position: fixed;
  left: 400px;
  top: 50px;
}
#MainBody{
  position: fixed;
  left: 400px;
  top: 250px;
}
</style>