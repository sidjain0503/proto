<script setup>
import { Disclosure, DisclosureButton, DisclosurePanel, Popover, PopoverButton, PopoverPanel } from '@headlessui/vue';
import { useSidebarStore } from '@/webapp/automation/store/sidebar.js';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/webapp/app/store/auth';
import { computed } from 'vue';

const sideBarStore = useSidebarStore();
const { sidebarCollapsed, sidebarOpen } = storeToRefs(sideBarStore);

const props = defineProps({
    item: {
        type: Object,
    },
    activeRoute: {
        type: String,
    },
});

const { hasValidPermissions } = useAuthStore();

const filteredChildren = computed(() => {
    if (props.item.children && props.item.children.length) {
        return props.item.children.filter(subItem => hasValidPermissions(subItem.permission));
    }

    return null;
});
</script>

<template>
    <div class="sidebar-item">
        <!-- Expanded mode -->
        <Disclosure v-if="!sidebarCollapsed" v-slot="{ open }" as="div" class="w-full">
            <router-link v-if="!item.children" :to="item.path" @click="sidebarOpen = false">
                <DisclosureButton
                    :class="[
                        activeRoute.startsWith(item.path) ? 'bg-gray-50 text-primary' : 'text-gray-700 hover:bg-gray-50 hover:text-primary',
                        'group flex items-center gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 w-full',
                    ]"
                >
                    <i class="fi menu-item-icon lh-0" :class="item.icon"></i>
                    <span>{{ item.name }}</span>
                </DisclosureButton>
            </router-link>

            <DisclosureButton
                v-else
                :class="[
                    activeRoute.startsWith(item.path) ? 'bg-gray-50 text-primary' : 'text-gray-700 hover:bg-gray-50 hover:text-primary',
                    'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 w-full',
                ]"
            >
                <i class="fi menu-item-icon" :class="item.icon"></i>
                <span>{{ item.name }}</span>
                <i :class="[open ? 'rotate-90' : 'rotate-0', 'fi-rr-caret-right fi ml-auto text-gray-400']" />
            </DisclosureButton>

            <transition
                enter-active-class="enter-active"
                enter-from-class="enter-from"
                enter-to-class="enter-to"
                leave-active-class="leave-active"
                leave-from-class="leave-from"
                leave-to-class="leave-to"
            >
                <DisclosurePanel v-if="item.children" as="ul" class="overflow-hidden">
                    <router-link v-for="(subItem, index) in filteredChildren" :key="subItem.name" :to="subItem.path" class="cursor-pointer relative bg-red subItemWrapper" @click="sidebarOpen = false">
                        <div class="absolute flex flex-col items-center left-3.5">
                            <div class="submenuItemBorderBefore" :class="index === 0 ? 'opacity-0' : 'opacity-100'"></div>
                            <div class="submenuItemCircle"></div>
                            <div v-if="index !== filteredChildren.length - 1" class="submenuItemBorderAfter"></div>
                        </div>

                        <div
                            :class="[
                                activeRoute.startsWith(subItem.path) ? 'text-gray-900 ' : 'hover:text-gray-900 ',
                                ' font-medium text-gray-400 text-sm rounded ml-8  pr-2 py-2 my-0.5 flex justify-between items-center',
                            ]"
                        >
                            <span>{{ subItem.name }}</span>
                        </div>
                    </router-link>
                </DisclosurePanel>
            </transition>
        </Disclosure>

        <!-- Collapsed mode -->
        <div v-else class="menu-item justify-center">
            <router-link v-if="!item.children" v-tooltip.right="item.name" :to="item.path" style="line-height: 0 !important">
                <i style="line-height: 0 !important" class="fi menu-item-icon text-base" :class="item.icon"></i>
            </router-link>
            <Popover v-else class="flex items-center">
                <PopoverButton style="line-height: 0 !important">
                    <i v-tooltip.right="item.name" style="line-height: 0 !important" class="fi menu-item-icon text-base" :class="item.icon"></i>
                </PopoverButton>
                <transition
                    enter-active-class="transition ease-out duration-100"
                    enter-from-class="transform opacity-0 scale-95"
                    enter-to-class="transform opacity-100 scale-100"
                    leave-active-class="transition ease-in duration-75"
                    leave-from-class="transform opacity-100 scale-100"
                    leave-to-class="transform opacity-0 scale-95"
                >
                    <PopoverPanel v-slot="{ close }" class="absolute z-50 flex w-screen max-w-max left-16">
                        <div class="flex-auto overflow-hidden rounded-md bg-white text-sm leading-6 shadow-2xl ring-1 ring-gray-900/5">
                            <div class="flex flex-col px-2 py-2">
                                <div v-for="subItem in filteredChildren" :key="subItem.name" class="flex items-center cursor-pointer justify-between py-1 hover:bg-gray-200 px-2 rounded">
                                    <router-link :to="subItem.path" @click="close()">
                                        <span>{{ subItem.name }}</span>
                                    </router-link>
                                    <span class="fi fi-rr-angle-small-right"></span>
                                </div>
                            </div>
                        </div>
                    </PopoverPanel>
                </transition>
            </Popover>
        </div>
    </div>
</template>

<style lang="scss">
.menu-item {
    font-weight: 600;
    @apply flex items-center w-full
    text-[11pt] text-gray-800 text-left
    gap-x-4 px-2 py-2
    hover:bg-gray-200 rounded
    transition-all duration-100 ease-in-out;

    &.active {
        @apply bg-gray-200 text-gray-800;
    }

    .menu-item-icon {
        @apply leading-4 font-semibold text-xl group-hover:text-blue-600 transition-colors duration-100 ease-in-out;
    }

    &:focus-visible {
        outline: 0 !important;
    }
}

.fi-rr-caret-right {
    @apply transition-transform duration-100 ease-in-out;
}

.submenuItemBorderBefore,
.submenuItemCircle,
.submenuItemBorderAfter {
    @apply transition-all duration-100 ease-in-out;
}

.subItemWrapper {
    @apply transition-all duration-100 ease-in-out;
}

@keyframes slideDown {
    from {
        max-height: 0;
    }
    to {
        max-height: 1000px;
    }
}

@keyframes slideUp {
    from {
        max-height: 1000px;
    }
    to {
        max-height: 0;
    }
}

.enter-active,
.leave-active {
    overflow: hidden;
    transition: max-height 0.15s ease-in-out;
}

.enter-from,
.leave-to {
    max-height: 0;
}

.enter-to,
.leave-from {
    max-height: 1000px;
}

.enter-active {
    animation: slideDown 0.15s ease-in-out;
}

.leave-active {
    animation: slideUp 0.15s ease-in-out;
}
</style>
