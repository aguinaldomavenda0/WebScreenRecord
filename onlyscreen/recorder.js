const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const videoPlayback = document.getElementById('videoPlayback');
const videoPlaybackControls = document.getElementById('videos');

let mediaRecorder;
let recordedChunks = [];

startBtn.addEventListener('click', async () => {
    
    const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { mediaSource: 'screen' }
    });

    
    mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm; codecs=vp9'
    });

    
    mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
            recordedChunks.push(event.data);
        }
    };
 
    mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunks, {
            type: 'video/webm'
        });
        recordedChunks = [];

        const url = URL.createObjectURL(blob);
        videoPlayback.src = url;
        videoPlaybackControls.style.display = 'block'
        videoPlaybackControls.classList.remove('d-none')
        
    };

    // Iniciar a gravação
    mediaRecorder.start();

    startBtn.disabled = true;
    stopBtn.disabled = false;
});

stopBtn.addEventListener('click', () => {
    // Parar a gravação
    mediaRecorder.stop();

    startBtn.disabled = false;
    stopBtn.disabled = true;
});


function downloadVideo() { 
    const video = document.querySelector('video'); 
    if (video) {
      const videoUrl = video.src;
      const link = document.createElement('a');
      link.href = videoUrl;
      link.download = 'myrecord.mp4';
      link.click(); 
      document.body.removeChild(link);
    } 
  }

  function back() {
    const back = document.getElementById('back');
    if(back){
        back.addEventListener('click', () => {
            history.back();
        });
    }
  }

  back();