const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const videoPlayback = document.getElementById('videoPlayback');
const videoPlaybackControls = document.getElementById('videos');

let mediaRecorder;
let recordedChunks = [];

startBtn.addEventListener('click', async () => {
    try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
            video: true,
            audio: true
        });

        const audioStream = await navigator.mediaDevices.getUserMedia({
            audio: true
        });

        const combinedStream = new MediaStream([
            ...screenStream.getVideoTracks(),
            ...audioStream.getAudioTracks()
        ]);

        mediaRecorder = new MediaRecorder(combinedStream, {
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
            videoPlaybackControls.style.display = 'block';
            videoPlaybackControls.classList.remove('d-none');
        };

        mediaRecorder.start();

        startBtn.disabled = true;
        stopBtn.disabled = false;
    } catch (err) {
        console.error("Error starting screen recording:", err);
    }
});

stopBtn.addEventListener('click', () => {
    mediaRecorder.stop();

    startBtn.disabled = false;
    stopBtn.disabled = true;
});

function downloadVideo() {
    const videoUrl = videoPlayback.src;
    const link = document.createElement('a');
    link.href = videoUrl;
    link.download = 'myrecord.webm';
    link.click();
}

function back() {
    const back = document.getElementById('back');
    if (back) {
        back.addEventListener('click', () => {
            history.back();
        });
    }
}

back();
