<template>
    <div class="max-w-2xl font-sans">
        <button
            class="w-full flex items-center gap-2 px-4 py-3 bg-blue-900 text-white rounded text-left hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            @click="toggleAuditInfo"
        >
            <span class="text-lg">{{ isVisible ? '－' : '＋' }}</span>
            <span>Hide Audit Info</span>
        </button>

        <div v-if="isVisible" class="mt-0.5 border border-gray-200 rounded p-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">Audit Info</h2>

            <div>
                <h3 class="text-xl text-gray-600 font-normal mb-2">Created</h3>
                <p class="text-base text-gray-900">{{ email }}</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

defineProps({
    email: {
        type: String,
        required: true,
        default: 'monik@e9ine.com',
    },
    createdDate: {
        type: Date,
        required: true,
        default: () => new Date('2023-10-31T15:37:00'),
    },
});

const isVisible = ref(true);

const toggleAuditInfo = () => {
    isVisible.value = !isVisible.value;
};
</script>
