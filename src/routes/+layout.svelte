<script>
	import "../app.pcss";
	import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';

	injectSpeedInsights();
</script>

<div class="app">
	<main>
		<slot></slot>
	</main>
</div>