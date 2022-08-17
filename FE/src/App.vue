<template>
  <div class="app">
    <!-- <loading v-model:active="visible" :can-cancel="true"></loading> -->
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
  // components: {
  //     Loading: VueLoading
  // },
  // data(){
  //   return{
  //     visible: false
  //   }
  // },
  // created(){
  //   window.addEventListener("load", function() {
  //     let loader = this.$loading.show({
  //         loader: 'dots'
  //     });
  //     setTimeout(() => loader.hide(), 3 * 1000)
  //   });
  // }
};
</script>

<style scoped>
@font-face {
    font-family: 'S-CoreDream-3Light';
    src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_six@1.2/S-CoreDream-3Light.woff') format('woff');
    font-weight: normal;
    font-style: normal;
}

@font-face {
    font-family: 'yg-jalnan';
    src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_four@1.2/JalnanOTF00.woff') format('woff');
    font-weight: normal;
    font-style: normal;
}
.app {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #D8DBEB;
  font-family:'S-CoreDream-3Light'
}
.app::-webkit-scrollbar {
  display: none;
}
</style>
