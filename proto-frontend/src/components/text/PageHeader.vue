<script setup>
defineProps({
    heading: String,
    subHeading: String,
    customClass: String,
    headingType: {
        type: String,
        default: 'default', // These are the types: 'default', 'banners' and 'filled'
    },
    bannerImage: {
        type: String,
    },
    backgroundColor: {
        type: String,
        default: 'rgb(17, 24, 39)',
    },
});
</script>

<template>
    <div v-if="headingType === 'default'" :class="customClass" class="flex flex-col gap-3 py-3 lg:pt-3 lg:pb-4">
        <div class="flex flex-col gap-0.5 2xl:gap-1">
            <div class="flex items-center h-8 justify-between">
                <h3 class="h3-bold">{{ heading }}</h3>
                <div class="hidden md:block">
                    <slot name="button-slot"></slot>
                </div>
            </div>
            <p class="text-sm text-text-light">{{ subHeading }}</p>
            <div class="block md:hidden mt-1">
                <slot name="button-slot"></slot>
            </div>
        </div>
    </div>
    <div v-else-if="headingType === 'banner'" :class="customClass" class="flex flex-col gap-3">
        <div
            class="flex pl-4 lg:pl-16 bg-gray-900 justify-between md:h-80 px-4 lg:px-16 py-4 bg-no-repeat bg-right banner-header-container md:!bg-none"
            :style="`background: linear-gradient(to bottom, rgba(17, 24, 39, 1), rgba(17, 24, 39, 0.75), rgba(17, 24, 39, 0)), url('${bannerImage}'); background-size: 200px 160px;`"
        >
            <div class="flex flex-col justify-center">
                <div class="mx-auto max-w-2xl lg:mx-0">
                    <slot name="logo-slot"></slot>
                    <h1 class="text-2xl 2xl:text-3xl font-bold tracking-tight text-white mt-2 md:mt-3">{{ heading }}</h1>
                    <p class="text-white">{{ subHeading }}</p>
                    <slot name="button-slot"></slot>
                </div>
            </div>
            <img class="object-contain max-w-xs hidden md:block" :src="bannerImage" />
        </div>
    </div>
    <div v-else-if="headingType === 'filled'" :class="customClass" :style="`background-color: ${backgroundColor}`" class="flex flex-col gap-3 p-4 lg:px-4 lg:pt-3 lg:pb-4">
        <div class="flex flex-col gap-0.5 2xl:gap-1">
            <div class="flex items-center justify-between">
                <h3 class="text-lg leading-8 text-white font-semibold">{{ heading }}</h3>
                <div class="hidden md:block">
                    <slot name="button-slot"></slot>
                </div>
            </div>
            <p class="text-sm text-gray-300 -mt-1 font-semibold">{{ subHeading }}</p>
            <div class="block md:hidden mt-1">
                <slot name="button-slot"></slot>
            </div>
        </div>
    </div>
</template>
