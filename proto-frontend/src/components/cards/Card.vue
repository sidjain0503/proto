<template>
    <div class="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white border">
        <div class="px-4 py-5 sm:px-6">
            <slot name="header"></slot>
        </div>
        <div class="px-4 py-5 sm:p-6">
            <slot></slot>
        </div>
        <div class="px-4 py-4 sm:px-6" v-if="$slots.footer">
            <slot name="footer"></slot>
        </div>
    </div>
</template>

<script setup></script>

<style lang="scss" scoped></style>
