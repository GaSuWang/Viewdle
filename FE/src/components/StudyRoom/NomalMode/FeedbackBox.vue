// 이병헌
<template>
  <div class="FeedbackBox">
    {{fb.content}}
    <button @click="deleteFB">X</button>
  </div>
</template>

<script>
export default {
    name: "FeedbackBox",
    props: {
        fb:Object
    },
    setup(){
        function deleteFB(){
            store.dispacth('lbhModule/deleteFB', params) //store action에 추가

        }
    }
}

</script>

<style>

</style>