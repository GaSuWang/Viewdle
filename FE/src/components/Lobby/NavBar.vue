//임현탁
<template>
<div class="sidebarall">
    <div class="sidebar">
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
    <div class="profileBox" style="height:20px"></div>
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
    background: white;
    border-radius: 20px;
    box-shadow: 4px 4px 6px #aaa, inset 0px 2.5px 6px #fff;
}
.sidebar header{
    border-radius: 20px;
    font-size:40px;
    color: white;
    text-align: center;
    line-height: 70px;
    background: rgb(153, 172, 230);
    user-select: none;
}
.sidebar ul{
    list-style: none;
}
.sidebar ul a{
    text-decoration: none;
    color : black
}

.sidebar ul li{
    display:block;
    height: 100%;
    width: 100%;
    line-height: 65px;
    color: black;
    padding-left:60px;
    box-sizing: border-box;

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

  margin-bottom: 10px;

}

.frontVeiwdle{
  margin-top: 10px;
  margin-bottom: 30px;

  font-family: 'yg-jalnan';
  color: #47A0FF;
  font-size: 40px;
}
.backVeiwdle{
  margin-top: 20px;

  font-family: 'yg-jalnan';
  color: #FEAA00;
  font-size: 50px;
}
.menu{
  font-size: 17px;
  padding: 0;
}
.profileBox{
  margin-top: 30px;
  width: 100%;
  height: 100%;
  border: 0;
  outline: none;

  background: #FEAA00;
  color: white;
  font-weight: bold;
  font-size: 1.2em;
  letter-spacing: 2px;
  box-shadow: 0px 1.5px 4px #aaa, inset 0px 1px 1.5px #fff;

}

</style>