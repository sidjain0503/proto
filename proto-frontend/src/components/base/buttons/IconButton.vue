<script setup>
defineProps({
    action: Function,
    icon: String,
    tooltipText: String,
});
</script>

<template>
    <button v-tooltip="tooltipText" aria-label="Close" type="button" class="leading-[0] z-[99999]" style="color: var(--text-dark);" @click="action">
        <i class="fi" :class="icon"></i>
    </button>
</template>
