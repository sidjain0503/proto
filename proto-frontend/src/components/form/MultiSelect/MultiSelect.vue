<script setup>
import { Listbox, ListboxButton, ListboxLabel, ListboxOptions, ListboxOption } from '@headlessui/vue';
import Badge from '@/components/badges/Badge.vue';
import useModelWrapper from '@/composables/useModelWrapper.js';
import { computed } from 'vue';

const props = defineProps({
    displayField: String,
    valueField: String,
    label: String,
    modelValue: Array,
    options: {
        type: Array,
        required: true,
    },
    widthClass: String,
    placeholder: String,
    disabled: Boolean,
    maxHeight: String,
});

const emit = defineEmits(['update:modelValue']);
const selectedOptions = useModelWrapper(props, emit);

const deselectOption = option => {
    if (!props.disabled) {
        selectedOptions.value = selectedOptions.value.filter(elem => {
            return elem[props.valueField || 'Id'] !== option[props.valueField || 'Id'];
        });
    }
};

const visibleOptions = computed(() => {
    return props.options.filter(option => !selectedOptions.value.some(selectedOption => selectedOption[props.valueField || 'Id'] === option[props.valueField || 'Id']));
});
</script>

<template>
    <Listbox v-model="selectedOptions" as="div" :class="widthClass ? widthClass : 'w-full'" multiple>
        <ListboxLabel v-if="label" class="block text-sm font-semibold pl-0.5 mb-1">{{ label }}</ListboxLabel>
        <div class="relative">
            <ListboxButton
                class="bg-white w-full border border-[var(--input-border)] rounded-md shadow-sm pl-3 pr-10 pt-[6px] pb-1 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-[var(--input-ring-focus)] focus:border-[var(--input-border-focus)] text-sm"
                :disabled="disabled"
                :class="disabled && 'input-disabled'"
            >
                <div class="min-h-[1.5rem] flex flex-wrap gap-1" :disabled="disabled">
                    <template v-if="selectedOptions.length">
                        <Badge v-for="option in selectedOptions" :key="option" :text="displayField ? option[displayField] : option" @remove-badge="deselectOption(option)" />
                    </template>
                    <span v-else-if="placeholder" class="text-[var(--placeholder)]">{{ placeholder }}</span>
                </div>
                <span class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <span class="h-5 w-5 leading-5 text-greySecondary material-icons" aria-hidden="true"> unfold_more </span>
                </span>
            </ListboxButton>
            <ListboxOptions :class="maxHeight" class="absolute z-50 mt-1 w-full bg-white shadow-lg max-h-52 rounded-md py-1 ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none text-sm">
                <ListboxOption v-for="option in visibleOptions" :key="option" :value="option">
                    {{ displayField ? option[displayField] : option }}
                </ListboxOption>
            </ListboxOptions>
            <transition leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100" leave-to-class="opacity-0">
                <ListboxOptions
                    :class="maxHeight"
                    class="absolute z-50 mt-1 w-full bg-white shadow-lg max-h-52 rounded-md py-1 ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none text-sm"
                >
                    <ListboxOption v-for="option in visibleOptions" :key="option" v-slot="{ active, selected }" :value="option" as="template">
                        <li :class="[active ? 'text-white bg-blue-600' : 'text-gray-900', 'cursor-default select-none relative py-2 pl-3 pr-9']">
                            <span v-if="$slots.option">
                                <slot name="option" :option="option"></slot>
                            </span>
                            <span v-else :class="[selected ? 'font-semibold' : 'font-normal', 'block truncate']">
                                {{ displayField ? option[displayField] : option }}
                            </span>
                            <span v-if="selected" :class="[active ? 'text-white' : 'text-blue-600', 'absolute inset-y-0 right-0 flex items-center pr-4']">
                                <span class="h-5 w-5 material-icons text-sm" aria-hidden="true">check</span>
                            </span>
                        </li>
                    </ListboxOption>
                </ListboxOptions>
            </transition>
        </div>
    </Listbox>
</template>

<style lang="scss" scoped>
span:empty:before {
    content: '\200b'; // unicode zero width space character
}
.input-disabled {
    border: 1px solid #e6e6e6 !important;
    color: #7f7d83 !important;
    cursor: not-allowed !important;
    background-color: #f9f9f9 !important;
}
</style>
