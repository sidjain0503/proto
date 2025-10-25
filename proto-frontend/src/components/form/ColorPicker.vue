<template>
    <div class="color-picker-wrapper">
        <label v-if="label" class="text-sm font-semibold">
            {{ label }}
            <span v-if="required" class="text-xs font-medium text-greySecondary">Required</span>
        </label>
        <div class="relative w-full mt-1">
            <CustomInput :model-value="modelValue || ''" @update:model-value="handleInputChange" placeholder="Choose background color" class="font-mono text-sm w-full pr-" />
            <input ref="colorInput" type="color" :value="modelValue || '#000000'" @input="handleColorChange" class="sr-only" />
            <button
                type="button"
                @click="openColorPicker"
                class="absolute inset-y-0 right-1 my-auto w-7 h-7 rounded-md border"
                :style="{ backgroundColor: modelValue || '#ffffff' }"
                :title="modelValue || 'Select color'"
            >
                <span class="sr-only">Choose color</span>
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import CustomInput from '@/components/form/CustomInput.vue';

defineProps({
    modelValue: {
        type: String,
        default: '',
    },
    label: {
        type: String,
        default: '',
    },
    required: {
        type: Boolean,
        default: false,
    },
    showPresets: {
        type: Boolean,
        default: true,
    },
});

const emit = defineEmits(['update:modelValue']);

const colorInput = ref(null);

const openColorPicker = () => {
    colorInput.value?.click();
};

const handleColorChange = event => {
    const color = event.target.value;
    emit('update:modelValue', color);
};

const handleInputChange = value => {
    if (value && !value.startsWith('#')) {
        value = '#' + value;
    }
    if (value === '' || /^#[0-9A-Fa-f]{6}$/i.test(value)) {
        emit('update:modelValue', value);
    }
};
</script>

<style scoped>
.color-picker-wrapper {
    @apply w-full;
}
</style>
