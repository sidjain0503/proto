<script setup>
import { computed } from 'vue';

const props = defineProps({
    hideRemoveButton: {
        type: Boolean,
        default: false,
    },
    text: {
        type: String,
        required: true,
    },
    color: {
        type: String,
        default: 'blue-600',
    },
    backgroundColor: {
        type: String,
        default: 'blue-100',
    },
});

const colorClass = computed(() => {
    return `text-${props.color}`;
});

const backgroundColorClass = computed(() => {
    return `bg-${props.backgroundColor}`;
});

const emit = defineEmits(['remove-badge']);
const removeBadge = () => {
    emit('remove-badge');
};
</script>

<template>
    <span :class="[colorClass, backgroundColorClass, { 'pr-2.5': hideRemoveButton }]" class="inline-flex rounded-full items-center py-0.5 pl-2.5 pr-1 text-sm font-medium">
        {{ text }}
        <button
            v-if="!hideRemoveButton"
            :class="[colorClass, backgroundColorClass]"
            type="button"
            class="flex-shrink-0 ml-0.5 h-4 w-4 rounded-full inline-flex items-center justify-center"
            @click.stop="removeBadge"
        >
            <span class="sr-only">Remove {{ text.toLowerCase() }} option</span>
            <svg class="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                <path stroke-linecap="round" stroke-width="1.5" d="M1 1l6 6m0-6L1 7" />
            </svg>
        </button>
    </span>
</template>
