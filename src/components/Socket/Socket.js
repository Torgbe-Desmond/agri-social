import React, {
  createContext,
  useEffect,
  useRef,
  useContext,
  useState,
} from "react";
import { useDispatch } from "react-redux";
import { io } from "socket.io-client";
import { onlineStatus } from "../../Features/StackSlice";

// Create context
const SocketContext = createContext(null);

// Custom hook for easy access
export const useSocket = () => useContext(SocketContext);

// Create provider
export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);
  const [socket, setSocket] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    socketRef.current = io("https://agri-social-backend.onrender.com", {
      transports: ["websocket"],
      withCredentials: true,
    });

    socketRef.current.on("connect", () => {
      dispatch(onlineStatus({ message: "onlined", status: true }));
      console.log("🟢 Socket connected:", socketRef.current.id);
      setSocket(socketRef.current); // Set to state so context updates
      socketRef.current.emit("user", {
        user_id: localStorage.getItem("cc_ft"),
      });
    });

    socketRef.current.on("disconnect", () => {
      console.log("🔴 Socket disconnected");
      dispatch(onlineStatus({ message: "offline", status: false }));
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
