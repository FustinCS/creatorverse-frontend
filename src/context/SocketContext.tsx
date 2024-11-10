import React, { createContext, useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";
import Peer, { SignalData } from "simple-peer";

type CallType = {
    isReceivedCall: boolean;
    from: string;
    name: string;
    signal: SignalData;
};
interface SocketContextType {
    call: CallType | null;
    callAccepted: boolean;
    myVideo: React.RefObject<HTMLVideoElement>;
    userVideo: React.RefObject<HTMLVideoElement>;
    stream: MediaStream | undefined;
    name: string;
    setName: React.Dispatch<React.SetStateAction<string>>;
    callEnded: boolean;
    me: string;
    callUser: (id: string) => void;
    leaveCall: () => void;
    answerCall: () => void;
    requestMediaPermissions: () => Promise<void>;
    stopMediaStream: () => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

const socket = io(import.meta.env.VITE_BACKEND_URL);

const SocketContextProvider = ({ children }: { children: React.ReactNode }) => {
    type CallType = {
        isReceivedCall: boolean;
        from: string;
        name: string;
        signal: SignalData;
    };
    const [call, setCall] = useState<CallType | null>(null);
    const [callAccepted, setCallAccepted] = useState<boolean>(false);
    const myVideo = useRef<HTMLVideoElement>(null);
    const userVideo = useRef<HTMLVideoElement>(null);
    const connectionRef = useRef<Peer.Instance | null>(null);
    const [stream, setStream] = useState<MediaStream | undefined>(undefined);
    const [name, setName] = useState<string>("Me");
    const [callEnded, setCallEnded] = useState<boolean>(false);
    const [me, setMe] = useState<string>("");

    useEffect(() => {
        if (myVideo.current && stream) {
            myVideo.current.srcObject = stream;
        }
    }, [stream]);

    useEffect(() => {
        // retrieveing the id from the backend
        socket.on("me", (id) => setMe(id));

        socket.on("calluser", ({ from, name: callerName, signal }) => {
            setCall({ isReceivedCall: true, from, name: callerName, signal });
        });
    }, []);

    const requestMediaPermissions = async () => {
        try {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                throw new Error("getUserMedia is not supported in this browser");
            }
            const currentStream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true,
            });
            setStream(currentStream);
            if (myVideo.current) {
                myVideo.current.srcObject = currentStream;
                myVideo.current.muted = true;
            }
        } catch (error) {
            console.error("Error accessing media devices.", error);
        }
    };
    const stopMediaStream = () => {
        if (stream) {
            stream.getTracks().forEach((track) => track.stop());
            setStream(undefined);
            if (myVideo.current) {
                myVideo.current.srcObject = null;
            }
        }
    };
    const answerCall = () => {
        setCallAccepted(true);
        // for the user we create a peer server using the values that we have
        // we do this to establish the connection with the unique id between two users
        // false --> we are receiver
        // tricle = false --> disables trickle ICE so ICE Candiates are sent in sing
        if (call) {
            const peer = new Peer({ initiator: false, trickle: false, stream });
            peer.on("signal", (data) => {
                socket.emit("answercall", { signal: data, to: call.from });
            });
            peer.on("stream", (currentStream) => {
                if (userVideo.current) {
                    userVideo.current.srcObject = currentStream;
                } else {
                    console.error("stream:");
                }
            });
            peer.signal(call.signal);
            connectionRef.current = peer;
        } else {
            console.error("answerCall: no call to answer");
        }
    };

    const callUser = async (id: string) => {
        if (!stream) {
            await requestMediaPermissions();
            // console.error("callUser ERROR: stream not set yet");
        }
        const peer = new Peer({ initiator: true, trickle: false, stream });
        peer.on("signal", (data) => {
            socket.emit("calluser", {
                userToCall: id,
                signalData: data,
                from: me,
                name,
            });
        });
        peer.on("stream", (currentStream) => {
            // i am obtaining other person's stream here
            if (userVideo.current) {
                userVideo.current.srcObject = currentStream;
            } else {
                console.error("callUser stream failed");
            }
        });
        socket.on("callaccepted", (signal) => {
            setCallAccepted(true);
            peer.signal(signal);
        });
        connectionRef.current = peer;
    };

    const leaveCall = () => {
        setCallEnded(true);
        if (connectionRef.current) {
            connectionRef.current.destroy();
        } else {
            console.error("leaveCall no connectionRef to destory");
        }
        stopMediaStream();
        window.location.reload();
    };
    return (
        <SocketContext.Provider
            value={{
                call,
                callAccepted,
                myVideo,
                userVideo,
                stream,
                name,
                setName,
                callEnded,
                me,
                callUser,
                leaveCall,
                answerCall,
                requestMediaPermissions,
                stopMediaStream,
            }}
        >
            {children}
        </SocketContext.Provider>
    );
};

export { SocketContextProvider, SocketContext };
