<script lang="ts">
    import { enhance } from '$app/forms';

    import type { ActionData } from './$types';

    import Button1 from "$lib/Button1.svelte";
    import Button2 from "$lib/Button2.svelte";

    let { form }: { form: ActionData } = $props();

    let stage: number = $state(1);

    let photo: string        | null = $state(null);
    let model: "ViT" | "CNN" | null = $state(null);

    //

    let stage1Placeholder: string = "/stage1Placeholder.svg";
    let stage1ModelViT:    string = "/stage1ModelViT.svg";
    let stage1ModelCNN:    string = "/stage1ModelCNN.svg";
    let stage2Placeholder: string = "/stage2Placeholder.svg";

    let fileInput: File | null = $state(null);

    function handleFileChange(event: Event) {
        const input = event.target as HTMLInputElement;

        if (input.files && input.files.length > 0) {
            const file = input.files[0];

            fileInput = file;

            photo = URL.createObjectURL(file);
        } else {
            photo = null;
        }
    }

    //

    const handleEnhance = ({ cancel }) => {
        // sanity: runs before the form is submitted to the server

        if (!fileInput) {
            alert("Please select a photo.");
            cancel();
            return;
        }

        if (!model) {
            alert("Please select a model.");
            cancel();
            return;
        }

        stage = 3;

        return async ({ result, update }) => {
            // sanity: runs after the form is submitted to the server and after the response is received

            console.log('Result type:', result.type);
            console.log('Result data:', result.data);

            console.log('Before update - form:', form);

            await update();

            console.log('After update - form:', form);
    
            stage = 4;
        };
    };

</script>

