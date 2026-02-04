// export const startScreenRecording = async (onStop) => {
//   const screenStream = await navigator.mediaDevices.getDisplayMedia({
//     video: true,
//     audio: false,
//   });

//   const webcamStream = await navigator.mediaDevices.getUserMedia({
//     video: true,
//     audio: true, // this line records audio from webcam, if it turn off, no audio will be recorded
//   });

//   const canvas = document.createElement("canvas");
//   canvas.width = 1280;
//   canvas.height = 720;
//   const ctx = canvas.getContext("2d");

//   const screenVideo = document.createElement("video");
//   screenVideo.srcObject = screenStream;
//   screenVideo.play();

//   const camVideo = document.createElement("video");
//   camVideo.srcObject = webcamStream;
//   camVideo.play();

//   const draw = () => {
//     ctx.drawImage(screenVideo, 0, 0, canvas.width, canvas.height);
//     ctx.drawImage(camVideo, canvas.width - 320, canvas.height - 240, 300, 220);
//     requestAnimationFrame(draw);
//   };
//   draw();

//   const canvasStream = canvas.captureStream(30);
//   const combinedStream = new MediaStream([
//     ...canvasStream.getVideoTracks(),
//     ...webcamStream.getAudioTracks(),
//   ]);

//   const recorder = new MediaRecorder(combinedStream);
//   // recorder.stream = combinedStream; // ✅ VERY IMPORTANT
//   let chunks = [];

//   recorder.ondataavailable = (e) => chunks.push(e.data);

//   recorder.onstop = () => {
//     const blob = new Blob(chunks, { type: "video/webm" });
//     onStop(blob);


//       // 🔥 FORCE STOP EVERYTHING
//     // screenStream.getTracks().forEach((t) => t.stop());
//     // webcamStream.getTracks().forEach((t) => t.stop());
//     // canvasStream.getTracks().forEach((t) => t.stop());
//   };

//   recorder.start();

//   return recorder;
// };


export const startScreenRecording = async (onStop) => {
  // 🎥 Screen
  const screenStream = await navigator.mediaDevices.getDisplayMedia({
    video: true,
    audio: false,
  });

  // 🎥 Webcam + 🎤 Mic
  const webcamStream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  });

  // 🧠 Canvas
  const canvas = document.createElement("canvas");
  canvas.width = 1280;
  canvas.height = 720;
  const ctx = canvas.getContext("2d");

  const screenVideo = document.createElement("video");
  screenVideo.srcObject = screenStream;
  screenVideo.play();

  const camVideo = document.createElement("video");
  camVideo.srcObject = webcamStream;
  camVideo.play();

  const draw = () => {
    ctx.drawImage(screenVideo, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(camVideo, canvas.width - 320, canvas.height - 240, 300, 220);
    requestAnimationFrame(draw);
  };
  draw();

  // 🎞 Canvas stream
  const canvasStream = canvas.captureStream(30);

  // 🎬 Final combined stream
  const combinedStream = new MediaStream([
    ...canvasStream.getVideoTracks(),
    ...webcamStream.getAudioTracks(),
  ]);

  const recorder = new MediaRecorder(combinedStream);


  let chunks = [];
  recorder.ondataavailable = (e) => chunks.push(e.data);

  recorder.onstop = () => {
    const blob = new Blob(chunks, { type: "video/webm" });
    onStop(blob);

    // 🔥 FORCE STOP EVERYTHING
    screenStream.getTracks().forEach((t) => t.stop());
    webcamStream.getTracks().forEach((t) => t.stop());
    canvasStream.getTracks().forEach((t) => t.stop());
  };

  recorder.start();
  return recorder;
};
