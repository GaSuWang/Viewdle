<template>
  <div></div>
</template>

<script>
export default {
        methods: {
        successSuddenAttack(){
            this.$emit("endSuddenAttack",true);
        },
        failSuddenAttack(){
            this.$emit("endSuddenAttac",false);
        },
    },
};
</script>

<style></style>
