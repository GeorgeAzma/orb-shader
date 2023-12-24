import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		paths: {
			base: '/orb-shader-A341-9FA2-EF37-CC36',
	  	},
		adapter: adapter({fallback: 'index.html'})
	}
};
export default config;
