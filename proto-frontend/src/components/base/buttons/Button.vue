<script setup>
import { useRouter } from 'vue-router';
import { ref, computed } from 'vue';

const router = useRouter();

const props = defineProps({
    text: {
        type: String,
    },
    icon: {
        type: String,
    },
    disabled: {
        type: Boolean,
    },
    keyCode: {
        type: String,
    },
    to: {
        type: String,
    },
    action: {
        type: Function,
    },
    async: {
        type: Boolean,
    },
    variant: {
        type: String,
        validator: val => {
            return ['primary', 'outline', 'success', 'danger', 'dark'].includes(val);
        },
        default: 'primary',
    },
    size: {
        type: String,
        validator: val => {
            return ['xs', 'sm', 'md', 'lg', 'xl'].includes(val);
        },
        default: 'md',
    },
});

const runAction = () => {
    if (props.to) {
        router.push(props.to);
    } else if (props.action) {
        props.action();
    }
};

const runAsyncAction = async () => {
    isAsyncLoading.value = true;
    if (props.to) {
        await router.push(props.to);
    } else if (props.action) {
        await props.action();
    }
    isAsyncLoading.value = false;
};

const actionDispatch = () => {
    if (props.async) {
        runAsyncAction();
    } else {
        runAction();
    }
};

const sizeClass = computed(() => {
    if (props.size === 'xs') {
        return 'h-[30px] px-2 text-xs leading-[18px] rounded-md font-medium gap-1.5';
    }
    if (props.size === 'sm') {
        return 'px-2.5 h-[32px] text-sm leading-[20px] rounded-md font-medium gap-2';
    }
    if (props.size === 'md') {
        return 'px-3 h-[36px] text-sm leading-[20px] rounded-md font-medium gap-2';
    }
    if (props.size === 'lg') {
        return 'px-3.5 h-10 text-sm leading-[20px] rounded-md font-medium gap-2';
    }
    if (props.size === 'xl') {
        return 'px-3.5 h-[44px] text-base leading-[22px] rounded-md font-medium gap-2';
    }
    return 'px-3 h-[36px] text-sm leading-[20px] rounded-md font-medium gap-2';
});

const outlineSizeClass = computed(() => {
    if (props.size === 'xs') {
        return 'h-[31px] px-2 text-xs leading-[18px] rounded-md font-medium gap-1.5';
    }
    if (props.size === 'sm') {
        return 'px-2.5 h-[33px] text-sm leading-[20px] rounded-md font-medium gap-2';
    }
    if (props.size === 'md') {
        return 'px-3 h-[37px] text-sm leading-[20px] rounded-md font-medium gap-2';
    }
    if (props.size === 'lg') {
        return 'px-3.5 h-[41px] text-sm leading-[20px] rounded-md font-medium gap-2';
    }
    if (props.size === 'xl') {
        return 'px-3.5 h-[45px] text-base leading-[22px] rounded-md font-medium gap-2';
    }
    return 'px-3 h-[37px] text-sm leading-[20px] rounded-md font-medium gap-2';
});

const keyCodeSize = computed(() => {
    if (props.size === 'xs') {
        return 'text-[10px] font-semibold rounded-sm ml-0.5  w-3.5 h-3.5 flex items-center justify-center';
    }
    if (props.size === 'sm') {
        return 'text-xs font-semibold rounded-sm  w-4 h-4 flex items-center justify-center';
    }
    if (props.size === 'md') {
        return 'text-xs font-semibold rounded-sm  w-5 h-5 flex items-center justify-center';
    }
    if (props.size === 'lg') {
        return 'text-sm font-semibold rounded-sm  w-5 h-5 flex items-center justify-center';
    }
    if (props.size === 'xl') {
        return 'text-sm font-semibold rounded-sm  w-5 h-5 flex items-center justify-center';
    }
    return 'text-xs font-semibold rounded-sm  w-5 h-5 flex items-center justify-center';
});

const isAsyncLoading = ref(false);
</script>

