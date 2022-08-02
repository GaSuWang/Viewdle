// 임현탁
<template>
  <div class="ReplayCard">
        <div>
          <img src="@/assets/images/anyimgs.png" class="img-fluid rounded-start">
        </div>
          <div class="card-body">
            <h5 class="card-title">Card title</h5>
            <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
            <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
            <button class="btn btn-secondary">삭제하기</button>
          </div>
    <!-- 왼쪽 -->
    <!-- 썸네일 -->
    
    <!-- 오른쪽 -->
    <!-- 방제 -->
    <!-- 생성 시각 -->

  </div>
</template>

<script>
</script>

<style>
.ReplayCard{
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
.ReplayCard:hover {
  transform:scale(1.04);
}
</style>