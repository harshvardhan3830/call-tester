import { useRef, useState } from "react";
import Peer from "simple-peer";

const ICE_SERVERS = [
  {
    urls: "stun:20.121.48.41:3478",
  },
  {
    urls: "turn:20.121.48.41:3478",
    username: "turnuser",
    credential: "turn456",
  },
];

const useWebRTC = () => {
  const [callActive, setCallActive] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const intervalRef = useRef(null);
  const peerRef = useRef(null);
  const socketRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  // ✅ Start WebSocket Connection
  const connectWebSocket = (peerId) => {
    if (!peerId) {
      console.error("❌ WebRTC Error: peerId is undefined");
      return;
    }

    socketRef.current = new WebSocket(
      `ws://20.119.99.223:8000/ws/webrtc/${peerId}/`
    );

    socketRef.current.onopen = () => console.log("✅ WebSocket connected");

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("📩 Received WebRTC signal:", data);
      peerRef.current?.signal(data);
    };

    socketRef.current.onerror = (error) =>
      console.error("🚨 WebSocket error:", error);
  };

  // ✅ Start Call
  const startCall = async (peerId) => {
    if (!peerId) {
      console.error("❌ Cannot start call: peerId is undefined");
      return;
    }

    try {
      console.log("📞 Starting call with peerId:", peerId);

      setCallActive(true);
      setCallDuration(0);
      connectWebSocket(peerId);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;

      const peer = new Peer({
        initiator: true,
        trickle: false,
        stream,
        config: { iceServers: ICE_SERVERS },
      });

      peerRef.current = peer;

      peer.on("signal", (data) => {
        console.log("📤 Sending WebRTC signal to backend:", data);
        socketRef.current?.send(JSON.stringify(data));
      });

      peer.on("stream", (remoteStream) => {
        if (remoteVideoRef.current)
          remoteVideoRef.current.srcObject = remoteStream;
      });

      peer.on("error", (err) =>
        console.error("🚨 Peer connection error:", err)
      );

      intervalRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error("🚨 Error starting call:", error.message || error);
      setCallActive(false);
    }
  };

  // ✅ End Call
  const endCall = () => {
    if (peerRef.current) peerRef.current.destroy();
    if (socketRef.current) socketRef.current.close();
    setCallActive(false);
    setCallDuration(0);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  return {
    startCall,
    endCall,
    localVideoRef,
    remoteVideoRef,
    callActive,
    callDuration,
  };
};

export default useWebRTC;
