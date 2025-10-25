<template>
    <div>
        <label v-if="label" class="info-label">{{ label }}</label>
        <p v-if="supportText" class="text-sm text-greySecondary mt-1">{{ supportText }}</p>
        <fieldset>
            <div :class="stacked ? 'flex flex-col mt-4 gap-4' : gridCols">
                <div v-for="option in options" :key="option.id" class="flex items-center cursor-pointer">
                    <input
                        :id="option.id"
                        :name="groupName"
                        type="radio"
                        :checked="option[valueField || 'id'] === selected"
                        class="h-5 w-5 border-gray-300 cursor-pointer"
                        :class="disabled ? 'opacity-70' : ''"
                        :disabled="disabled"
                        @change="onChange(option[valueField || 'id'])"
                    />
                    <div class="ml-4 flex flex-col gap-1">
                        <label :for="option.id" class="block text-sm font-semibold leading-6 cursor-pointer">{{ option.title }}</label>
                        <div v-if="option.description" class="text-sm text-greySecondary">{{ option.description }}</div>
                    </div>
                </div>
            </div>
        </fieldset>
    </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';

const props = defineProps({
    id: String,
    groupName: {
        type: String,
        required: true,
    },
    valueField: {
        type: String,
        required: true,
    },
    default: String,
    label: String,
    supportText: String,
    options: {
        type: Array,
        required: true,
    },
    stacked: {
        type: Boolean,
        default: false,
    },
    customClass: {
        type: String,
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    gridCols: {
        type: String,
        default: 'grid grid-cols-3 gap-4',
    },
});

const emit = defineEmits(['on-change']);
const selected = ref(props?.default);

const onChange = selectedValue => {
    selected.value = selectedValue;
    emit('on-change', selectedValue);
};

onMounted(() => {
    onChange(props?.default);
});

watch(props, () => {
    onChange(props?.default);
});
</script>
