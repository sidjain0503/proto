<script setup>
import { computed } from 'vue';
import Badge from '@/components/badges/Badge.vue';

const props = defineProps({
    status: {
        type: String,
    },
});

const statusVariants = {
    FAILED: { text: 'Failed', color: 'red-500', bgColor: 'red-100' },
    NO: { text: 'No', color: 'red-500', bgColor: 'red-100' },
    WARNING: { text: 'Warning', color: 'yellow-500', bgColor: 'yellow-100' },
    PENDING: { text: 'Pending', color: 'yellow-500', bgColor: 'yellow-100' },
    SCHEDULED: { text: 'Scheduled', color: 'blue-600', bgColor: 'blue-100' },
    TEST: { text: 'Test', color: 'blue-600', bgColor: 'blue-100' },
    RUNNING: { text: 'Running', color: 'sky-500', bgColor: 'sky-100' },
    CANCELLED: { text: 'Cancelled', color: 'red-500', bgColor: 'red-100' },
    ARCHIVED: { text: 'Archived', color: 'red-500', bgColor: 'red-100' },
    RETIRED: { text: 'Retired', color: 'red-500', bgColor: 'red-100' },
    SUCCESS: { text: 'Success', color: 'green-700', bgColor: 'green-100' },
    PROD: { text: 'Prod', color: 'green-700', bgColor: 'green-100' },
    APPROVED: { text: 'Approved', color: 'green-700', bgColor: 'green-100' },
    SKIPPED: { text: 'Skipped', color: 'gray-500', bgColor: 'gray-100' },
    CREATED: { text: 'Created', color: 'gray-500', bgColor: 'gray-100' },
    DISABLED: { text: 'Disabled', color: 'yellow-500', bgColor: 'yellow-100' },
    ACTIVE: { text: 'Active', color: 'green-700', bgColor: 'green-100' },
    YES: { text: 'Yes', color: 'green-700', bgColor: 'green-100' },
    MANUAL: { text: 'Manual', color: 'indigo-500', bgColor: 'indigo-100' },

    TRANSFER_APPROVED: { text: 'APPROVED', color: 'green-700', bgColor: 'green-100' },
    DRAFT: { text: 'DRAFT', color: 'gray-500', bgColor: 'gray-100' },
    NEW: { text: 'NEW', color: 'blue-600', bgColor: 'blue-100' },
    REJECTED: { text: 'REJECTED', color: 'red-500', bgColor: 'red-100' },
    CONNECTION_SUCCESS: { text: 'CONNECTION_SUCCESS', color: 'sky-500', bgColor: 'sky-100' },
    CONNECTION_FAILED: { text: 'CONNECTION_FAILED', color: 'yellow-600', bgColor: 'yellow-100' },
    COMPLETED: { text: 'COMPLETED', color: 'indigo-700', bgColor: 'indigo-100' },
    FAILED: { text: 'FAILED', color: 'red-500', bgColor: 'red-100' },
    DELIVERED: { text: 'DELIVERED', color: 'green-700', bgColor: 'green-100' },
    PUBLISHED: { text: 'Published', color: 'green-700', bgColor: 'green-100' },
    FOUND: { text: 'FOUND', color: 'green-700', bgColor: 'green-100' },
    NOT_FOUND: { text: 'NOT_FOUND', color: 'red-500', bgColor: 'red-100' },
    TRUE: { text: 'True', color: 'green-700', bgColor: 'green-100' },
    FALSE: { text: 'False', color: 'red-500', bgColor: 'red-100' },
};

const status = computed(() => {
    if (!props.status || !statusVariants[props.status]) {
        return {
            text: 'No Status',
            color: 'gray-500',
            bgColor: 'gray-100',
        };
    }
    return statusVariants[props.status];
});
</script>

<template>
    <Badge :text="status.text" :hideRemoveButton="true" :color="status.color" :background-color="status.bgColor" class="w-fit" />
</template>
