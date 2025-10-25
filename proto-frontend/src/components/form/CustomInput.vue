<script setup>
import { ref, useSlots, onMounted, onBeforeUnmount } from 'vue';
import useModelWrapper from '../composables/useModelWrapper';
const slots = useSlots();

const props = defineProps({
    error: String,
    icon: String,
    label: String,
    placeholder: String,
    inputType: {
        type: String,
        default: 'text',
    },
    modelValue: [String, Number],
    widthClass: String,
    disabled: Boolean,
    cleaveConfig: Object,
    required: Boolean,
    units: {
        type: String,
    },
    step: String,
    id: String,
    masked: Boolean,
    doNotAutoFill: Boolean,
    rows: Number,
    prefixText: String,
    showPasswordViewOnDisabled: Boolean,
});

const emit = defineEmits(['update:modelValue', 'enterKeyPress']);
const userInput = useModelWrapper(props, emit);
const showHelp = ref(false);
const handleFocus = () => {
    showHelp.value = !showHelp.value;
};
const handleBlur = () => {
    showHelp.value = !showHelp.value;
};

// For password inputs or masked value given as true
const isValueVisible = ref(false);
const handleVisibility = () => {
    isValueVisible.value = !isValueVisible.value;
};
const inputRef = ref();
const handleKeyPress = event => {
    if (event.key === 'Enter') {
        emit('enterKeyPress');
    }
};
defineExpose({
    inputRef,
});

onMounted(() => {
    inputRef.value?.addEventListener('keypress', handleKeyPress);
});

onBeforeUnmount(() => {
    inputRef.value?.removeEventListener('keypress', handleKeyPress);
});
</script>

