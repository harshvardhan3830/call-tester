import React, { useState } from "react";
import useWebRTC from "../hooks/useWebRTC";
import "../styles.css";

const CallTester = () => {
  const [peerId, setPeerId] = useState("");
  const {
    startCall,
    endCall,
    localVideoRef,
    remoteVideoRef,
    callActive,
    callDuration,
  } = useWebRTC();

  return (
    <div className="container">
      <h1>Call Testing App</h1>

      <input
        type="text"
        placeholder="Enter User ID"
        value={peerId}
        onChange={(e) => setPeerId(e.target.value)}
        className="input-box"
      />

      <button
        onClick={() => startCall(peerId)}
        className="button green"
        disabled={callActive || !peerId} // Prevent empty user ID
      >
        Start Call
      </button>

      <button onClick={endCall} className="button red" disabled={!callActive}>
        Disconnect
      </button>

      {callActive && <p>Call Duration: {callDuration} sec</p>}

      <div className="video-container">
        <video ref={localVideoRef} autoPlay muted className="video-box" />
        <video ref={remoteVideoRef} autoPlay className="video-box" />
      </div>
    </div>
  );
};

export default CallTester;
