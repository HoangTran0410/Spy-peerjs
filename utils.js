// https://github.com/peers/peerjs/issues/158#issuecomment-614779167
const createMediaStreamFake = () => {
  return new MediaStream([
    createEmptyAudioTrack(),
    createEmptyVideoTrack({
      width: 640,
      height: 480,
    }),
  ]);
};

const createEmptyAudioTrack = () => {
  const ctx = new AudioContext();
  const oscillator = ctx.createOscillator();
  const dst = oscillator.connect(ctx.createMediaStreamDestination());
  oscillator.start();
  const track = dst.stream.getAudioTracks()[0];
  return Object.assign(track, {
    enabled: false,
  });
};

const createEmptyVideoTrack = ({ width, height }) => {
  const canvas = Object.assign(document.createElement("canvas"), {
    width,
    height,
  });
  canvas.getContext("2d").fillRect(0, 0, width, height);

  const stream = canvas.captureStream();
  const track = stream.getVideoTracks()[0];

  return Object.assign(track, {
    enabled: false,
  });
};
