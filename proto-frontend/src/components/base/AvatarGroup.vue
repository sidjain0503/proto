<script setup>
import { computed } from 'vue';
import Avatar from '../Avatar/Avatar.vue';
const props = defineProps({
    users: {
        type: Array,
    },
    max: {
        type: Number,
        default: 10,
        min: 1,
    },
    size: {
        type: String,
        default: 'xs',
    },
    type: {
        type: String,
        default: 'circle',
    },
});

const userList = computed(() => {
    if (props.max < 10 && props.users.length > 10) {
        let newUserList = [];
        for (let i = 0; i < props.max; i++) {
            newUserList.push(props.users[i]);
        }
        return newUserList;
    }
    if (props.max < 10 && props.users.length < 10 && props.max < props.users.length) {
        let newUserList = [];
        for (let i = 0; i < props.max; i++) {
            newUserList.push(props.users[i]);
        }
        return newUserList;
    }

    if (props.max < 10 && props.users.length < 10 && props.max > props.users.length) {
        let newUserList = [];
        for (let i = 0; i < props.users.length; i++) {
            newUserList.push(props.users[i]);
        }
        return newUserList;
    }
    if (props.max < 10 && props.users.length < 10 && props.max === props.users.length) {
        let newUserList = [];
        for (let i = 0; i < props.users.length; i++) {
            newUserList.push(props.users[i]);
        }
        return newUserList;
    }

    if (props.max > 10 && props.users.length > 10) {
        let newUserList = [];
        for (let i = 0; i < 10; i++) {
            newUserList.push(props.users[i]);
        }
        return newUserList;
    }

    if (props.max >= 10 && props.users.length <= 10) {
        let newUserList = [];
        for (let i = 0; i < props.users.length; i++) {
            newUserList.push(props.users[i]);
        }
        return newUserList;
    }
    return [];
});

const colours = ['#5498ee', '#FEBE10', '#adadad', '#576acf', '#d80000', '#f13e46', '#ca4216', '#085', '#5f69ee'];
</script>

<template>
    <div class="flex items-center">
        <div v-for="(user, index) in userList" :key="user.name" class="-mr-2 p-0.5 bg-white rounded-full">
            <Avatar :image-url="user.imageUrl" :size="props.size" :user-name="user.name" :background-color="user.backgroundColor ? user.backgroundColor : colours[index]" />
        </div>
        <p v-if="props.users.length > props.max && props.max <= 10" class="ml-2 text-sm font-medium text-gray-600">+{{ props.users.length - props.max }} more</p>
        <p v-else-if="props.users.length > 10 && props.max > 10" class="ml-2 text-sm font-medium text-gray-600">+{{ props.users.length - 10 }} more</p>
    </div>
</template>
