<template>
  <div class="gameStartbox">
    <div class="gameStart d-flex justify-content-center">GAME START</div>
    <div class="gameDiscription d-flex justify-content-center">{{ gameDiscription }}</div>
  </div>
</template>

<script>
export default {
  name : 'GameStart',
  props : ['gameDiscription', ]
}
</script>

<style>
.background {
  background-color: rgba(255,255,255,0.8);
  width: 100vw;
  height: 100vh;
}
.gameStart{
  font-size: 150px;
  color:  #fcab1f;
  text-shadow: -1px 0 #555, 0 1px #555, 5px 0 #555, 0 -1px #555;
  font-family: 'SDSamliphopangche_Basic';
}
.gameDiscription{
  font-size: 50px;
  color: rgb(157, 157, 157);
  font-family: 'SDSamliphopangche_Basic';
}
@font-face {
    font-family: 'SDSamliphopangche_Basic';
    src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts-20-12@1.0/SDSamliphopangche_Basic.woff') format('woff');
    font-weight: normal;
    font-style: normal;
}
</style>