<script setup>
import useModelWrapper from '@/composables/useModelWrapper';
import Datepicker from '@vuepic/vue-datepicker';

const props = defineProps({
    modelValue: Array,
    label: String,
});

const emit = defineEmits(['update:modelValue']);
const dateRange = useModelWrapper(props, emit);
</script>

<template>
    <div class="flex flex-col">
        <label v-if="label" class="text-sm font-medium text-[var(--label)] flex items-center justify-between px-0.5 mb-1">{{ label }} </label>
        <Datepicker v-model="dateRange" week-numbers format="dd/MM/yyyy" auto-apply :clearable="false" :enable-time-picker="false" range class="date-range-picker" />
    </div>
</template>

<style lang="scss">
.date-range-picker {
    .dp__input {
        @apply rounded-md shadow-sm border border-gray-300;
        padding: 0.3125rem 0.75rem 0.3125rem 2.25rem;
    }
}
</style>
