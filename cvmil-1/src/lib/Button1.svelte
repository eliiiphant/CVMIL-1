<script lang="ts">
    let {
        text, onclick, isEnabled, 
        isSubmit
    }: {
        text : string; onclick? : () => void; isEnabled: boolean; 
        isSubmit?: boolean
    } = $props();
</script>

<button 
    type={isSubmit ? 'submit' : 'button'}
    class="
        w-fit
        bg-minion-yellow-300 border-4 border-minion-yellow-950 hover:border-minion-yellow-800 active:border-minion-yellow-800 disabled:bg-gray-200 disabled:border-gray-400
        text-lg font-medium font-pixel text-minion-yellow-950 disabled:text-gray-400
        px-3
        rounded-none
        transition delay-150 duration-300 ease-in-out
    "
    {onclick}
    disabled={!isEnabled}
> <!-- shadow-[4px_4px_0_0_#703d13] -->
    {text}
</button>
