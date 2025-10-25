<script setup>
import { ref, watch, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import routes from '@/webapp/automation/router/routes';
import { useEventBus } from '@vueuse/core';
import { Skeletor } from 'vue-skeletor';

const router = useRouter();
const route = useRoute();
const pages = ref([]);

const isValidGuid = id => {
    return /^(\{){0,1}[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}(\}){0,1}$/gi.test(id);
};

const isMongoId = id => {
    return /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i.test(id);
};

const isSqlId = id => {
    return /^\d+$/.test(id);
};

watch(
    route,
    currentRoute => {
        const paths = currentRoute.path.split('/').filter(p => p);
        let currentPath = '';
        pages.value = [];
        paths.forEach(subPath => {
            currentPath = `${currentPath}/${subPath}`;
            if (isValidGuid(subPath) || isMongoId(subPath) || isSqlId(subPath)) return;
            pages.value.push({ name: subPath.replace(/-/g, ' '), href: currentPath });
        });
    },
    { immediate: true },
);

const openPage = page => {
    if (route.query.returnTo && route.query.returnId) {
        router.push(`/${route.query?.returnTo}/${route?.query?.returnId}`);
        return;
    }
    if (route.query.returnTo && !route.query.returnId) {
        router.push(`/${route.query?.returnTo}`);
        return;
    }

    router.replace({
        path: page.href,
    });
};

const isRedirectedBack = pagePath => {
    const routeConfig = routes.find(r => r.path === pagePath);
    const redirectedPage = routeConfig && (typeof routeConfig.redirect === 'function' ? routeConfig.redirect(routeConfig) : routeConfig.redirect);

    if (redirectedPage) {
        if (redirectedPage === route.path) {
            return true;
        }
        return isRedirectedBack(redirectedPage);
    }

    return false;
};

const previousPage = computed(() => {
    if (pages.value.length) {
        return pages.value
            .slice(0, -1)
            .reverse()
            .find(page => {
                return !isRedirectedBack(page.href);
            });
    }
    return null;
});

const isBasePage = computed(() => {
    return !previousPage.value;
});

const goBack = () => {
    if (isBasePage.value) return;
    openPage(previousPage.value);
};

const bus = useEventBus('navigation');
bus.on(e => {
    if (e === 'navigate-back') {
        goBack();
    }
});

// const emit = defineEmits(['showSidebar']);
// const showSidebar = () => {
//     emit('showSidebar');
// };
</script>

<template>
    <nav class="md:flex md:justify-between breadcrumb flex py-3 text-sm h-12" aria-label="Breadcrumb">
        <ol v-if="pages.length" role="list" class="max-w-screen-xl flex">
            <!-- <li v-if="!isBasePage" class="flex">
                <div class="flex items-center cursor-pointer mr-3 text-primary" @click="goBack">
                    <i class="fi fi-rr-arrow-left"></i>
                </div>
            </li> -->
            <li v-for="(page, index) in pages" :key="page.name" class="flex">
                <div class="flex items-center">
                    <span
                        class="font-semibold cursor-pointer capitalize text-base"
                        :class="index === pages.length - 1 ? 'text-primary' : 'text-black'"
                        :aria-current="index === pages.length - 1 ? 'page' : undefined"
                        @click="index !== pages.length - 1 && openPage(page)"
                        >{{ page.name }}</span
                    >
                    <span v-if="index < pages.length - 1" class="fi fi-rr-caret-right mx-2" style="color: #ccc"></span>
                </div>
            </li>
        </ol>
        <div v-else class="px-5 flex items-center gap-x-2">
            <Skeletor height="100%" width="64" class="rounded-md" />
            <Skeletor height="100%" width="64" class="rounded-md" />
        </div>

        <!-- <div class="lg:hidden flex items-center p-2" @click="showSidebar">
            <i class="fi fi-rr-menu-burger"></i>
        </div> -->
    </nav>
    <!-- <nav class="md:hidden flex justify-between w-full items-center">
        <div v-if="!isBasePage" class="flex">
            <div class="flex items-center cursor-pointer mr-3 text-primary" @click="goBack">
                <i class="fi fi-rr-arrow-left md:hidden"></i>
            </div>
        </div>
        <div class="md:hidden flex-1">
            <span class="font-semibold ml-2">{{ route.name }}</span>
        </div>
        <div class="flex items-center p-2" @click="showSidebar">
            <i class="fi fi-rr-menu-burger"></i>
        </div>
    </nav> -->
</template>

<style lang="scss" scoped>
.breadcrumb {
    background-color: var(--white);
}

.back {
    color: #788195;
}

.text-black {
    color: #555555;
}
</style>
