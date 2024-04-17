<script>
	import "../app.pcss";
	import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';
	import { inject } from '@vercel/analytics'

	inject()
	injectSpeedInsights();
</script>

<div class="app">
	<main>
		<slot></slot>
	</main>
</div>