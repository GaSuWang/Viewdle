//임현탁
<template>
<div class="sidebarall">
    <div class="sidebar">
    <!-- <header>V:Dle</header> -->
    <div style="display: flex; align-items: center; flex-direction: column;">
      <div class="d-flex" style="margin-top:40px"><div class="frontVeiwdle">뷰들</div><div class="backVeiwdle">뷰들</div></div>
    </div>
    <div class="sidebarbody">

    <MiniProfile class="SidebarMiniProfile"/>
    <ul class="menu">
        <li><div @click="main()"><i class="fas fa-qrcode" ></i>메뉴</div></li>
        <li><div @click="mypage()"><i class="fas fa-user"></i>마이페이지</div></li>
        <li><div @click="cl()"><i class="fas fa-envelope-open-text"></i>자기소개서</div></li>
        <li><div @click="replay()"><i class="fas fa-video"></i>다시보기</div></li>
        <li><div @click="logout()"><i class="fas fa-sign-out-alt"></i>로그아웃</div></li>
    </ul>
    </div>
    </div>
</div>
    
</template>

<script>
import MiniProfile from '@/components/Lobby/MiniProfile.vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
export default {
  name: 'NavBar',
  components:{
    MiniProfile
  },
  setup () {
    const router = useRouter()
    const store = useStore()
    function logout(){
      store.dispatch('rhtModule/logout')
    }
    function main(){
      store.dispatch('rhtModule/getStudyRoom')
      router.push('/main')
    }
    function mypage(){
        store.dispatch('rhtModule/fetchCurrentUser')
        store.dispatch('rhtModule/fetchHistories')
        store.dispatch('rhtModule/getBadge')
        router.push('/mypage')
    }
    function cl(){
      store.dispatch('rhtModule/getCoverLetter')
      router.push('/cl')
    }
    function replay(){
      store.dispatch('rhtModule/getReplay')
      router.push('/replay')
    }
    return {
      logout, main, mypage, cl, replay
    }
  }           
}
</script>

<style>  
#sidebarall{
    margin: 0;
    padding: 0;
    list-style:none;
    text-decoration: none;
}
.sidebar{
    height:100%;
    width:100%;
    /* background: rgb(153, 172, 230); */
    background: white;
    border-radius: 20px;
    box-shadow: 3px 5px 15px 5px rgb(192, 192, 192);
}
.sidebar header{
    border-radius: 20px;
    font-size:40px;
    color: white;
    text-align: center;
    line-height: 70px;
    background: rgb(153, 172, 230);
    /* background: white; */
    user-select: none;
}
.sidebar ul{
    list-style: none;
}
.sidebar ul a{
    text-decoration: none;
    /* color: white; */
    color : black
}
/* 나중에 a는 모두 라우터로 바꿔야됨 */
.sidebar ul li{
    display:block;
    height: 100%;
    width: 100%;
    line-height: 65px;
    /* color: white; */
    color: black;
    padding-left:40px;
    box-sizing: border-box;
    /* border-top: 1px solid rgb(153, 172, 230); */
    /* border-bottom: 1px solid rgb(153, 172, 230); */
}
.sidebar ul li:hover {
    padding-left: 50px;
    cursor: pointer;
}
.sidebar ul li i{
    margin-right:16px;
}
button{
    background: rgb(153, 172, 230);
    color: white;
    border: rgb(153, 172, 230);
}
.SidebarMiniProfile{
  /* margin-top: 10px; */
  margin-bottom: 10px;

}

.frontVeiwdle{
  margin-top: 10px;
  margin-bottom: 30px;

  font-family: 'yg-jalnan';
  color: #47A0FF;
  font-size: 45px;
}
.backVeiwdle{
  margin-top: 10px;

  font-family: 'yg-jalnan';
  color: #FEAA00;
  font-size: 45px;
}
.menu{
  font-size: 17px;
  padding: 0;
}

</style>