<template>
    <div class="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-4 pb-4">
        <!--Sidebar expanded------>
        <div v-if="!sidebarCollapsed" class="mb:py-2 pt-4 pb-2 flex w-full justify-between items-center">
            <img src="@/assets/images/virgin_o2_logo.png" alt="logo" class="w-2/3 mx-auto max-w-24" />
            <div class="cursor-pointer text-gray-400 hidden lg:block" @click="toggleSidebarCollapse()">
                <i class="fi fi-rr-angle-double-small-left"></i>
            </div>
        </div>
        <!--Sidebar Collapsed------>
        <div v-else class="flex justify-center flex-col gap-y-2 items-center py-4">
            <img src="@/assets/images/virgin_o2_logo.png" alt="logo" />
            <div class="cursor-pointer text-gray-400 hidden lg:block" @click="toggleSidebarCollapse()">
                <i class="fi fi-rr-angle-double-small-right"></i>
            </div>
        </div>

        <a
            :href="appUrl + 'launcher/index.html'"
            v-tooltip.right="sidebarCollapsed ? 'Launcher' : null"
            :class="[
                'group inline-flex relative justify-center items-center gap-x-1 rounded-full bg-gray-200 hover:bg-gray-100 text-primary text-sm font-semibold',
                sidebarCollapsed ? 'h-10 w-10 px-0 py-0 mx-auto' : 'px-3.5 py-2.5',
            ]"
        >
            <i class="fi fi-rr-arrow-left size-5 pt-0.5 pl-0.5" :class="{ '-ml-6 group-hover:-translate-x-2 transition-transform duration-200': !sidebarCollapsed }"></i>
            <span v-if="!sidebarCollapsed">Launcher</span>
        </a>

        <nav class="flex flex-1 flex-col">
            <ul role="list" class="flex flex-1 flex-col gap-y-7">
                <li>
                    <div role="list" class="-mx-2 space-y-1">
                        <template v-for="item in mainMenuItems" :key="item.name">
                            <div v-if="hasPermissions(item)">
                                <SidebarItem :item="item" :active-route="activeRoute" />
                            </div>
                        </template>
                    </div>
                </li>
                <li v-if="manageMenuItems.length > 0">
                    <div v-if="!sidebarCollapsed" class="text-xs font-semibold leading-6 text-gray-400">Manage</div>
                    <div v-else class="py-2 text-center text-gray-300">
                        <i class="fi fi-rr-horizontal-rule"></i>
                    </div>
                    <div role="list" class="-mx-2 space-y-1">
                        <template v-for="item in manageMenuItems" :key="item.name">
                            <div v-if="hasPermissions(item)">
                                <SidebarItem :item="item" :active-route="activeRoute" />
                            </div>
                        </template>
                    </div>
                </li>
            </ul>
        </nav>
    </div>
</template>

<script setup>
import SidebarItem from '@/components/navigation/sidebar/SidebarItem.vue';
import { useAuthStore } from '@/webapp/app/store/auth';
import { useSidebarStore } from '@/webapp/automation/store/sidebar.js';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
const sidebarStore = useSidebarStore();
const { sidebarCollapsed } = storeToRefs(sidebarStore);
const toggleSidebarCollapse = sidebarStore.toggleSidebarCollapse;

const { hasValidPermissions } = useAuthStore();
const appUrl = window.appurl;
const props = defineProps({
    menu: {
        type: Array,
        required: true,
    },
    activeRoute: {
        type: String,
        required: true,
    },
});
const mainMenuItems = computed(() => {
    return props.menu.filter(item => !item.manage);
});

const manageMenuItems = computed(() => {
    return props.menu.filter(item => item.manage);
});

//todo
const hasPermissions = item => {
    return true;
    if (item.permission) {
        return hasValidPermissions(item.permission);
    }

    if (item.children) {
        return item.children.some(childItem => hasValidPermissions(childItem.permission));
    }

    return true;
};
</script>

<style lang="scss" scoped></style>
