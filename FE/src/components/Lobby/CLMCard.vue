// 임현탁
<template>
  <div class="CLMCard">
        <div>
          <img src="@/assets/images/anyimgs.png" class="img-fluid rounded-start">
        </div>
          <div class="card-body">
            <h5 class="card-title">Card title</h5>
            <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
            <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
            <button class="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#editCL">수정하기</button>
            <button class="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#deleteCL">삭제하기</button>
        </div>
    <!-- 좌단 -->
    <!-- 자소서 썸네일? 이미지? 이모티콘? -->
    <!-- 우단 -->
    <!-- 자소서 제목  -->
    <!-- 자소서 생성일  -->
    
  </div>  
</template>

<script>
export default {
  props: {card:Object}

}
</script>

<style>
.CLMCard{
  width:45%;
  height:45%; 
  margin:10px;
  border-radius: 20px;
  align-items: center;
  align-content: center;
  justify-content: center;
  box-shadow: 1px 1px 1px 1px gray;
  transition: all 0.1s linear;
}
.CLMCard:hover {
  transform:scale(1.04);
}
</style>