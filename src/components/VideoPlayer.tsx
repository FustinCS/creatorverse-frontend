// src/components/VideoPlayer.tsx

import React, { useContext } from "react";
import { SocketContext } from "../context/SocketContext";

const VideoPlayer: React.FC = () => {
    const { callAccepted, myVideo, userVideo, callEnded, stream, name, call } =
        useContext(SocketContext)!;

    return (
        <div className="flex flex-col space-y-4">
            {/* Remote Video */}
            <div className="relative video-container">
                <h3 className="text-center">{call?.name || "Caller"}</h3>
                {callAccepted && !callEnded ? (
                    <video
                        playsInline
                        ref={userVideo}
                        autoPlay
                        className="rounded-lg w-full h-auto"
                    />
                ) : (
                    <img
                        src="/placeholder.svg"
                        alt="Placeholder"
                        className="rounded-lg w-full h-auto"
                    />
                )}
            </div>
            {/* Local Video */}
            <div className="relative video-container">
                <h3 className="text-center">{name || "You"}</h3>
                {stream ? (
                    <video
                        playsInline
                        muted
                        ref={myVideo}
                        autoPlay
                        className="rounded-lg w-full h-auto"
                        // src={URL.createObjectURL(stream)}
                    />
                ) : (
                    <img
                        src="/placeholder.svg"
                        alt="Placeholder"
                        className="rounded-lg w-full h-auto"
                    />
                )}
            </div>
        </div>
    );
};

export default VideoPlayer;
