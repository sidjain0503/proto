import { computed } from 'vue';

/**
 * Composable for syncing modelValue between a component's child and the component's parent
 */
export default (props, emit) => {
    return computed({
        get() {
            return props.modelValue;
        },
        set(newValue) {
            emit('update:modelValue', newValue);
        },
    });
};
