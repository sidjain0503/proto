<script setup>
import { computed } from 'vue';

const props = defineProps({
    imageUrl: String,
    userName: {
        type: String,
    },
    size: {
        type: String,
        default: 'xs',
    },
    type: {
        type: String,
        default: 'circle',
    },
    text: {
        type: String,
        default: '',
    },
    backgroundColor: {
        type: String,
        default: 'var(--secondary)',
    },
});

const userInitials = computed(() => {
    if (!props.userName) return '';
    const words = props.userName.trim().split(' ');
    let initials = '';
    if (words.length >= 2) {
        initials = words[0].charAt(0) + words[1].charAt(0);
    } else {
        initials = words[0].substring(0, 2);
    }
    return initials.toUpperCase();
});

const typeClass = computed(() => {
    return props.type === 'circle' ? 'rounded-full' : 'rounded-md';
});

const sizeClass = computed(() => {
    if (props.size === 'xs') {
        return 'w-8 h-8 text-sm font-semibold';
    }
    if (props.size === 'sm') {
        return 'w-12 h-12 text-xl font-semibold';
    }
    if (props.size === 'md') {
        return 'w-16 h-16 text-2xl  font-semibold';
    }
    if (props.size === 'lg') {
        return 'w-20 h-20 text-3xl font-semibold';
    }
    if (props.size === 'xl') {
        return 'w-28 h-28 text-5xl font-semibold';
    }
    if (props.size === '2xl') {
        return 'w-36 h-36 text-6xl font-bold ';
    }

    return `w-${props.size} h-${props.size} text-[10px] font-semibold`;
});
</script>

<template>
    <div class="flex group relative">
        <div v-if="text" class="absolute left-0 -top-0 z-10 bg-white text-primary px-4 py-1 text-xs rounded opacity-80 hidden group-hover:block">{{ text }}</div>
        <div
            v-if="imageUrl"
            :style="`background-color: ${backgroundColor}; background-image: url('${imageUrl}')`"
            :class="[sizeClass, typeClass]"
            class="flex shadow-md items-center justify-center bg-center bg-cover bg-no-repeat"
        ></div>
        <div v-else :style="`background-color: ${backgroundColor}`" :class="[sizeClass, typeClass]" class="flex shadow-md items-center justify-center bg-cover bg-no-repeat">
            <span v-if="!imageUrl" class="tracking-wide text-white">{{ userInitials }}</span>
            <span v-if="!imageUrl && !userInitials" class="tracking-wide text-white pt-0.5"><i class="fi fi-rr-user"></i></span>
        </div>
    </div>
</template>
