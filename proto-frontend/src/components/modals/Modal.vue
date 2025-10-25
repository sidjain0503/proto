<script setup>
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue';

defineProps({
    title: {
        type: String,
    },
    showOverflow: {
        type: Boolean, // For overflow-y-visible in body
        default: false,
    },
    size: {
        type: String,
        validator(value) {
            return ['sm', 'md', 'lg', 'xl', '2xl', 'full'].includes(value);
        },
        default: 'md',
    },
    showFooter: {
        type: Boolean,
        default: true,
    },
    saveLabel: {
        type: String,
        default: 'Save',
    },
});

const emit = defineEmits(['close', 'save']);

const close = function () {
    emit('close');
};
</script>

<template>
    <TransitionRoot as="template" :show="true">
        <Dialog as="div" @close="close" @keydown.stop @keyup.stop>
            <div class="modal fixed z-50 top-0 left-0 flex w-screen h-screen md:items-center md:justify-center">
                <TransitionChild
                    as="template"
                    enter="ease-out duration-100"
                    enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    enter-to="opacity-100 translate-y-0 sm:scale-100"
                    leave="ease-in duration-200"
                    leave-from="opacity-100 translate-y-0 sm:scale-100"
                    leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                    <DialogPanel
                        :class="showOverflow ? 'overflow-y-visible' : 'overflow-y-scroll'"
                        class="no-scrollbar h-[100svh] flex flex-col modal-outer-container justify-between md:rounded-lg lg:max-h-[80vh] xl:max-h-[95vh] md:h-auto text-left shadow-xl transition-all sm:my-8 w-full sm:w-11/12"
                        :style="{
                            'max-width':
                                size === 'full'
                                    ? '100%'
                                    : size === '2xl'
                                      ? '1536px'
                                      : size === 'xl'
                                        ? '1280px'
                                        : size === 'lg'
                                          ? '1024px'
                                          : size === 'md'
                                            ? '768px'
                                            : size === 'sm'
                                              ? '480px'
                                              : '640px',
                        }"
                        @keydown.esc="close"
                    >
                        <div class="px-4 py-2 border-b border-zinc-200 w-full flex justify-between items-center md:rounded-t-lg h-12 z-10 bg-white">
                            <DialogTitle as="h3" class="text-lg font-semibold leading-10 text-primary">
                                {{ title }}
                            </DialogTitle>
                            <button class="flex focus:outline-none items-center justify-center pt-2 rounded-full" @click="close" v-if="!showFooter">
                                <i class="fi fi-rr-cross text-light text-sm"></i>
                            </button>
                        </div>
                        <div :class="{ 'overflow-y-auto': !showOverflow, 'md:rounded-b-lg': !showFooter }" class="modal-body bg-white pt-4 pb-6 flex-grow no-scrollbar">
                            <slot name="body"></slot>
                        </div>
                        <div class="modal-footer w-full md:rounded-b-lg px-4 py-2 bg-gray-100" v-if="showFooter">
                            <slot name="footer" v-if="$slots.footer"></slot>
                            <div v-else class="flex justify-end items-center gap-2">
                                <Button size="sm" :action="close" text="Cancel" variant="outline" />
                                <Button size="sm" :action="() => emit('save')" variant="primary" :text="saveLabel" :async="true" />
                            </div>
                        </div>
                    </DialogPanel>
                </TransitionChild>
            </div>
        </Dialog>
    </TransitionRoot>
</template>

<style>
.modal {
    background-color: rgba(0, 0, 0, 0.7);
}
.modal-body {
    padding-left: 16px;
    padding-right: 16px;
}
</style>
