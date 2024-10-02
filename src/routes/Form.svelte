<script lang="ts">
	interface Pipeline {
		name: string;
		versions: string[];
	}
	
	/**
	 * A static array of registered pipelines.  In the future, this will be
	 * retrieved through an API endpoint provided by the backend.
	 */
	const pipelines: Pipeline[] = [
	  {
		"name": "Pipeline 1",
		"versions": ["0", "1", "2"],
	  },
	  {
		"name": "Pipeline 2",
		"versions": ["1.0", "1.1"],
	  },
	];
  
	const pipelineOptions = Object.values(pipelines).map((p) => p.name);
  let versionOptions: string[] = [];
  
	/**
	 * Form variables.
	 */
	let selectedPipeline: string = pipelineOptions[0];
  let selectedVersion: string = "";
  let selectedInputPath: string = "";
  let selectedOutputPath: string = "";

  /**
   * Get the pipeline from the pipeline name.
   * 
   * @param {string} name - the name of the pipeline.
   * @returns {Pipeline | undefined} the pipeline object.
   */
	function getPipeline(name: string): Pipeline | undefined {
    return pipelines.find(pipeline => pipeline.name === name)
  }

  /**
   * Get the most recent version of the pipeline.
   * 
   * @param {Pipeline | undefined} pipeline - the pipeline object.
   * @returns {string} the default version.
   */
  function getDefaultVersion(pipeline: Pipeline | undefined): string {
    return pipeline && pipeline.versions.length > 0
      ? pipeline.versions.at(-1) || ""
      : "";
  }

	$: {
    const pipeline = getPipeline(selectedPipeline);
    selectedVersion = getDefaultVersion(pipeline);
    versionOptions = pipeline ? pipeline.versions: []
  }
  
	// Handle form submission
	function handleSubmit() {
    const payload = {
      pipelineName: selectedPipeline,
      pipelineVersion: selectedVersion,
      inputPath: selectedInputPath,
      outputPath: selectedOutputPath
    };

    // TODO: Send to API
	  console.log(payload);
	}
</script>
  
<!-- Form Layout -->
<form 
  on:submit|preventDefault={handleSubmit} 
  class="w-full max-w-sm mx-auto p-4 bg-white rounded shadow-md">

  <div class="mb-4">
    <label for="pipeline" class="block text-sm font-medium text-gray-700">Pipeline Name</label>
    <select
      id="pipeline"
      class="mt-1 block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm sm:text-sm"
      bind:value={selectedPipeline}
      on:change={() => {
        const pipeline = getPipeline(selectedPipeline);
        versionOptions = pipeline ? pipeline.versions : [];
        selectedVersion = getDefaultVersion(pipeline);
      }}>
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
      placeholder="Input S3 URI"
      bind:value={selectedInputPath}
    >
  </div>

  <div class="mb-4">
    <label for="outputPath" class="block text-sm font-medium text-gray-700">Output Path</label>
    <input
      type="text"
      id="outputPath"
      class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm sm:text-sm"
      placeholder="Output S3 URI"
      bind:value={selectedOutputPath}
    >
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
