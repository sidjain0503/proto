<script setup>
import { onMounted, ref, nextTick } from 'vue';

const props = defineProps({
    direction: {
        type: String,
        validator: val => {
            return ['top', 'top-right', 'top-left', 'bottom', 'bottom-left', 'bottom-right', 'right', 'left'].includes(val);
        },
        default: 'top',
    },
    styleClass: String,
    explicitTrigger: {
        type: Boolean,
        default: false, //if explicitTrigger is set to true , use slotprops open,close methods.
    },
});

const panelElement = ref(null);
const buttonElement = ref(null);
const position = ref('');
const arrowPosition = ref('');
const isOpen = ref(false);

function openPopover() {
    isOpen.value = true;
}

const closePopover = () => {
    isOpen.value = false;
};

const positionHandler = direction => {
    const panelDimension = panelElement.value.getBoundingClientRect();
    const buttonDimension = buttonElement.value.getBoundingClientRect();

    const directions = {
        top: { bottom: `${buttonDimension?.height}px`, left: `50%`, transform: `translateX(-${panelDimension?.width / 2}px)` },
        'top-right': { bottom: `${buttonDimension?.height}px`, left: `${buttonDimension?.width}px` },
        'top-left': { bottom: `${buttonDimension?.height}px`, left: `-${panelDimension?.width}px` },
        bottom: { top: `${buttonDimension?.height}px`, left: `50%`, transform: `translateX(-${panelDimension?.width / 2}px)` },
        'bottom-left': { top: `${buttonDimension?.height}px`, left: `-${panelDimension?.width}px` },
        'bottom-right': { top: `${buttonDimension?.height}px`, left: `${buttonDimension?.width}px` },
        right: { transform: `translateY(-${panelDimension?.height / 2 + 10}px)`, left: `${buttonDimension?.width}px` },
        left: { transform: `translateY(-${panelDimension?.height / 2 + 10}px)`, left: `-${panelDimension?.width}px` },
    };

    const arrows = {
        top: `after:content-[' '] after:absolute after:top-full after:border-x-transparent after:border-b-transparent after:border-t-gray-800 after:border-8  after:-mt-2`,

        bottom: `after:content-[' '] after:absolute after:bottom-full after:left-2/4 after:border-x-transparent after:border-t-transparent after:border-b-white after:border-8 after:-ml-2 after:-mb-2
        before:content-[' '] before:absolute before:bottom-full before:left-2/4 before:border-x-transparent before:border-t-transparent before:border-b-gray-200 before:border-8 before:-ml-2 before:-mb-1.5
        `,
        left: `after:content-[' '] after:absolute after:bottom-full after:left-full after:top-2/4 after:border-y-transparent after:border-r-transparent after:border-l-white after:border-8 after:-mt-2 after:-ml-2
               before:content-[' '] before:absolute before:bottom-full before:left-full before:top-2/4 before:border-y-transparent before:border-r-transparent before:border-l-gray-200 before:border-8 before:-mt-2 before:-ml-1.5
        `,
        right: `after:content-[' '] after:absolute after:bottom-full after:top-2/4 after:border-y-transparent after:border-l-transparent after:border-r-white after:border-8 after:-mt-2 after:-ml-3.5
        before:content-[' '] before:absolute before:bottom-full before:top-2/4 before:border-y-transparent before:border-l-transparent before:border-r-gray-200 before:border-8 before:-mt-2 before:-ml-4`,
    };
    position.value = directions[direction];
    arrowPosition.value = arrows[direction];
};

onMounted(async () => {
    await nextTick();
    positionHandler(props.direction);
});
</script>

<template>
    <div class="relative z-50 w-fit h-fit" @mouseenter="() => openPopover()" @mouseleave="closePopover()">
        <div ref="buttonElement" class="cursor-pointer rounded" style="line-height: 0">
            <i class="fi fi-rr-square-info text-gray-500 text-xs"></i>
        </div>

        <div
            ref="panelElement"
            :class="[isOpen ? `opacity-100 scale-100` : 'opacity-0 scale-50', arrowPosition]"
            :style="{ zIndex: 9999999 }"
            class="absolute p-1.5 transition-all transform duration-100 linear -top-20"
        >
            <div class="shadow-lg bg-gray-800 text-white rounded p-3 text-xs font-medium w-64 ring-1 ring-black ring-opacity-5" :class="styleClass">
                <slot></slot>
            </div>
        </div>
    </div>
</template>
