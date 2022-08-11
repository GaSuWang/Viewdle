<template>
  <div class="background">
    <!-- 타이머 5초짜리 -->
    <!-- 화살표 넣기 -->
  </div>
</template>

<script>
export default {

}
</script>

<style>
    .class{
        width: 100vw;
        height: 100vh;
        background-color: black;
        animation: blackout 2s;
    }
    @keyframes blackout{
        from{
            opacity: 0;
        }
        to{
            opacity: 1;
        }
    }
</style>