import preprocess from 'svelte-preprocess'
import adapter from '@sveltejs/adapter-vercel'
import { vitePreprocess } from '@sveltejs/kit/vite'
import { preprocessMeltUI } from '@melt-ui/pp'
import sequence from 'svelte-sequential-preprocessor'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	// ... other svelte config options
	preprocess: sequence([
		// ... other preprocessors
		vitePreprocess(),
		preprocess({
			postcss: true
		}),
		preprocessMeltUI() // add to the end!
	]),

	kit: {
		adapter: adapter()
	}
}

export default config
