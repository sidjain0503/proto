<script setup>
import { Listbox, ListboxButton, ListboxLabel, ListboxOption, ListboxOptions } from '@headlessui/vue';
import useModelWrapper from '@/composables/useModelWrapper.js';
import { computed, ref } from 'vue';

const props = defineProps({
    displayField: String,
    valueField: String,
    label: String,
    modelValue: [Object, String, Number],
    options: {
        type: Array,
        default: () => [],
    },
    emptyOptionsMessage: String,
    widthClass: String,
    error: String,
    disabled: Boolean,
    required: {
        type: Boolean,
        default: true,
    },
    showRequired: {
        type: Boolean,
        default: true,
    },
    placeholder: String,
    maxHeight: String,
    search: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(['update:modelValue']);
const selected = useModelWrapper(props, emit);

const searchQuery = ref('');
const isOpen = ref(false);
const hoveredIndex = ref(-1);

const selectedOption = computed(() => {
    if (props.options && props.options.length) {
        if (props.valueField) {
            return props.options.find(option => option[props.valueField] === selected.value);
        }
        return selected.value;
    }
    return null;
});

const filteredOptions = computed(() => {
    if (!props.search || !searchQuery.value.trim()) {
        return props.options;
    }

    const query = searchQuery.value.toLowerCase().trim();
    return props.options.filter(option => {
        const searchText = props.displayField ? option[props.displayField]?.toString().toLowerCase() : option?.toString().toLowerCase();
        return searchText?.includes(query);
    });
});

const deselect = () => {
    emit('update:modelValue', null);
};

const handleSearchFocus = () => {
    isOpen.value = true;
    hoveredIndex.value = -1;
};

const handleSearchBlur = () => {
    if (hoveredIndex.value === -1) {
        isOpen.value = false;
        searchQuery.value = '';
    }
};

const handleOptionSelect = value => {
    selected.value = value;
    isOpen.value = false;
    searchQuery.value = '';
    hoveredIndex.value = -1;
};

const handleListboxClose = () => {
    isOpen.value = false;
    if (props.search) {
        searchQuery.value = '';
    }
    hoveredIndex.value = -1;
};

const handleOptionHover = index => {
    if (props.search) {
        hoveredIndex.value = index;
    }
};

const handleOptionLeave = () => {
    if (props.search) {
        hoveredIndex.value = -1;
    }
};

// Display value for search input placeholder when something is selected
const displayValue = computed(() => {
    if (!selectedOption.value) return '';
    return props.displayField ? selectedOption.value[props.displayField] : selectedOption.value;
});

const inputRef = ref();
defineExpose({
    inputRef,
});
</script>

<template>
    <Listbox v-model="selected" as="div" :class="widthClass ? widthClass : 'w-full'" @update:modelValue="value => emit('update:modelValue', value)">
        <ListboxLabel v-if="label" class="text-sm font-semibold flex items-center justify-between px-0.5 mb-1">
            {{ label }}
            <span v-if="required && showRequired" class="text-xs font-medium text-greySecondary">Required</span>
        </ListboxLabel>
        <div class="relative">
            <!-- Search Input (when search is enabled) -->
            <template v-if="search">
                <div class="relative">
                    <input
                        v-model="searchQuery"
                        type="text"
                        :disabled="disabled || !options.length"
                        :placeholder="displayValue || placeholder"
                        class="bg-white relative h-9 w-full border rounded-lg shadow-sm text-sm pl-3 pr-10 py-1 !text-[var(--input-text)] focus:outline-none focus:ring-1"
                        :class="{
                            'focus:!ring-[var(--input-danger-color)] focus:border-[var(--input-danger-color)] ': error,
                            'border-[var(--input-border)] focus:ring-[var(--input-ring-focus)] focus:border-[var(--input-border-focus)]': !error,
                            'input-disabled': disabled,
                            'placeholder-[var(--input-text)]': displayValue,
                        }"
                        @focus="handleSearchFocus"
                        @blur="handleSearchBlur"
                        @click="handleSearchFocus"
                    />
                    <span class="absolute inset-y-0 right-0 flex items-center pr-2 gap-1">
                        <span v-if="selectedOption && !disabled && !required" class="h-4 w-4 leading-4 text-gray-400 material-icons cursor-pointer" @mousedown.stop="deselect"> cancel </span>
                        <span class="h-5 w-5 leading-5 text-gray-400 material-icons pointer-events-none" aria-hidden="true"> unfold_more </span>
                    </span>
                </div>
            </template>

            <!-- Regular ListboxButton (when search is disabled) -->
            <ListboxButton
                v-else
                ref="inputRef"
                :disabled="disabled || !options.length"
                class="bg-white relative h-9 w-full border rounded-lg shadow-sm text-sm pl-3 pr-10 py-1 !text-[var(--input-text)] text-left cursor-default focus:outline-none focus:ring-1 sm:text-sm"
                :class="{
                    'focus:!ring-[var(--input-danger-color)] focus:border-[var(--input-danger-color)] ': error,
                    'border-[var(--input-border)] focus:ring-[var(--input-ring-focus)] focus:border-[var(--input-border-focus)]': !error,
                    'input-disabled': disabled,
                }"
            >
                <span v-if="!options.length" :class="'opacity-50 text-sm'">
                    {{ emptyOptionsMessage || 'No options available' }}
                </span>
                <span v-else-if="$slots.selected && selectedOption" :class="disabled ? 'opacity-50 text-sm' : ''">
                    <slot name="selected" :selected="selectedOption"></slot>
                </span>
                <span v-else-if="selectedOption" class="block truncate font-medium" :class="disabled ? 'opacity-50 text-sm' : ''">
                    {{ selectedOption ? (displayField ? selectedOption[displayField] : selected) : '' }}
                </span>
                <span v-else class="block truncate text-[var(--placeholder)] text-sm">{{ placeholder || '' }}</span>
                <span class="absolute inset-y-0 right-0 flex items-center pr-2 gap-1">
                    <span v-if="selectedOption && !disabled && !required" class="h-4 w-4 leading-4 text-gray-400 material-icons" @mousedown.stop="deselect"> cancel </span>
                    <span class="h-5 w-5 leading-5 text-gray-400 material-icons pointer-events-none" aria-hidden="true"> unfold_more </span>
                </span>
            </ListboxButton>
            <p v-if="error" class="mt-1 text-xs font-medium text-[var(--input-danger-color)] animate__animated animate__headShake flex items-center gap-1">
                <span class="pt-0.5"><i class="fi fi-rr-triangle-warning"></i></span>
                {{ error }}
            </p>
            <transition leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100" leave-to-class="opacity-0" @after-leave="handleListboxClose">
                <ListboxOptions
                    v-show="(search && isOpen) || !search"
                    :class="maxHeight"
                    class="absolute mt-1 z-10 w-full bg-white shadow-lg max-h-60 rounded-md ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none text-sm"
                    :static="search"
                >
                    <ListboxOption
                        v-for="(option, index) in filteredOptions"
                        :key="valueField ? option[valueField] : typeof option === 'object' ? option.id : option"
                        v-slot="{ active, selected }"
                        as="template"
                        :value="valueField ? option[valueField] : option"
                        @click="handleOptionSelect(valueField ? option[valueField] : option)"
                    >
                        <li
                            :class="[
                                (search ? hoveredIndex === index : active) ? 'text-white bg-[--input-border-focus] active' : 'text-gray-900',
                                'cursor-default font-medium select-none relative py-2 pl-3 pr-9',
                            ]"
                            @mouseenter="handleOptionHover(index)"
                            @mouseleave="handleOptionLeave"
                        >
                            <span v-if="$slots.option">
                                <slot name="option" :option="option" :active="search ? hoveredIndex === index : active"></slot>
                            </span>
                            <span v-else :class="[selected ? 'font-semibold' : 'font-medium', 'block truncate']">
                                {{ displayField ? option[displayField] : option }}
                            </span>
                            <span
                                v-if="selected"
                                :class="[(search ? hoveredIndex === index : active) ? 'text-white' : 'text-[--input-border-focus]', 'absolute inset-y-0 right-0 flex items-center pr-4']"
                            >
                                <span class="h-5 w-5 text-sm material-icons" aria-hidden="true">check</span>
                            </span>
                        </li>
                    </ListboxOption>

                    <!-- No Results Message -->
                    <div v-if="search && filteredOptions.length === 0 && options.length > 0" class="px-3 py-2 text-sm text-gray-500 text-center">No results found</div>
                </ListboxOptions>
            </transition>
        </div>
    </Listbox>
</template>

<style lang="scss" scoped>
span:empty:before {
    content: '\200b';
}
.input-disabled {
    border: 1px solid #e6e6e6 !important;
    color: #7f7d83 !important;
    cursor: not-allowed !important;
    background-color: #f9f9f9 !important;
}
</style>