{#snippet stage1()} <!-- Pick a Model -->
    <!-- Root -->
    <div class="relative flex flex-col items-center justify-start gap-4 overflow-hidden w-full h-full pb-12 sm:pb-0">
        <!-- Title -->
        <p class="font-pixel text-4xl text-center text-minion-yellow-950">
            Pick a Model
        </p>

        <!-- PHOTO ELEMENT FORDA AESTHETIC -->
        <img
            src={model === "ViT" ? stage1ModelViT : model === "CNN" ? stage1ModelCNN : stage1Placeholder}
            alt="Banana Leaf to Scan"
            class="w-4/5 sm:w-3/5 aspect-square object-cover border-4 border-minion-yellow-950"
        /> 

        <!-- Model Choices -->
        <div class="flex gap-4 w-full">
            <label class="flex flex-1">
                <Button2 text="Model ViT" onclick={() => model = (model === "ViT" ? null : "ViT")} isActive={model === "ViT"} />
            </label>

            <label class="flex flex-1">
                <Button2 text="Model CNN" onclick={() => model = (model === "CNN" ? null : "CNN")} isActive={model === "CNN"} />
            </label>
        </div>

        <!-- Next Button -->
        <div class="absolute bottom-0 right-0" title={`${!!model ? "" : "Pick a model!"}`}>
            <Button1 text="NEXT" onclick={() => stage = 2} isEnabled={!!model} />
        </div>
    </div>
{/snippet}

{#snippet stage2()} <!-- Pick a Photo -->
    <!-- Root -->
    <div class="relative flex flex-col items-center justify-start gap-4 overflow-hidden w-full h-full pb-12 sm:pb-0">
        <!-- Title -->
        <p class="font-pixel text-4xl text-center text-minion-yellow-950">
            Pick a Photo
        </p>

        <!-- Photo Preview -->
        <img
            src={photo || stage2Placeholder}
            alt="Banana Leaf to Scan"
            class="w-4/5 sm:w-3/5 aspect-square object-cover border-4 border-minion-yellow-950"
        />

        <!-- Photo Input -->
        <input
            type="file" accept="image/*" name="chosenPhoto" onchange={handleFileChange}
            class="
                bg-gray-200 border-4 border-minion-yellow-950
                text-base font-pixel text-gray-950 tracking-wide
                w-full h-16 px-1.5 py-1.5
                rounded-none
                cursor-pointer
 
                file:bg-minion-yellow-300 hover:file:border-minion-yellow-800 file:border-4 file:border-minion-yellow-950
                file:text-base file:font-pixel file:text-minion-yellow-950 file:tracking-wide
                file:w-1/3 file:h-full file:p-2 file:mr-3
                file:rounded-none
                file:transition file:delay-150 file:duration-300 file:ease-in-out
                file:cursor-pointer
            "
        />

        <!-- Hidden Model Input -->
        <input type="hidden" name="chosenModel" value={model} />

        <!-- Next Button -->
        <div class="absolute bottom-0 right-0" title={`${!!fileInput ? "" : "Pick a photo!"}`}>
            <Button1 text="SEE PREDICTIONS" isEnabled={!!fileInput} isSubmit={true} />
        </div>
    </div>
{/snippet}

{#snippet stage3()} <!-- Loading -->
    <!-- Root -->
    <div class="relative flex flex-col items-center justify-center gap-4 overflow-hidden w-full h-full pt-16.5 sm:pt-0 pb-16.5 sm:pb-0">
        <img
            src="https://s14.gifyu.com/images/bseso.gif"
            alt="Loading"
            class="w-4/5 sm:w-3/5 aspect-square"
        />

        <p class="font-pixel text-3xl text-minion-yellow-950 animate-pulse">Loading...</p>
    </div>
{/snippet}

{#snippet results()} <!-- Results -->
    <!-- Root -->
    <div class="relative flex flex-col items-center justify-start gap-4 overflow-hidden w-full h-full pb-12 sm:pb-0">
        <!-- Title -->
        <p class="font-pixel text-4xl text-center text-minion-yellow-950">
            Results
        </p>

        {#if form && (form.success && form.prediction)}

            <!-- Main Prediction -->
            <div class="flex justify-center bg-minion-yellow-300 text-gray-950 text-center text-3xl font-pixel tracking-wide p-3 w-full sm:w-auto border-4 border-minion-yellow-950">
                <span>Prediction:</span>&nbsp;
                <span class={`uppercase ${form.prediction.label === 'healthy' ? 'text-green-600' : 'text-minion-red'}`}>
                    {form.prediction.label}
                </span>
            </div>

            <!-- Confidence Breakdown -->
            <div class="w-full font-pixel">
                <ul class="space-y-1">
                    {#each form.prediction.confidences as c}
                        <li class="flex flex-col items-start">
                            <!-- Label -->
                            <span class="text-lg uppercase">{c.label}</span>

                            <!-- Bar Container -->
                            <div class="w-full h-4 bg-gray-200 border-2 border-minion-yellow-950">
                                <div
                                    class="h-full bg-minion-yellow-300 hover:bg-minion-yellow-500 text-sm transition delay-150 duration-300 ease-in-out"
                                    style="width: {Math.round(c.confidence * 100)}%"
                                ></div>
                            </div>

                            <!-- Confidence Value -->
                            <span class="w-full mt-0.5 text-sm text-right">
                                {(c.confidence * 100).toFixed(2)}%
                            </span>
                        </li>
                    {/each}
                </ul>
            </div>

            {:else if form && (!form.success || !form.prediction) }
                <div class="flex flex-1 items-center justify-center w-full px-4">

                    <p class="font-pixel text-lg text-minion-red text-center">
                        An error happened during prediction. <br> CVMIL-1 says sorry.
                    </p>
                </div>
            {/if}

        <!-- Reset Button -->
        <div class="absolute bottom-0 right-0">
            <Button1 text="TRY ANOTHER PHOTO" onclick={() => window.location.reload()} isEnabled={true}/>
        </div>
    </div>
{/snippet}

<div class="overflow-hidden h-screen w-screen flex flex-col items-center justify-center gap-5 sm:gap-3 bg-gradient">
    <p class="font-title text-4xl sm:text-6xl text-minion-yellow-950">
        CVMIL-1
    </p>

    <div
        class="
            flex items-center justify-center
            w-full h-fit
            sm:w-[90vw] sm:max-w-[32rem] sm:h-[90vw] sm:max-h-[32rem]
            p-4
            bg-gray-50 border-8 border-minion-yellow-950
        "
    >
        {#if stage === 1}
            {@render stage1()}
        {:else if stage === 2}
            <form method="POST" action="?/predict" enctype="multipart/form-data" use:enhance={handleEnhance} class="w-full h-full">
                {@render stage2()}
            </form>
        {:else if stage === 3}
            {@render stage3()}
        {:else}
            {@render results()}
        {/if}
    </div>
</div>

<style>
    .bg-gradient {
        background-image: url('/bg-gradient.svg');
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
    }
</style>