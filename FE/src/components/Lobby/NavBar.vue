//임현탁
<template>
<div class="sidebarall">
    <div class="sidebar">
    <header>My app</header>
    <ul>
        <li><router-link to="/main"><i class="fas fa-qrcode"></i>Main</router-link></li>
        <li><router-link to="/mypage"><i class="fas fa-user"></i>MyPage</router-link></li>
        <li><router-link to="/cl"><i class="fas fa-envelope-open-text"></i>CoverLetter</router-link></li>
        <li><router-link to="/replay"><i class="fas fa-video"></i>Replay</router-link></li>
        <li><router-link to="/"><i class="fas fa-sign-out-alt"></i>Logout</router-link></li>
    </ul>
    </div>
</div>
    
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
#sidebarall{
    margin: 0;
    padding: 0;
    list-style:none;
    text-decoration: none;
}
.sidebar{
    height:100%;
    background: #042331;
    border-radius: 20px;
}
.sidebar header{
    border-radius: 20px;
    font-size:40px;
    color: white;
    text-align: center;
    line-height: 70px;
    background: #063146;
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
    border-top: 1px solid rgba(255,255,255,.1);
    border-bottom: 1px solid black;
}
.sidebar ul li:hover {
    padding-left: 50px
}
.sidebar ul li i{
    margin-right:16px;
}
button{
    background: #042331;
    color: white;
    border: #042331;
}
</style>