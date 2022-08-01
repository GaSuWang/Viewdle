// 임현탁
<template>
  <div class="CLMCard">
    <div class="card mb-3" style="width: 540px; height:400px; margin:20px;">
      <div class="row g-0">
        <div class="col-md-4">
          <img src="@/assets/images/anyimgs.png" class="img-fluid rounded-start">
        </div>
        <div class="col-md-8">
          <div class="card-body">
            <h5 class="card-title">Card title</h5>
            <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
            <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
            <button class="btn btn-secondary">수정하기</button>
            <button class="btn btn-secondary">삭제하기</button>
          </div>
        </div>
      </div>
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

</style>