<script lang="ts">
	import Shader from '$lib/Shader.svelte';
	import vert_shader from '$lib/assets/shaders/shader.vert?raw';
	import frag_shader from '$lib/assets/shaders/shader.frag?raw';
</script>

<Shader frag={frag_shader} vert={vert_shader} />
