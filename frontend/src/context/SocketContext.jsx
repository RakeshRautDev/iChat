import { createContext, useContext, useEffect, useRef, useState } from "react";
import { createSocket } from "../services/socket";
import { useUser } from "@clerk/react";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
    const { user } = useUser();
    // useState (not useRef) so that when the socket instance is set,
    // all context consumers re-render and their socket-dependent effects fire.
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    // Keep a ref purely for cleanup — we need to disconnect the previous
    // socket before creating a new one, but that doesn't need to trigger renders.
    const socketRef = useRef(null);

    useEffect(() => {
        if (!user?.id) return;

        // Clean up any old socket before creating a fresh one
        if (socketRef.current) {
            socketRef.current.off();          // remove all listeners
            socketRef.current.disconnect();
        }

        const sock = createSocket(user.id);
        socketRef.current = sock;

        sock.on("connect", () => {
            console.log("[socket] connected:", sock.id);
            // Put the socket into state so consumers re-render and register listeners
            setSocket(sock);
        });

        sock.on("getOnlineUsers", (users) => {
            setOnlineUsers(users);
        });

        sock.on("disconnect", () => {
            console.log("[socket] disconnected");
            setSocket(null);
        });

        sock.connect();

        return () => {
            sock.off();
            sock.disconnect();
            socketRef.current = null;
            setSocket(null);
            setOnlineUsers([]);
        };
    }, [user?.id]);

    return (
        <SocketContext.Provider value={{ socket, onlineUsers }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => useContext(SocketContext);

export default SocketContext;