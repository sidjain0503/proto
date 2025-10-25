<script setup>
import { ref, toRefs, onMounted, onUnmounted, computed } from 'vue';
import useModelWrapper from '@/composables/useModelWrapper.js';
const props = defineProps({
    modelValue: Blob,
    allowed: {
        type: Array,
        default: () => ['jpg', 'png', 'jpeg', 'pdf', 'json'],
    },
    instructions: {
        type: String,
    },
    required: {
        type: Boolean,
    },
    showValidation: {
        type: Boolean,
    },
    maxSize: Number,
    showAsButton: {
        type: Boolean,
        default: false,
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    buttonText: {
        type: String,
    },
    isFolder: {
        type: Boolean,
        default: false,
    },
    buttonVariant: {
        type: String,
    },
});
const { allowed, required, disabled, buttonText, isFolder, buttonVariant } = toRefs(props);
const emit = defineEmits(['update:modelValue']);
const file = useModelWrapper(props, emit);
const input = ref(null);
const error = ref('');
const showFileChooser = () => {
    input.value.click();
};
const fileTypes = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', pdf: 'application/pdf', csv: 'text/csv', folder: 'folder', json: 'application/json' };
const validFileTypes = allowed.value.map(type => fileTypes[type]);
const errorMsg = computed(() => {
    if (error.value) return error.value;
    if (required.value && !file.value) return `File is required`;
    return '';
});

const setFile = e => {
    error.value = '';
    if (!props.isFolder) {
        const fileInput = e.target.files[0];

        if (allowed.value.length === 1 && allowed.value[0] === '*') {
            file.value = fileInput;
            return;
        }
        if (validFileTypes.indexOf(fileInput.type) === -1) {
            error.value = 'Selected file format is not supported. Please select another file';
            return;
        }
        if (props.maxSize && Number(fileInput.size) > Number(props.maxSize)) {
            error.value = `Uploaded file exceeds ${props.maxSize / 1000000}MB. Please try again with a different document.`;
            return;
        }
        const validExtension = new RegExp(`(.*?).(${allowed.value.join('|')})$`);
        if (!validExtension.test(fileInput.name.toLowerCase())) {
            error.value = 'Please select correct file format';
            return;
        }
        file.value = fileInput;
        console.log('e', e);
    } else {
        file.value = e.target.files;
        console.log('file', file.value);
    }
};

const onDrop = e => {
    setFile({ target: e.dataTransfer });
};

const preventDefaults = e => {
    e.preventDefault();
};
const events = ['dragenter', 'dragover', 'dragleave', 'drop'];
const remove = () => {
    file.value = null;
    input.value.value = null;
};
onMounted(() => {
    events.forEach(eventName => {
        document.body.addEventListener(eventName, preventDefaults);
    });
});
onUnmounted(() => {
    events.forEach(eventName => {
        document.body.removeEventListener(eventName, preventDefaults);
    });
});
</script>

<template>
    <div>
        <input ref="input" class="hidden" type="file" name="image" :accept="!isFolder ? allowed.join(',') : ''" @change="setFile" :webkitdirectory="isFolder" />
        <div v-if="showAsButton" class="w-full">
            <Button
                :text="buttonText ? buttonText : 'Upload File'"
                :variant="buttonVariant ? buttonVariant : 'success'"
                :action="showFileChooser"
                size="md"
                :disabled="disabled"
                icon="fi-rr-file-upload"
            ></Button>
        </div>
        <div v-else class="w-full">
            <div class="flex justify-center px-6 pt-6 pb-6 border-2 border-gray-300 border-dashed rounded-md" @drop.prevent="onDrop">
                <div class="space-y-1 text-center">
                    <svg class="w-12 h-12 mx-auto text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                        <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                    </svg>
                    <div class="flex text-sm text-gray-600 justify-center">
                        <label
                            for="file-upload"
                            class="relative font-medium text-blue-600 bg-white rounded-md cursor-pointer focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 hover:text-blue-500"
                        >
                            <span class="cursor-pointer" @click="showFileChooser">Upload a file</span>
                        </label>
                        <p class="pl-1">or drag and drop</p>
                    </div>
                    <div v-if="file">
                        <small>{{ file.name }}</small> <a class="ml-2 text-sm font-medium text-blue-600 cursor-pointer" herf="" title="Remove file" @click="remove()">Remove</a>
                    </div>
                    <p class="text-xs text-gray-500">{{ instructions }}</p>
                </div>
            </div>
        </div>
        <p v-if="showValidation && errorMsg" class="mt-2 text-xs text-red-600">{{ errorMsg }}</p>
    </div>
</template>
