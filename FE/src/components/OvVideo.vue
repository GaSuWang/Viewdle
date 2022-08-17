<template>
	<video autoplay ref="video"/>
</template>

<script>
export default {
	name: 'OvVideo',
	props: {
		streamManager: Object,
	},

	mounted () {
		this.streamManager.addVideoElement(this.$el);
		if(!this.streamManager.remote){
			this.$refs.video.muted = true;
		}
	},
};
</script>

<style scoped>
video{
	width: 100%;
	height: 100%;
	/* border-radius: 20px; */
	border: 1px rgb(231, 231, 231) solid;
}
</style>
