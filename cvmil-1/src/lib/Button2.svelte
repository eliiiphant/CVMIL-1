<script lang="ts">
    let {
        text, onclick, isActive
    }: {
        text : string; onclick : () => void; isActive: boolean;
    } = $props();
</script>

<button
    class={`
        flex items-center justify-center
        ${isActive ? 'bg-minion-yellow-300' : 'bg-gray-200'} border-4 border-minion-yellow-950 hover:border-minion-yellow-800 active:border-minion-yellow-800
        font-pixel text-minion-yellow-950 text-4xl
        w-full h-16
        rounded-none
        transition delay-150 duration-300 ease-in-out
    `}
    {onclick}
> <!-- shadow-[4px_4px_0_0_#703d13] -->
    {text}
</button>
