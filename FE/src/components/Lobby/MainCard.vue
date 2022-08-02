// 임현탁
<template>
<div class="MainCard">
    <div class="MainCardthumnail">
      <img src="@/assets/images/anyimgs.png" class="img-fluid rounded-start">
    </div>
    <div class="col">
      <h5>Card title</h5>
      <p>This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
      <p><small class="text-muted">Last updated 3 mins ago</small></p>
      <button class="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#enterroom">입장하기</button>
    </div>
  </div>
    <!-- 왼쪽 -->
    <!-- 썸네일 -->
    <!-- 이지, 하드모드 여부 색으로 표현 -->

    <!-- 오른쪽 -->
    <!-- 방 몇명있는지 -->
    <!-- 방제목 -->
    <!-- 만들어진 시간 -->
    <!-- 방장 이메일 -->


</template>

<script>
</script>

<style>
.MainCard{
  width:50%;
  height:400px; 
  margin:20px;
  border-radius: 20px;
  align-items: center;
  align-content: center;
  justify-content: center;
  box-shadow: 1px 1px 1px 1px gray;
  transition: all 0.1s linear;
}
.MainCard:hover {
  transform:scale(1.04);
}
</style>