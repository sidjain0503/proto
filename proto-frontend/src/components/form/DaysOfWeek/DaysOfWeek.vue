<script setup>
const props = defineProps({
    modelValue: Array,
    widthClass: String,
    label: String,
    selectable: {
        type: Boolean,
        default: true,
    },
});

const emit = defineEmits(['update:modelValue']);

const updateSelectedDays = clickedDay => {
    if (!props.selectable) return;
    emit(
        'update:modelValue',
        props.modelValue.map(day => {
            if (day.name === clickedDay.name) {
                return { name: day.name, selected: !day.selected };
            }
            return day;
        })
    );
};
</script>

<template>
    <div :class="widthClass ? widthClass : 'w-full'" class="days-of-week">
        <span class="label block text-sm font-medium text-[var(--label)]">{{ label || 'Select Days' }}</span>
        <div class="days-list grid grid-cols-7 gap-2">
            <div
                v-for="day in modelValue"
                :key="day"
                class="day border font-medium text-xs md:text-sm text-center border-gray-300 rounded-md shadow-sm py-1 mt-2 cursor-pointer"
                :class="{ 'bg-blue-600 text-white selected': day.selected }"
                @click="updateSelectedDays(day)"
            >
                {{ day.name }}
            </div>
        </div>
    </div>
</template>
