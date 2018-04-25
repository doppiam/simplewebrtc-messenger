window.addEventListener('load', () => {

  const chatRoomTemplate = Handlebars.compile($('#chat-room-template').html());

  const localVideoEl = $('#local-video');
  const remoteVideoEl = $('#remote-video');
  const localImageEl = $('#local-image');
  const remoteImageEl = $('#remote-image');
  const chatEl = $('#chat');
  const formEl = $('form');

  // Webrtc data
  let webrtc;
  let room;

  // Chat data
  const messages = [];
  let username;

  // Hide cameras until they are initialized
  localVideoEl.hide();
  remoteVideoEl.hide();

   // create our webrtc connection
  const createWebrtc = () => {
    return new SimpleWebRTC({
      // the id/element dom element that will hold "our" video
      localVideoEl: 'local-video',
      // the id/element dom element that will hold remote videos
      remoteVideosEl: 'remote-video',
      // immediately ask for camera access
      autoRequestMedia: true,
      debug: false,
      detectSpeakingEvents: true,
      autoAdjustMic: false
    });

    // We got access to local camera
    webrtc.on('localStream', (stream) => {
      localImage.hide();
      localVideo.show();
    });
  }

  // Form Validation Rules
  formEl.form({
    fields: {
      room: 'empty',
      username: 'empty',
    },
  });
  $('#create-btn').on('click', () => {
    if (!formEl.form('is valid')) {
      return false;
    }
    const roomName = $('#room').val().toLowerCase().replace(/\s/g, '-').replace(/[^A-Za-z0-9_\-]/g, '');
    console.info(`Creating new room: ${roomName}`);

    webrtc = createWebrtc();

    webrtc.createRoom(roomName, (err, name) => {
      let room = name;
      formEl.form('clear');
      showChatRoom();
    });

    // We got access to local camera
    webrtc.on('localStream', (stream) => {
      localImageEl.hide();
      localVideoEl.show();
    });

    return false;
  });

  const receiveMessage = () => {

  }

  const postMessage = () => {

  }

  const showChatRoom = () => {
    formEl.hide();
    const html = chatRoomTemplate({ messages });
    chatEl.html(html);
  }

  const createRoomHandler = () => {
    if (!formEl.form('is valid')) {
      return false;
    }
    const roomName = $('#room').val().toLowerCase().replace(/\s/g, '-').replace(/[^A-Za-z0-9_\-]/g, '');
    console.log(roomName);
    webrtc.createRoom(roomName, (err, name) => {
      console.log(' create room cb');
      const newUrl = location.pathname + '?' + name;
      if (!err) {
        history.replaceState({ foo: 'bar' }, null, newUrl);
        setRoom(name);
        $('form').form('clear');
      } else {
        console.log(err);
      }
    });
    return false;
  }

});