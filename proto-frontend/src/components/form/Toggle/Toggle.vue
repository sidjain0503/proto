<script setup>
import { Switch } from '@headlessui/vue';
import useModelWrapper from '@/composables/useModelWrapper.js';

const props = defineProps({
    label: String,
    modelValue: Boolean,
    disabled: Boolean,
    flat: Boolean,
    info: String,
    size: {
        type: String,
        default: 'md',
    },
});

const emit = defineEmits(['update:modelValue']);
const enabled = useModelWrapper(props, emit);
</script>

<template>
    <div :class="flat ? 'flex items-center justify-between' : ''">
        <div class="flex gap-x-1 items-center">
            <label v-if="label" class="text-sm font-medium flex items-center gap-1">{{ label }}</label>
            <div v-if="props.info" v-tooltip.top="info" class="cursor-pointer">
                <div class="cursor-pointer rounded flex items-center justify-center pt-1">
                    <i class="fi fi-rr-info text-[#323232] text-xs"></i>
                </div>
            </div>
        </div>

        <div class="mt-2">
            <Switch
                v-if="size === 'md'"
                v-model="enabled"
                :class="[
                    enabled ? 'bg-blue-600' : 'bg-gray-200',
                    disabled ? 'opacity-70' : '',
                    'relative inline-flex flex-shrink-0 h-6 w-12 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
                ]"
                :disabled="disabled"
            >
                <span
                    aria-hidden="true"
                    :class="[enabled ? 'translate-x-6' : 'translate-x-0', 'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200']"
                />
            </Switch>
            <Switch
                v-else
                v-model="enabled"
                :class="[
                    enabled ? 'bg-blue-600' : 'bg-gray-200',
                    disabled ? 'opacity-70' : '',
                    'relative inline-flex flex-shrink-0 h-4 w-8 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
                ]"
                :disabled="disabled"
            >
                <span
                    aria-hidden="true"
                    :class="[enabled ? 'translate-x-4' : 'translate-x-0', 'pointer-events-none inline-block h-3 w-3 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200']"
                />
            </Switch>
        </div>
    </div>
</template>
