
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;
const socket = io(SOCKET_URL);

export function useStockSync() {
    const queryClient = useQueryClient();

    useEffect(() => {
        function handleStockUpdate() {
            console.log('Actualizando mediate socket')
            queryClient.invalidateQueries(['products'])
            queryClient.invalidateQueries(['cart'])
            queryClient.invalidateQueries(['buyLogs'])
        }

        socket.on('products:updated', handleStockUpdate);

        return () => {
            socket.off('products:updated', handleStockUpdate);
        };
    }, [queryClient]);
}