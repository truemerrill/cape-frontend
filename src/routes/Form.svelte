<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';

	interface Pipeline {
		pipeline_name: string;
		pipeline_type: string;
		version: string;
	}

	/* An array of registered pipelines */
	let pipelines: Pipeline[] = [];
	let pipelineOptions: string[] = [];

	/**
	 * Check if the version string uses semantic versioning
	 * @param {string} version - the version string
	 * @returns {boolean} whether the version string uses semantic versioning
	 */
	function isSemVer(version: string): boolean {
		const semverRegex = /^\d+\.\d+\.\d+$/;
		return semverRegex.test(version);
	}

	/**
	 * Sort function for two semantic version strings.
	 * @param {string} a - the first string
	 * @param {string} b - the second string
	 */
	function semVerSort(a: string, b: string): number {
		const [majorA, minorA, patchA] = a.split('.').map(Number);
		const [majorB, minorB, patchB] = b.split('.').map(Number);
		return majorA - majorB || minorA - minorB || patchA - patchB;
	}

	/**
	 * Sort pipelines by their version number.
	 *
	 * Note: pipeline versions can either be semantic version strings or not.
	 * 	Versions which follow semantic versioning will always appear *after*
	 * 	those that do not.  Pipelines that follow semantic versioning will be
	 * 	sorted by their version number.  Pipelines that do not will be sorted
	 * 	in alphabetical order.
	 *
	 * @param pipelines
	 */
	function sortPipelines(pipelines: Pipeline[]): Pipeline[] {
		const nonSemVer: Pipeline[] = [];
		const semVer: Pipeline[] = [];

		pipelines.forEach((pipeline) => {
			if (isSemVer(pipeline.version)) {
				semVer.push(pipeline);
			} else {
				nonSemVer.push(pipeline);
			}
		});

		nonSemVer.sort((a, b) => a.version.localeCompare(b.version));
		semVer.sort((a, b) => semVerSort(a.version, b.version));
		return [...nonSemVer, ...semVer];
	}

	/**
	 * Get the pipelines.
	 *
	 * When the component mounts, query the API to retrieve the list of
	 * pipelines.
	 */
	onMount(async () => {
		const url = `${backendUrl}/analysispipelines`;
		const response = await fetch(url)
			.then((response) => {
				if (!response) {
					throw new Error(`No response from ${url}`);
				}
				if (!response.ok) {
					throw new Error(response.statusText);
				}
				return response;
			})
			.catch((error) => console.error(error));
		if (response) {
			const payload: Pipeline[] = await response.json();
			pipelines = sortPipelines(payload);
			pipelineOptions = Object.values(pipelines).map((p) => p.pipeline_name);
		}
	});

	let versionOptions: string[] = [];

	/**
	 * Form variables.
	 */
	let selectedPipeline: string = pipelineOptions[0];
	let selectedVersion: string = '';
	let selectedInputPath: string = '';
	let selectedOutputPath: string = '';

	/**
	 * Get the pipeline from the pipeline name.
	 *
	 * @param {string} name - the name of the pipeline.
	 * @returns {Pipeline | undefined} the pipeline object.
	 */
	function getPipeline(name: string): Pipeline | undefined {
		return pipelines.find((pipeline) => pipeline.pipeline_name === name);
	}

	/**
	 * Get the most recent version of the pipeline.
	 *
	 * @param {string} name - the name of the pipeline.
	 * @returns {Pipeline | undefined} the pipeline object.
	 */
	function getDefaultPipeline(name: string): Pipeline | undefined {
		const versions = pipelines.filter((p) => p.pipeline_name === name);
		return versions.length > 0 ? versions.slice(-1)[0] : undefined;
	}

	$: {
		const pipeline = getDefaultPipeline(selectedPipeline);
		selectedVersion = pipeline ? pipeline.version : '';
		versionOptions = pipelines
			.filter((p) => p.pipeline_name == selectedPipeline)
			.map((p) => p.version);
	}

	// Handle form submission
	function handleSubmit() {
		const url = `${backendUrl}/analysispipeline`;
		const payload = {
			pipelineName: selectedPipeline,
			pipelineVersion: selectedVersion,
			inputPath: selectedInputPath,
			outputPath: selectedOutputPath
		};

		// TODO: Turn back on cors
		fetch(url, {
			method: 'POST',
			body: JSON.stringify(payload)
			// mode: 'no-cors'
		})
			.then((response) => {
				if (response.ok) {
					goto('/submit');
				} else {
					throw new Error(`Response status: ${response.status}`);
				}
			})
			.catch((error) => {
				console.error(error);
				alert(error);
			});
	}
</script>

<!-- Form Layout -->
<form
	on:submit|preventDefault={handleSubmit}
	class="w-full max-w-sm mx-auto p-4 bg-white rounded shadow-md"
>
	<div class="mb-4">
		<label for="pipeline" class="block text-sm font-medium text-gray-700">Pipeline Name</label>
		<select
			id="pipeline"
			class="mt-1 block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm sm:text-sm"
			bind:value={selectedPipeline}
			on:change={() => {
				const pipeline = getDefaultPipeline(selectedPipeline);
				selectedVersion = pipeline ? pipeline.version : '';
				versionOptions = pipelines
					.filter((p) => p.pipeline_name == selectedPipeline)
					.map((p) => p.version);
			}}
		>
			{#each pipelineOptions as option}
				<option value={option}>{option}</option>
			{/each}
		</select>
	</div>

	<div class="mb-4">
		<label for="version" class="block text-sm font-medium text-gray-700">Version</label>
		<select
			id="version"
			class="mt-1 block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm sm:text-sm"
			bind:value={selectedVersion}
		>
			{#each versionOptions as version}
				<option value={version}>{version}</option>
			{/each}
		</select>
	</div>

	<div class="mb-4">
		<label for="inputPath" class="block text-sm font-medium text-gray-700">Input Path</label>
		<input
			type="text"
			id="inputPath"
			class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm sm:text-sm"
			required
			placeholder="Input S3 URI"
			bind:value={selectedInputPath}
		/>
	</div>

	<div class="mb-4">
		<label for="outputPath" class="block text-sm font-medium text-gray-700">Output Path</label>
		<input
			type="text"
			id="outputPath"
			class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm sm:text-sm"
			required
			placeholder="Output S3 URI"
			bind:value={selectedOutputPath}
		/>
	</div>

	<div class="mt-4">
		<button
			type="submit"
			class="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-light"
		>
			Submit
		</button>
	</div>
</form>

<style>
</style>
