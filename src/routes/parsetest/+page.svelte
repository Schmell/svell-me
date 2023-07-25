<script lang="ts">
	// import type { PageData } from './$types'
	import Page from '$lib/components/layout/Page.svelte'
	// export let data

	import papa from 'papaparse'

	function handleChange(event) {
		let files = event.target.files
		for (let f of files) {
			papa.parse(f, {
				header: true,
				complete: function (results) {
					console.log(results)
				}
			})
		}
	}
</script>

<Page title="parse">
	<form method="post">
		<input type="file" name="file" multiple on:change={handleChange} />
		<button>send</button>
	</form>
</Page>
