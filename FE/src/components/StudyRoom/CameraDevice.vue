//이병헌
<template>
  <div @click="SelectCamera" class="CameraDevice" :class="[isSelected ? 'selected' : '']">
    {{camera.label}}
  </div>
</template>

<script>
import {ref} from 'vue'
import {useStore} from 'vuex'
export default {
name: 'CameraDevice',
props:{camera:Object},
setup(props){
  const store = useStore();
  let isSelected = ref(false)
  function SelectCamera(){
    store.dispatch('setCamera', props.camera)
  }
  return {
    isSelected, 
    SelectCamera,
  }
}
}
</script>

<style scoped>

.CameraDevice:hover{
  background-color: blue;
  color: white;
}

.selected{
  background-color: blue;
  color: white;
}


</style>