<script setup>
import { ref, computed, watchEffect } from 'vue';
import { Combobox, ComboboxButton, ComboboxInput, ComboboxLabel, ComboboxOption, ComboboxOptions } from '@headlessui/vue';
import { debounce } from '@/utils/helpers.js';
import useModelWrapper from '@/composables/useModelWrapper.js';

const props = defineProps({
    debounceDuration: {
        type: Number,
        default: 0,
    },
    displayField: String,
    label: String,
    placeholder: String,
    modelValue: Object,
    maxOptions: {
        type: Number,
        default: 200,
    },
    getOptions: {
        type: Function,
    },
    options: {
        type: Array,
        default: () => [],
    },
    widthClass: String,
    selectedRenderer: Function,
    disabled: Boolean,
    error: String,
    required: Boolean,
});

const query = ref('');

const emit = defineEmits(['update:modelValue']);
const selected = useModelWrapper(props, emit);

const fetchedOptions = ref([]);

watchEffect(() => {
    if (!props.options.length && query.value) {
        debounce(async () => {
            fetchedOptions.value = (await props.getOptions(query.value)) || [];
        }, props.debounceDuration)();
    }
});

const visibleOptions = computed(() => {
    if (props.options.length) {
        let options = props.options;
        if (query.value) {
            options = options.filter(option => option[props.displayField].toLowerCase().includes(query.value.toLowerCase()));
        }
        options = options.slice(0, props.maxOptions);
        return options;
    } else {
        if (query.value) {
            return fetchedOptions.value;
        }
        return [];
    }
});

const inputBox = ref(null);
const focus = () => {
    inputBox.value.$el.focus();
};

const deselect = () => {
    emit('update:modelValue', null);
};

defineExpose({
    focus,
});
</script>

<template>
    <Combobox v-model="selected" as="div" :class="widthClass ? widthClass : 'w-full'">
        <ComboboxLabel v-if="label" class="text-sm font-semibold justify-between flex items-center pl-0.5"
            >{{ label }} <span v-if="required" class="text-xs font-medium text-greySecondary mr-1">Required</span></ComboboxLabel
        >
        <div class="relative mt-1">
            <ComboboxInput
                ref="inputBox"
                class="w-full rounded-lg border border-[var(--input-border)] !text-[var(--input-text)] bg-white py-2 pl-3 pr-10 shadow-sm h-9 focus:outline-none focus:ring-1 text-sm"
                :class="[disabled && 'input-disabled', error ? 'focus:border-red-600 focus:!ring-red-600' : 'focus:border-[var(--input-border-focus)] focus:ring-[var(--input-ring-focus)]']"
                :display-value="option => (selectedRenderer ? selectedRenderer(option) : option && option[displayField])"
                :placeholder="placeholder"
                autocomplete="off"
                :disabled="disabled"
                @change="query = $event.target.value"
            />
            <ComboboxButton class="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none" :disabled="disabled">
                <span v-if="selected && !disabled && !required" class="h-3 w-3 leading-3 text-gray-400 material-icons mr-2" @click.stop="deselect"> cancel </span>
                <slot v-else name="icon"></slot>
                <span class="h-5 w-5 leading-5 text-gray-400 material-icons pointer-events-none" aria-hidden="true"> unfold_more </span>
            </ComboboxButton>

            <ComboboxOptions
                v-if="visibleOptions.length > 0"
                class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
            >
                <ComboboxOption v-for="option in visibleOptions" :key="option.Id" v-slot="{ active, selected }" :value="option" as="template">
                    <li :class="['relative cursor-default select-none py-2 pl-3 pr-9', active ? 'bg-blue-600 text-white' : 'text-gray-900']">
                        <span v-if="$slots.option">
                            <slot name="option" :option="option"></slot>
                        </span>

                        <span v-else :class="['block truncate', selected && 'font-semibold']">
                            {{ option[displayField] }}
                        </span>

                        <span v-if="selected" :class="['absolute inset-y-0 right-0 flex items-center pr-4', active ? 'text-white' : 'text-blue-600']">
                            <span class="h-5 w-5 leading-5 material-icons" aria-hidden="true"></span>
                        </span>
                    </li>
                </ComboboxOption>
            </ComboboxOptions>
            <ComboboxOptions
                v-else
                class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
            >
                <li class="relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900">No results</li>
            </ComboboxOptions>
        </div>
        <p v-if="error" id="input-error" class="mt-1 text-sm font-medium text-[var(--input-danger-color)] flex items-center gap-1">
            {{ error }}
        </p>
    </Combobox>
</template>

<style scoped>
.input-disabled {
    border: 1px solid #e6e6e6 !important;
    color: #7f7d83 !important;
    cursor: not-allowed;
    background-color: #f9f9f9 !important;
}
</style>
