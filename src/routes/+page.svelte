<script>
	import Form from './Form.svelte';
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="CAPE Frontend" />
</svelte:head>

<section>
	<!-- <Counter /> -->

	<div class="mt-4">
		<h1>Submit Pipeline</h1>
		<Form />
	</div>
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}

	h1 {
		width: 100%;
		margin-bottom: 8pt;
	}
</style>
