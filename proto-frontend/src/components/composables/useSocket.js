// composables/useSocket.js
import { createSocket } from '@/services/socket';
import { onBeforeUnmount, onMounted } from 'vue';

export function useSocket(event, callback, namespace = '/admin') {
    const socket = createSocket(namespace);

    onMounted(() => {
        socket.on(event, callback);
    });

    onBeforeUnmount(() => {
        socket.off(event, callback);
        socket.disconnect();
    });
}