<template>
    <div :class="widthClass ? widthClass : 'w-full'" class="border-none p-0">
        <div class="flex items-center justify-between pl-0.5">
            <label v-if="label" class="text-sm font-semibold flex items-center gap-x-2"
                >{{ label }}
                <VTooltip v-if="slots.tooltip" delay="0" class="hidden md:block">
                    <div class="cursor-pointer flex items-center justify-center">
                        <i class="text-xs fi fi-rr-square-info text-gray-700"></i>
                    </div>
                    <template #popper>
                        <slot name="tooltip" class="w-24"></slot>
                    </template>
                </VTooltip>
            </label>
            <span v-if="required" class="text-xs font-medium text-greySecondary mr-1 ml-auto">Required</span>
        </div>
        <slot name="description"></slot>
        <div v-if="inputType !== 'search'" :class="label ? 'mt-1' : 'mt-0'" class="relative rounded-lg shadow-sm">
            <div v-if="icon" class="absolute rounded-l-lg inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span class="h-5 w-5 text-gray-400 material-icons leading-5" aria-hidden="true">{{ icon }}</span>
            </div>
            <input
                v-if="cleaveConfig && inputType !== 'password'"
                :id="id"
                ref="inputRef"
                v-model="userInput"
                v-cleave="cleaveConfig"
                :disabled="disabled"
                :type="inputType"
                :class="[error ? 'focus:border-red-600 focus:!ring-red-600' : 'focus:border-[var(--input-border-focus)] focus:ring-[var(--input-ring-focus)]']"
                class="w-full text-sm rounded-lg px-3 py-2 placeholder-[var(--placeholder)] text-[--input-text] h-9 bg-[#ffffff] border-[var(--input-border)] focus:border-[var(--input-border-focus)] focus:ring-[var(--input-ring-focus)]"
                :placeholder="placeholder"
            />
            <div v-else-if="(masked && doNotAutoFill) || (inputType === 'password' && doNotAutoFill)">
                <div v-if="!userInput">
                    <input
                        :id="id"
                        ref="inputRef"
                        v-model="userInput"
                        v-cleave="cleaveConfig"
                        :disabled="disabled"
                        :type="inputType"
                        :class="error ? 'focus:border-red-600 focus:!ring-red-600' : 'focus:border-[var(--input-border-focus)] focus:ring-[var(--input-ring-focus)]'"
                        class="w-full text-sm rounded-lg px-3 py-2 placeholder-[var(--placeholder)] text-[--input-text] h-9 bg-[#ffffff] border-[var(--input-border)] focus:border-[var(--input-border-focus)] focus:ring-[var(--input-ring-focus)]"
                        :placeholder="placeholder"
                    />
                </div>
                <div v-else-if="userInput.length > 0">
                    <input
                        ref="inputRef"
                        v-model="userInput"
                        :disabled="disabled"
                        autofocus
                        :type="isValueVisible ? 'text' : 'password'"
                        class="w-full text-sm rounded-lg pl-3 pr-8 py-2 placeholder-[var(--placeholder)] text-[--input-text] h-9 bg-[#ffffff] border-[var(--input-border)]"
                        :class="{
                            'pl-10': icon,
                            'focus:border-red-600 focus:!ring-red-600': error,
                            'focus:border-[var(--input-border-focus)] focus:ring-[var(--input-ring-focus)]': !error,
                        }"
                        :placeholder="placeholder"
                        @focus="handleFocus"
                        @blur="handleBlur"
                    />
                    <div v-if="!disabled || showViewOnDisabled" class="h-full absolute right-3 text-base top-0 flex items-center cursor-pointer" @click="handleVisibility">
                        <i v-if="isValueVisible" class="fi fi-rr-eye-crossed text-gray-500"></i>
                        <i v-else class="fi fi-rr-eye text-gray-500"></i>
                    </div>
                </div>
            </div>
            <div v-else-if="masked || inputType === 'password'">
                <input
                    ref="inputRef"
                    v-model="userInput"
                    :disabled="disabled"
                    :type="isValueVisible ? 'text' : 'password'"
                    class="w-full text-sm rounded-lg pl-3 pr-8 py-2 placeholder-[var(--placeholder)] text-[--input-text] h-9 bg-[#ffffff] border-[var(--input-border)]"
                    :class="{
                        'pl-10': icon,
                        'focus:border-red-600 focus:!ring-red-600': error,
                        'focus:border-[var(--input-border-focus)] focus:ring-[var(--input-ring-focus)]': !error,
                    }"
                    :placeholder="placeholder"
                    @focus="handleFocus"
                    @blur="handleBlur"
                />
                <div v-if="!disabled || showPasswordViewOnDisabled" class="h-full absolute right-3 text-base top-0 flex items-center cursor-pointer" @click="handleVisibility">
                    <i v-if="isValueVisible" class="fi fi-rr-eye-crossed text-gray-500"></i>
                    <i v-else class="fi fi-rr-eye text-gray-500"></i>
                </div>
            </div>
            <textarea
                v-else-if="inputType === 'textarea'"
                v-model="userInput"
                :rows="rows"
                :disabled="disabled"
                :type="inputType"
                class="w-full text-sm rounded-lg pl-3 pr-8 py-2 placeholder-[var(--placeholder)] text-[--input-text] bg-[#ffffff] border-[var(--input-border)]"
                :placeholder="placeholder"
            />
            <div class="inline-flex items-center overflow-hidden w-full" v-else-if="prefixText">
                <span class="px-2 py-1.5 bg-gray-100 text-gray-600 border border-r-0 border-gray-300 rounded-l-lg h-9 flex items-center">
                    {{ prefixText }}
                </span>
                <input
                    :id="id"
                    ref="inputRef"
                    v-model="userInput"
                    :step="step"
                    :disabled="disabled"
                    :type="inputType"
                    :class="[
                        'w-full text-sm rounded-r-lg font-medium px-3 py-2 placeholder-[var(--placeholder)] text-[--input-text] h-9 bg-[#ffffff] border-[var(--input-border)]',
                        error ? 'focus:border-red-600 focus:!ring-red-600' : 'focus:border-[var(--input-border-focus)] focus:ring-[var(--input-ring-focus)]',
                    ]"
                    :placeholder="placeholder"
                    @focus="handleFocus"
                    @blur="handleBlur"
                />
            </div>
            <input
                v-else
                :id="id"
                ref="inputRef"
                v-model="userInput"
                :step="step"
                :disabled="disabled"
                :type="inputType"
                :class="error ? 'focus:border-red-600 focus:!ring-red-600' : 'focus:border-[var(--input-border-focus)] focus:ring-[var(--input-ring-focus)]'"
                class="w-full text-sm rounded-lg px-3 py-2 placeholder-[var(--placeholder)] text-[--input-text] h-9 bg-[#ffffff] border-[var(--input-border)]"
                :placeholder="placeholder"
                @focus="handleFocus"
                @blur="handleBlur"
            />
            <span v-if="units" class="absolute top-2 right-8 font-semibold text-sm">{{ units }}</span>

            <div v-if="slots.help && showHelp" class="absolute mt-1 z-50 bg-gray-800 p-2 text-sm text-white rounded-lg shadow-md font-medium">
                <slot name="help"></slot>
            </div>
        </div>

        <!-- Input type search styles  -->
        <div v-else-if="inputType === 'search'" class="mt-1 relative rounded-lg shadow-sm">
            <span class="text-[12px] absolute flex items-center justify-center h-full w-7 rounded-l-lg text-[var(--placeholder)]">
                <i class="fi fi-rr-search"></i>
            </span>
            <input
                :id="id"
                ref="inputRef"
                v-model="userInput"
                :step="step"
                :disabled="disabled"
                :type="inputType"
                :class="error ? 'focus:border-red-600 focus:!ring-red-600' : 'focus:border-[var(--input-border-focus)] focus:ring-[var(--input-ring-focus)]'"
                class="w-full text-sm rounded-lg pr-3 pl-7 py-2 placeholder-[var(--placeholder)] text-[--input-text] h-9 bg-[#ffffff] border-[var(--input-border)]"
                :placeholder="placeholder"
                @focus="handleFocus"
                @blur="handleBlur"
            />
            <span v-if="units" class="absolute top-2 right-8 font-semibold text-sm">{{ units }}</span>

            <div v-if="slots.help && showHelp" class="absolute mt-1 z-50 bg-gray-800 p-2 text-sm text-white rounded-lg shadow-md font-medium">
                <slot name="help"></slot>
            </div>
        </div>
        <p v-if="error" id="input-error" class="mt-1 text-sm font-medium text-[var(--input-danger-color)] flex items-center gap-1">
            {{ error }}
        </p>
    </div>
</template>

<style scoped>
input:disabled {
    border: 1px solid #e6e6e6 !important;
    color: #7f7d83 !important;
    cursor: not-allowed;
    background-color: #f9f9f9 !important;
}
input[type='search']::-webkit-search-cancel-button {
    display: none;
}
</style>
