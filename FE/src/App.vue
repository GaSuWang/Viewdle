<template>
  <div>
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
  components: {},
};
</script>

<style>
@importurl (https://cdn.jsdelivr.net/gh/moonspam/NanumSquare@1.0/nanumsquare.css);

html * {
  font-family: "NanumSquare", sans-serif;
}

*::before {
  box-sizing: border-box;
}
</style>
