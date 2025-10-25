<template>
    <CustomInput v-model="value" :label="name" :error="errorMessage" />
</template>
<script setup>
import { defineProps } from 'vue';
import { useField } from 'vee-validate';
import CustomInput from '@/components/form/CustomInput.vue';

const props = defineProps({
    name: { type: String, required: true },
});

const { value, errorMessage } = useField(props.name);
</script>
