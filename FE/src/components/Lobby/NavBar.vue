//임현탁
<template>
<div class="sidebarall">
    <div class="sidebar">
    <header>V:Dle</header>
    <div class="sidebarbody">
    <MiniProfile class="SidebarMiniProfile"/>
    <ul>
        <li><div @click="main()"><i class="fas fa-qrcode"></i>Main</div></li>
        <li><div @click="mypage()"><i class="fas fa-user"></i>MyPage</div></li>
        <li><div @click="cl()"><i class="fas fa-envelope-open-text"></i>CoverLetter</div></li>
        <li><div @click="replay()"><i class="fas fa-video"></i>Replay</div></li>
        <li><div @click="logout()"><i class="fas fa-sign-out-alt"></i>Logout</div></li>
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
    background: rgb(153, 172, 230);
    border-radius: 20px;
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
    color: white;
}
/* 나중에 a는 모두 라우터로 바꿔야됨 */
.sidebar ul li{
    display:block;
    height: 100%;
    width: 100%;
    line-height: 65px;
    color: white;
    padding-left:40px;
    box-sizing: border-box;
    border-top: 1px solid rgb(153, 172, 230);
    border-bottom: 1px solid rgb(153, 172, 230);
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

}
</style>