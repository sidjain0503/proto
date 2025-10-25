<template>
    <div class="flex flex-col flex-1">
        <div class="border-b border-gray-200 pb-2 sm:flex sm:items-center sm:justify-between">
            <div>
                <h3 class="text-base font-semibold leading-6 text-gray-900 py-1">{{ title }}</h3>
                <p v-if="description" class="max-w-4xl text-sm text-light">
                    {{ description }}
                </p>
            </div>
            <div class="mt-3 sm:ml-4 sm:mt-0 flex-none" v-if="$slots['buttons']">
                <slot name="buttons"></slot>
            </div>
        </div>
        <div class="py-4 flex-1 flex flex-col">
            <slot name="content-slot"></slot>
        </div>
    </div>
</template>

<script setup>
import { defineProps } from 'vue';

defineProps({
    title: String,
    description: String,
    save: {
        type: Function,
        default: () => {},
    },
    reset: {
        type: Function,
        default: () => {},
    },
    disableSave: {
        type: Boolean,
        default: false,
    },
});
</script>

<style scoped></style>