<template>
    <button
        v-if="variant === 'primary'"
        class="gap-1 bg-primary focus:outline-blue-500 hover:bg-secondary transition duration-200 ease-out hover:ease-in flex items-center text-white button-component"
        :class="[sizeClass]"
        type="button"
        :disabled="disabled || isAsyncLoading"
        @click.stop="actionDispatch"
    >
        <span v-if="icon && !isAsyncLoading" class="fi-wrapper"><i class="fi" :class="icon"></i></span>
        <span v-if="isAsyncLoading" class="fi-wrapper animate-spin"><i class="fi fi-rr-spinner"></i></span>
        <span v-if="text">{{ text }}</span>
        <span v-if="keyCode" :class="[keyCodeSize]" class="bg-white text-black font-medium uppercase keycode-btn">{{ keyCode }}</span>
    </button>
    <button
        v-else-if="variant === 'outline'"
        :class="[outlineSizeClass]"
        class="bg-[#fff] focus:outline-none focus:border-blue-500 border border-[#e6e6e6] gap-1 hover:bg-[#f1f1f1] hover:border-[#d8d8d8] transition duration-200 ease-out hover:ease-in flex items-center text-black outline-btn"
        type="button"
        :disabled="disabled || isAsyncLoading"
        @click.stop="actionDispatch"
    >
        <span v-if="icon && !isAsyncLoading" class="fi-wrapper"><i class="fi" :class="icon"></i></span>
        <span v-if="isAsyncLoading" class="fi-wrapper animate-spin"><i class="fi fi-rr-spinner"></i></span>
        <span v-if="text">{{ text }}</span>
        <span v-if="keyCode" :class="[keyCodeSize]" class="bg-gray-800 text-gray-100 text-center font-medium uppercase keycode-btn">{{ keyCode }}</span>
    </button>
    <button
        v-else-if="variant === 'danger'"
        :class="[sizeClass]"
        class="bg-red-600 hover:bg-red-700 focus:outline-blue-500 gap-1 transition duration-200 ease-out hover:ease-in flex items-center text-white button-component"
        type="button"
        :disabled="disabled || isAsyncLoading"
        @click.stop="actionDispatch"
    >
        <span v-if="icon && !isAsyncLoading" class="fi-wrapper"><i class="fi" :class="icon"></i></span>
        <span v-if="isAsyncLoading" class="fi-wrapper animate-spin"><i class="fi fi-rr-spinner"></i></span>
        <span v-if="text">{{ text }}</span>
        <span v-if="keyCode" :class="[keyCodeSize]" class="bg-white text-black font-medium uppercase keycode-btn">{{ keyCode }}</span>
    </button>
    <button
        v-else-if="variant === 'success'"
        :class="[sizeClass]"
        class="bg-[#00A550] hover:bg-green-700 focus:outline-blue-500 gap-1 transition duration-200 ease-out hover:ease-in flex items-center text-white button-component"
        type="button"
        :disabled="disabled || isAsyncLoading"
        @click.stop="actionDispatch"
    >
        <span v-if="icon && !isAsyncLoading" class="fi-wrapper"><i class="fi" :class="icon"></i></span>
        <span v-if="isAsyncLoading" class="fi-wrapper animate-spin"><i class="fi fi-rr-spinner"></i></span>
        <span v-if="text">{{ text }}</span>
        <span v-if="keyCode" :class="[keyCodeSize]" class="bg-white text-black font-medium uppercase keycode-btn">{{ keyCode }}</span>
    </button>
    <button
        v-else-if="variant === 'dark'"
        :class="[sizeClass]"
        class="bg-gray-800 hover:bg-gray-700 focus:outline-blue-500 gap-1 transition duration-200 ease-out hover:ease-in flex items-center text-white button-component"
        type="button"
        :disabled="disabled || isAsyncLoading"
        @click.stop="actionDispatch"
    >
        <span v-if="icon && !isAsyncLoading" class="fi-wrapper"><i class="fi" :class="icon"></i></span>
        <span v-if="isAsyncLoading" class="fi-wrapper animate-spin"><i class="fi fi-rr-spinner"></i></span>
        <span v-if="text">{{ text }}</span>
        <span v-if="keyCode" :class="[keyCodeSize]" class="bg-white text-black font-medium uppercase keycode-btn">{{ keyCode }}</span>
    </button>
</template>

<style scoped>
.fi-wrapper {
    line-height: 0;
}
.keycode-btn {
    /* box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px; */
}
.outline-btn {
    /* box-shadow: 0px 1.5px 4px -1px rgba(10, 9, 11, 0.1); */
}
.button-component {
    /* box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px; */
}
.button-component:disabled {
    /* box-shadow:
        rgba(0, 0, 0, 0.1) 0px 1px 3px 0px,
        rgba(0, 0, 0, 0.06) 0px 1px 2px 0px; */
    border: 1px #adadad;
    background-color: #e5e5e5 !important;
    color: #adadad !important;
    cursor: not-allowed !important;
}
.outline-btn:disabled {
    border: 1px #adadad;
    background-color: #e5e5e5 !important;
    color: #adadad !important;
    cursor: not-allowed !important;
}
</style>
