<script setup>
import VueCropper from 'vue-cropperjs';
import 'cropperjs/dist/cropper.css';
import { ref } from 'vue';
import Modal from '@/components/Modal.vue';
import DropperArea from './DropperArea.vue';

const imgSrc = ref('');
const fileUploaded = ref();
const cropper = ref(null);

const props = defineProps({
    upload: Function,
    open: Boolean,
});

const uploadImage = async () => {
    // get image data for post processing, e.g. upload or setting image src
    const blob = await new Promise(resolve => {
        cropper.value.getCroppedCanvas().toBlob(resolve, fileUploaded.value.type);
    });

    const formData = new FormData();
    const file = new File([blob], 'image', { type: fileUploaded.value.type });
    formData.append('file', file);

    await props.upload(formData);
    emit('update:open', false);
};

const error = ref('');
const setImage = e => {
    error.value = '';
    const file = e.target.files[0];
    fileUploaded.value = file;

    if (file.type.indexOf('image/') === -1) {
        error.value = 'Please select an image file';
        return;
    }

    const validExtension = new RegExp('(.*?).(jpg|png|jpeg)$');
    if (!validExtension.test(file.name.toLowerCase())) {
        error.value = 'Please select correct image format';
        return;
    }

    if (typeof FileReader === 'function') {
        const reader = new FileReader();

        reader.onload = event => {
            imgSrc.value = event.target.result;
            // rebuild cropperjs with the updated source
            cropper.value.replace(event.target.result);
        };

        reader.readAsDataURL(file);
    } else {
        alert('Sorry, FileReader API not supported');
    }
};

const input = ref(null);
const showFileChooser = () => {
    input.value.click();
};

const emit = defineEmits(['update:open']);

const close = () => {
    emit('update:open', false);
};
</script>

<template>
    <Modal v-if="open" title="Upload Image" @close="close">
        <template #body>
            <input ref="input" class="hidden" type="file" name="image" accept="image/*" @change="setImage" />
            <div>
                <section class="w-full pt-4">
                    <div :class="{ 'invisible h-0 p-0': !imgSrc }" class="img-cropper">
                        <VueCropper ref="cropper" class="max-h-[36rem]" :aspect-ratio="1 / 1" :src="imgSrc" />
                    </div>
                    <div v-if="error">
                        <span class="text-red font-semibold">{{ error }}</span>
                    </div>
                    <div v-if="!imgSrc" class="flex justify-center">
                        <DropperArea @files-dropped="files => setImage({ target: { files } })" @upload-files="showFileChooser" />
                    </div>
                </section>
            </div>
        </template>
        <template #footer>
            <div v-if="imgSrc" class="flex justify-end gap-x-2">
                <Button text="Change" variant="outline" :action="showFileChooser"> </Button>
                <Button text="Upload" :async="true" :action="uploadImage"> </Button>
            </div>
        </template>
    </Modal>
</template>
