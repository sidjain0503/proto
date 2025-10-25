<template>
    <form :class="gridClass" class="py-4" @submit.prevent="handleSubmit">
        <!-- Dynamically generate inputs based on schema -->
        <template v-for="field in schema" :key="field.key">
            <slot :name="field.key" :field="field" :value="form[field.key]" :error="errorMessages[field.key]">
                <div v-if="field.type === 'select'" :class="widthClass ? widthClass : 'w-full'" class="border-none p-0">
                    <div class="flex items-center justify-between pl-0.5">
                        <label v-if="field.label" class="text-sm font-medium text-[var(--label)] flex items-center gap-x-2">{{ field.label }} </label>
                        <span v-if="required" class="text-xs font-medium text-greySecondary mr-1 ml-auto">Required</span>
                    </div>
                    <select
                        v-model="form[field.key]"
                        :name="field.label"
                        placeholder="field.placeholder"
                        class="block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm"
                    >
                        <template v-for="(item, index) in field.options" :key="index">
                            <option :value="item">{{ item }}</option>
                        </template>
                    </select>
                </div>
                <Autocomplete
                    v-else-if="field.type === 'autocomplete'"
                    v-model="form[field.key]"
                    :label="field.label"
                    :get-options="field.getOptions"
                    :options="field.options"
                    :display-field="field.displayField"
                    :value-field="field.valueField"
                    :placeholder="field.placeholder"
                    :width-class="widthClass ? widthClass : 'w-full'"
                    :debounce-duration="500"
                    :selected-renderer="driverName"
                    :error="errorMessages[field.key]"
                    :disabled="mode === 'view'"
                >
                </Autocomplete>
                <CustomSelect
                    v-else-if="field.type === 'custom-select'"
                    v-model="form[field.key]"
                    :placeholder="field.placeholder"
                    :label="field.label"
                    :options="field.options"
                    :display-field="field.displayField"
                    :value-field="field.valueField"
                    :disabled="mode === 'view'"
                />
                <CustomInput
                    v-else
                    v-model="form[field.key]"
                    :label="field.label"
                    :input-type="field.type"
                    :placeholder="field.placeholder"
                    :error="errorMessages[field.key]"
                    :rows="field.rows"
                    :disabled="mode === 'view'"
                />
            </slot>
        </template>
    </form>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import CustomInput from '@/components/form/CustomInput.vue';
import Autocomplete from '@/components/form/Autocomplete.vue';
import CustomSelect from '@/components/form/CustomSelect.vue';

const props = defineProps({
    schema: {
        type: Array,
        required: true,
    },
    mode: {
        type: String,
        default: 'edit',
    },
    cols: {
        type: Object, // Example: { default: 1, sm: 2, lg: 3 }
        default: () => ({ default: 2 }),
    },
    onSubmit: {
        type: Function,
        required: true,
    },
});

const data = defineModel('data', { type: Object, required: true });
const isValid = defineModel('isValid', { type: Boolean, default: true });

const form = ref({});

// Watch for changes to schema and reinitialize form
watch(
    () => props.schema,
    newSchema => {
        form.value = {};
        newSchema.forEach(field => {
            form.value[field.key] = data[field.key] || ''; // Prepopulate with data or empty string
        });
    },
    { immediate: true, deep: true }, // Deep watch to track changes in objects
);

// Watch for changes to data and update the form accordingly
watch(
    () => data.value,
    newData => {
        // Only update form if the data has changed
        const hasDifference = Object.keys(newData).some(key => newData[key] !== form.value[key]);

        if (hasDifference) {
            form.value = { ...form.value, ...newData }; // Merge newData into form
        }
    },
    { immediate: true, deep: true },
);

// Compute grid classes based on the provided cols prop
const gridClass = computed(() => {
    let baseClass = `grid gap-8`;
    Object.entries(props.cols).forEach(([screen, colCount]) => {
        baseClass += ` ${screen === 'default' ? `grid-cols-${colCount}` : `${screen}:grid-cols-${colCount}`}`;
    });
    return baseClass;
});

// Create dynamic validation rules from schema
const rules = computed(() => {
    const validationRules = {};
    props.schema.forEach(field => {
        validationRules[field.key] = field.validators;
    });
    return validationRules;
});

const errorMessages = ref({});

// Initialize Vuelidate with dynamic rules
const v$ = useVuelidate(rules, form, { $autoDirty: true });

// Watch for changes to form and sync with data
watch(
    () => form.value,
    async newFormData => {
        await nextTick();

        // Only update data if form has changed
        const hasDifference = Object.keys(newFormData).some(key => newFormData[key] !== data.value[key]);

        if (hasDifference) {
            data.value = { ...newFormData }; // Sync form with data
        }

        // Update error messages (assuming you need this)
        errorMessages.value = {};
        props.schema.forEach(field => {
            errorMessages.value[field.key] = v$.value[field.key].$errors.length ? v$.value[field.key].$errors[0].$message : null;
        });
    },
    { deep: true },
);

// Sync form validity with the parent using defineModel('isValid')
watch(
    () => v$.value.$invalid,
    newInvalidState => {
        isValid.value = !newInvalidState; // Sync validity with parent
    },
    { immediate: true },
);

const validateForm = async () => {
    const result = await v$.value.$validate();
    isValid.value = !v$.value.$invalid;
    return result;
};

defineExpose({ validateForm });

// Form submission handler
const handleSubmit = () => {
    v$.value.$touch(); // Trigger validation
    if (!v$.value.$invalid) {
        props.onSubmit(form.value); // Call the provided submit function with form data
    }
};
</script>

<style lang="css" scoped>
/* Add styles here if needed */
</style>
