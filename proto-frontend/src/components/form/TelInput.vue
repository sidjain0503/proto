<script setup>
import { VueTelInput } from 'vue-tel-input';
import 'vue-tel-input/dist/vue-tel-input.css';
import useModelWrapper from '@/composables/useModelWrapper.js';
import { ref } from 'vue';

const props = defineProps({
    label: String,
    placeholder: String,
    modelValue: String,
    widthClass: String,
    error: String,
    disabled: Boolean,
    required: Boolean,
});

const emit = defineEmits(['update:modelValue']);

const phone = useModelWrapper(props, emit);

const isValid = ref();
const handleValidation = val => {
    isValid.value = val.valid;
};

const inputRef = ref();
defineExpose({
    inputRef,
});
</script>

<template>
    <div :class="widthClass ? widthClass : 'w-full'">
        <div class="flex items-center justify-between pl-0.5">
            <label v-if="label" class="text-sm font-medium text-[var(--label)]">{{ label }} </label>
            <span v-if="required" class="text-xs font-medium text-greySecondary mr-1">Required</span>
        </div>
        <div class="mt-1">
            <vue-tel-input
                ref="inputRef"
                v-model="phone"
                mode="international"
                :auto-format="false"
                default-country="GB"
                :input-options="{ placeholder }"
                class="text-secondary"
                :class="{
                    error: isValid === false,
                    'focus:ring-[var(--input-danger-color)] focus:border-[var(--input-danger-color)]': error,
                    'focus:ring-1 focus:ring-[var(--input-ring-focus)]': !error,
                    'input-disabled': disabled,
                }"
                :disabled="disabled"
                @validate="handleValidation"
            ></vue-tel-input>
        </div>
        <p v-if="isValid === false || error" id="tel-input-error" class="mt-1 text-xs font-medium text-[var(--input-danger-color)] animate__animated animate__headShake flex items-center gap-1">
            <span class="pt-0.5"><i class="fi fi-rr-triangle-warning"></i></span>
            {{ error ? error : 'Number provided is invalid' }}
        </p>
    </div>
</template>

<style lang="scss">
.vue-tel-input {
    @apply w-full rounded-lg shadow-sm border border-[var(--input-border)]  focus-within:border-[var(--input-border-focus)] focus-within:ring-1 focus-within:ring-[var(--input-ring-focus)] h-9;

    &.error {
        @apply focus-within:ring-red-600 focus-within:border-red-600 border-red-600;
    }

    .vti__dropdown {
        background-color: #fff;
        @apply rounded-l-lg;
    }

    .vti__dropdown {
        padding: 0.5rem 0 0.5rem 0.5rem;
    }

    .vti__input {
        padding-left: 0.5rem;
        @apply rounded-r-lg sm:text-sm;
        &:focus {
            @apply border-none outline-none;
            box-shadow: 0 0 #0000;
        }
    }
}

// Disabled style
.input-disabled:focus {
    border: none;
}
.input-disabled {
    border: 1px solid #e6e6e6 !important;
    color: #7f7d83 !important;
    cursor: not-allowed;
}
.input-disabled > input {
    background-color: #f9f9f9 !important;
}
.input-disabled > .vti__dropdown {
    background-color: #f9f9f9 !important;
}
</style>
