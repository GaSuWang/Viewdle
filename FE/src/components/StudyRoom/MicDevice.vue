//이병헌
<template>
  <div @click="SelectMic" class="MicDevice" :class="[isSelected ? 'selected' : '']">
    {{mic.label}}
  </div>
</template>

<script>
import {ref} from 'vue'
import {useStore} from 'vuex'
export default {
name: 'MicDevice',
props: {mic:Object},
setup(props){
  const store = useStore();
  let isSelected = ref(false)
  function SelectMic(){
    store.dispatch('setMic', props.mic)
  }
  return {
    isSelected,
    SelectMic,
  }
}
}
</script>

<style scoped>

.MicDevice:hover{
  background-color: blue;
  color: white;
}

.selected{
  background-color: blue;
  color: white;
}

</style>