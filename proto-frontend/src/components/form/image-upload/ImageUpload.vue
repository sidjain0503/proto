<script setup>
import { ref } from 'vue';
import UploadScreen from './UploadScreen.vue';

defineProps({
    upload: Function,
    url: String,
    disabled: Boolean,
    buttonText: {
        type: String,
        default() {
            return 'Change';
        },
    },
});

const showUploadScreen = ref(false);
const triggerUpload = () => {
    showUploadScreen.value = true;
};
</script>

<template>
    <div>
        <label class="block text-sm font-medium text-[var(--label)] pl-0.5">Photo</label>
        <div class="mt-1 flex items-center gap-x-4">
            <img v-if="url" class="inline-block h-12 w-12 rounded-full" style="object-fit: cover" :src="url" />
            <span v-else class="inline-block h-12 w-12 overflow-hidden rounded-full bg-gray-100">
                <svg class="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            </span>

            <Button :text="buttonText" variant="outline" :action="triggerUpload" :disabled="disabled"></Button>
        </div>
        <UploadScreen v-model:open="showUploadScreen" :upload="upload" />
    </div>
</template>
