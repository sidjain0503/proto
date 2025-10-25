<script setup>
import useModelWrapper from '@/composables/useModelWrapper';

const props = defineProps({
    label: String,
    modelValue: Boolean,
    disabled: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(['update:modelValue']);
const checked = useModelWrapper(props, emit);
</script>

<template>
    <div class="relative flex items-start">
        <div class="flex h-5 items-center">
            <input
                v-model="checked"
                :name="label"
                type="checkbox"
                class="h-4 w-4 rounded border-gray-300"
                :class="{ 'text-gray-300': disabled, 'text-blue-600 focus:ring-blue-500': !disabled }"
                :disabled="disabled"
            />
        </div>
        <div class="ml-2 text-sm">
            <label for="comments" class="font-medium">{{ label }}</label>
        </div>
    </div>
</template>
