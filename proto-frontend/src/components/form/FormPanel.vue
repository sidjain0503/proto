<script setup>
import Panel from '@/components/base/Panel.vue';

defineProps({
    title: String,
    showFooter: {
        type: Boolean,
        default: true,
    },
    save: {
        type: Function,
        default: () => {},
    },
    reset: {
        type: Function,
        default: () => {},
    },
    disableSave: {
        type: Boolean,
        default: false,
    },
});
</script>
<template>
    <Panel :title="title" :description="description">
        <template #buttons>
            <div class="flex gap-x-2">
                <Button text="Discard Changes" size="sm" variant="outline" :action="reset"> </Button>
                <Button variant="success" size="sm" text="Save Changes" :action="save" :async="true" :disabled="disableSave"> </Button>
            </div>
        </template>
        <template #content-slot>
            <slot name="content-slot"></slot>
        </template>
    </Panel>
</template>
