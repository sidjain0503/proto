<template>
    <div class="flex items-center gap-1.5 text-red-600">
        <i class="fi fi-rr-exclamation"></i>
        <p class="text-sm">{{ message }}</p>
    </div>
</template>

<script setup>
defineProps({
    message: {
        type: String,
        required: true,
    },
});
</script>

<style lang="scss" scoped></style>
