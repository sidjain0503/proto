<template>
    <div class="relative">
        <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <i class="fi fi-rr-search text-gray-400"></i>
        </div>
        <input
            class="rounded-md w-full bg-gray-100 border-0 pl-10 pr-4 py-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
            :placeholder="placeholder"
            :value="modelValue"
            @input="$emit('update:modelValue', $event.target.value)"
        />
    </div>
</template>

<script setup>
defineProps({
    modelValue: String,
    placeholder: {
        type: String,
        default: 'Search',
    },
});

defineEmits(['update:modelValue']);
</script>

<style lang="scss" scoped></style>
