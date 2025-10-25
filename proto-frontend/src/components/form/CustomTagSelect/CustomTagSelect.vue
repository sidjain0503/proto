<script setup>
import { ref, computed, defineProps, defineEmits, watch } from 'vue';
import { Combobox, ComboboxButton, ComboboxInput, ComboboxLabel, ComboboxOption, ComboboxOptions } from '@headlessui/vue';
import { debounce } from '@/utils/helpers.js';
import useModelWrapper from '@/composables/useModelWrapper.js';
// import Cab9Tag from '@/components/cab9Tag/Cab9Tag.vue';

const props = defineProps({
    debounceDuration: {
        type: Number,
        default: 0,
    },
    displayField: String,
    label: String,
    placeholder: String,
    modelValue: Object,
    options: {
        type: Array,
        required: true,
    },
    widthClass: String,
    disabled: Boolean,
    emptyOptionsMessage: {
        type: String,
        default: 'No tags available',
    },
});

const query = ref('');
const emit = defineEmits(['update:modelValue']);
const selectedOptions = useModelWrapper(props, emit);
const unselectedOptions = computed(() => {
    return props.options.filter(option => !selectedOptions.value.some(selectedOption => selectedOption.Id === option.Id));
});

// Search logic
const visibleOptions = computed(() => {
    if (query.value) {
        return unselectedOptions.value.filter(option => option[props.displayField].toLowerCase().includes(query.value.toLowerCase()));
    }
    return unselectedOptions.value;
});

const deselectOption = option => {
    selectedOptions.value = selectedOptions.value.filter(elem => elem.Id !== option.Id);
};

const inputBox = ref('');
const searchBtn = ref();
const showOptionsHandler = () => {
    searchBtn.value.$el.click();
    query.value = null;
};

// Debounce logic
watch(
    query,
    debounce(value => {
        query.value = value;
    }, props.debounceDuration),
);
</script>

<template>
    <Combobox v-model="selectedOptions" as="div" :class="widthClass ? widthClass : 'w-full'" multiple>
        <ComboboxLabel v-if="label" class="text-sm font-medium text-[var(--label)] flex items-center justify-between px-0.5 mb-1">
            {{ label }}
            <span v-if="required" class="text-xs font-medium text-greySecondary">Required</span>
        </ComboboxLabel>
        <div class="relative rounded-lg border border-[var(--input-border)] focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-sm bg-white">
            <div v-if="selectedOptions.length" class="flex flex-wrap gap-1 m-1 mr-8">
                <div v-for="option in selectedOptions" :key="option.Id" class="flex rounded-md items-center bg-gray-200 pr-2 min-h-[1.5rem]">
                    <!-- <Cab9Tag :tag-name="displayField ? option[displayField] : option" :tag-icon="option?.Icon" :type="option?.Type" class="pr-0" /> -->
                    <span class="flex items-center cursor-pointer" @click="deselectOption(option)"><i class="fi fi-rr-cross-circle text-gray-600"></i></span>
                </div>
            </div>

            <ComboboxInput
                ref="inputBox"
                class="w-full py-2 pl-3 pr-10 h-[35px] text-sm border-none focus:outline-none bg-transparent focus:ring-0 disabled:cursor-not-allowed"
                :display-value="() => null"
                :placeholder="!options.length ? emptyOptionsMessage : placeholder"
                autocomplete="off"
                :disabled="disabled || !options.length"
                @input="query = $event.target.value"
                @focus="showOptionsHandler"
            />

            <ComboboxButton ref="searchBtn" class="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none" :disabled="disabled">
                <slot name="icon"></slot>
                <span v-if="query" class="h-5 w-5 leading-5 text-gray-400 material-icons pointer-events-none" aria-hidden="true"> unfold_more </span>
                <i v-else-if="!query && options.length" class="fi fi-rr-search w-5 text-gray-400"></i>
            </ComboboxButton>

            <ComboboxOptions
                v-show="visibleOptions.length > 0"
                class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none text-sm"
            >
                <ComboboxOption v-for="option in visibleOptions" :key="option.Id" v-slot="{ active, selected }" :value="option" as="template" @click="showOptionsHandler">
                    <li :class="['relative cursor-default select-none py-2 pl-3 pr-9', active ? 'bg-blue-600 text-white' : 'text-gray-900']">
                        <span v-if="$slots.option">
                            <slot name="option" :option="option"></slot>
                        </span>

                        <p v-else :class="['flex items-center justify-between gap-4 truncate', selected && 'font-semibold']">
                            <span class="flex items-center gap-2">
                                <span>
                                    {{ option?.Icon || '-' }}
                                </span>
                                {{ option[displayField] }}
                            </span>

                            <span class="absolute right-3 bg-red-500 px-1.5 rounded-md text-white font-bold text-xs py-1 w-6 text-center">{{
                                option?.Type ? option.Type?.charAt(0).toUpperCase() : '-'
                            }}</span>
                        </p>
                    </li>
                </ComboboxOption>
            </ComboboxOptions>
        </div>
    </Combobox>
</template>
