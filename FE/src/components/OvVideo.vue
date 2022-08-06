<template>
	<video autoplay/>
</template>

<script>
export default {
	name: 'OvVideo',

	props: {
		streamManager: Object,
	},

	mounted () {
		this.streamManager.addVideoElement(this.$el);
	},
};
</script>

<style scoped>
video{
	width: 100%;
	border-radius: 2%;
	border: 1px rgb(231, 231, 231) solid;
}
</style>
