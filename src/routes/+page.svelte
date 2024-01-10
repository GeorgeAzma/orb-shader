<script lang="ts">
	import Shader from '$lib/Shader.svelte';
	import vert_shader from '$lib/assets/shaders/shader.vert?raw';
	import orb_shader from '$lib/assets/shaders/orb.frag?raw';
	import aurora_shader from '$lib/assets/shaders/aurora.frag?raw';
</script>

<div class="shaders">
	<div id="aurora">
		<Shader frag={aurora_shader} vert={vert_shader} />
	</div>
	<div id="orb">
		<Shader frag={orb_shader} vert={vert_shader} />
	</div>
</div>

<style>
	.shaders {
		display: flex;
	}
	#orb {
		width: 25%;
		height: 25%;
		transform: translate(-35%, 35%) scale(30%);
	}
	#aurora {
		width: 0%;
		height: 0%;
	}
</style>
