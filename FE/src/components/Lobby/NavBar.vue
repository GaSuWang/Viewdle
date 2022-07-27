//임현탁
<template>
    <nav id="page-wrapper">
        <!-- 사이드바 -->
        <div id="sidebar-wrapper">
            <ul class="sidebar-nav">
                 <!-- 미니프로필 -->
                <li class="sidebar-brand">V:DLE V:DLE</li>
                <li><img src="@/assets/images/anyimgs.png"></li>
                <li><form @submit.prevent="logout()"><button class="btn btn-primary btn-lg">로그아웃</button></form></li>
                <!-- 메인페이지 -->
                <li><a href="http://localhost:8080/main">메인</a></li>
                <!-- 마이페이지 -->
                <li><a href="http://localhost:8080/mypage">마이페이지</a></li>
                <!-- 영상다시보기 -->
                <li><a href="http://localhost:8080/replay">영상 다시보기</a></li>
                <!-- 자소서관리 -->
                <li><a href="http://localhost:8080/cl">자소서 관리</a></li>
            </ul>
        </div>
    </nav>
</template>

<script>
import { useStore } from 'vuex'

export default {
  name: 'NavBar',
  setup () {

    const store = useStore()
    function logout(){
      store.dispatch('rhtModule/logout')
    }
    return {
      logout
    }
  }
}
</script>

<style>
  #miniprofile {
    float: left;

  }
  #page-wrapper {
    padding-left: 250px;
  }
  
  #sidebar-wrapper {
    position: absolute;
    width: 350px;
    height: 100%;
    margin-left: -250px;
    background: #000;
    overflow-x: hidden;
    overflow-y: auto;
  }
  
  /* 사이드바 스타일 */
  
  .sidebar-nav {
    width: 350px;
    margin: 0;
    padding: 0;
    list-style: none;
  }
  
  .sidebar-nav li {
    line-height: 10em;
  }
  
  .sidebar-nav li a {
    display: block;
    text-decoration: none;
    color: #999;
  }
  
  .sidebar-nav li a:hover {
    color: #fff;
    background: rgba(255, 255, 255, 0.2);
  }
  
  .sidebar-nav > .sidebar-brand {
    font-size: 2em;
    line-height: 3em;
  }

</style>