import { io } from "socket.io-client";

// Factory so SocketContext can create a fresh socket with the userId baked
// into the handshake query. Mutating io.opts.query after creation is unreliable.
export function createSocket(userId) {
    return io(import.meta.env.VITE_BACKEND_URL, {
        autoConnect: false,
        query: { userId },
    });
}

export default null;