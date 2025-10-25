<script setup>
import { onMounted, ref, watch, onUnmounted } from 'vue';
import { Combobox, ComboboxButton, ComboboxInput, ComboboxLabel, ComboboxOption, ComboboxOptions } from '@headlessui/vue';
import { debounce } from '@/utils/helpers.js';
import useModelWrapper from '@/composables/useModelWrapper.js';
import Badge from '@/components/badges/Badge.vue';

const props = defineProps({
    debounceDuration: {
        type: Number,
        default: 0,
    },
    displayField: String,
    label: String,
    placeholder: String,
    modelValue: Object,
    getOptions: {
        type: Function,
        required: true,
    },
    widthClass: String,
    disabled: Boolean,
    error: String,
    defaultOptions: Boolean,
});
const open = ref(false);
const options = ref([]);
const query = ref('');
// const comboboxRef = ref(null);

const emit = defineEmits(['update:modelValue']);
const selectedOptions = useModelWrapper(props, emit);

const deselectOption = option => {
    selectedOptions.value = selectedOptions.value.filter(elem => {
        return elem.id !== option.id;
    });
};

watch(
    query,
    debounce(async searchText => {
        options.value = await props.getOptions(searchText);
    }, props.debounceDuration),
);

const inputBox = ref(null);
const focus = () => {
    inputBox.value.$el.focus();
};
defineExpose({
    focus,
});
const toggleOpen = async () => {
    open.value = !open.value;
    if (open.value) {
        options.value = await props.getOptions();
    }
};

const handleClickOutside = async event => {
    const clickedElement = event.target;
    const currentCombobox = document.getElementById('clickbox');

    if (!currentCombobox.contains(clickedElement) && !clickedElement.closest('.multiselect-search')) {
        if (open.value) {
            options.value = await props.getOptions();
        }
        open.value = false;
    }
};

onMounted(async () => {
    if (props.defaultOptions) {
        options.value = await props.getOptions();
    }
    document.addEventListener('click', handleClickOutside, true);
});

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside, true);
});
</script>

<template>
    <Combobox id="clickbox" v-model="selectedOptions" as="div" :class="[widthClass ? widthClass : 'w-full', 'multiselect-search']" multiple>
        <ComboboxLabel v-if="label" class="block text-sm font-semibold pl-0.5">{{ label }}</ComboboxLabel>
        <div
            class="relative mt-1 rounded-lg shadow-sm border border-[var(--input-border)] focus:outline-none focus:ring-1 focus:ring-[var(--input-ring-focus)] focus:border-[var(--input-border-focus)] bg-white"
        >
            <div v-if="selectedOptions?.length" class="flex flex-wrap gap-1 m-1 mr-8">
                <Badge v-for="option in selectedOptions" :key="option.Id" :text="displayField ? option[displayField] : option" @remove-badge="deselectOption(option)" />
            </div>
            <ComboboxInput
                @click="toggleOpen()"
                ref="inputBox"
                class="w-full rounded-lg !text-[var(--input-text)] bg-white py-2 pl-3 pr-10 h-9 border-none focus:outline-none focus:ring-0 text-sm"
                :placeholder="placeholder"
                autocomplete="off"
                :disabled="disabled"
                :class="disabled && 'input-disabled'"
                @change="query = $event.target.value"
            />
            <ComboboxButton class="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none" :disabled="disabled">
                <slot name="icon"></slot>
                <span class="h-5 w-5 leading-5 text-gray-400 material-icons" aria-hidden="true"> unfold_more</span>
            </ComboboxButton>
            <div v-if="open">
                <ComboboxOptions
                    static
                    v-if="options.length > 0"
                    class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                >
                    <ComboboxOption v-for="option in options" :key="option.id" v-slot="{ active, selected }" :value="option" as="template">
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
                    static
                    v-else
                    class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                >
                    <li class="relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900">No results</li>
                </ComboboxOptions>
            </div>
        </div>
        <p v-if="error" class="mt-1 text-xs font-medium text-[var(--input-danger-color)] animate__animated animate__headShake flex items-center gap-1">
            <span class="pt-0.5"><i class="fi fi-rr-triangle-warning"></i></span>
            {{ error }}
        </p>
    </Combobox>
</template>
