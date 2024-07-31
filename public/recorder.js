const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const videoPlayback = document.getElementById('videoPlayback');

let screenRecorder, cameraRecorder;
let screenChunks = [];
let cameraChunks = [];
let screenStream, cameraStream;

startBtn.addEventListener('click', async () => {
    // Solicitar permissão para capturar a tela
    screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: { mediaSource: 'screen' }
    });

    // Solicitar permissão para capturar a câmera
    cameraStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
    });

    // Configurar o MediaRecorder para a tela
    screenRecorder = new MediaRecorder(screenStream, {
        mimeType: 'video/webm; codecs=vp9'
    });

    // Configurar o MediaRecorder para a câmera
    cameraRecorder = new MediaRecorder(cameraStream, {
        mimeType: 'video/webm; codecs=vp9'
    });

    // Manusear dados gravados da tela
    screenRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
            screenChunks.push(event.data);
        }
    };

    // Manusear dados gravados da câmera
    cameraRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
            cameraChunks.push(event.data);
        }
    };

    // Iniciar a gravação
    screenRecorder.start();
    cameraRecorder.start();

    startBtn.disabled = true;
    stopBtn.disabled = false;
});

stopBtn.addEventListener('click', () => {
    // Parar a gravação
    screenRecorder.stop();
    cameraRecorder.stop();

    screenRecorder.onstop = combineStreams;
    cameraRecorder.onstop = combineStreams;

    startBtn.disabled = false;
    stopBtn.disabled = true;
});

async function combineStreams() {
    // Verificar se ambas as gravações foram paradas
    if (screenRecorder.state === 'inactive' && cameraRecorder.state === 'inactive') {
        const screenBlob = new Blob(screenChunks, { type: 'video/webm' });
        const cameraBlob = new Blob(cameraChunks, { type: 'video/webm' });

        // Converter Blobs para URLs
        const screenUrl = URL.createObjectURL(screenBlob);
        const cameraUrl = URL.createObjectURL(cameraBlob);

        // Usar FFmpeg.js para combinar os vídeos
        const { createFFmpeg, fetchFile } = FFmpeg;
        const ffmpeg = createFFmpeg({ log: true });

        await ffmpeg.load();

        ffmpeg.FS('writeFile', 'screen.webm', await fetchFile(screenUrl));
        ffmpeg.FS('writeFile', 'camera.webm', await fetchFile(cameraUrl));

        await ffmpeg.run('-i', 'screen.webm', '-i', 'camera.webm', '-filter_complex', '[1:v]scale=320:240[pip];[0:v][pip]overlay=W-w-10:H-h-10', 'output.webm');

        const data = ffmpeg.FS('readFile', 'output.webm');
        const videoBlob = new Blob([data.buffer], { type: 'video/webm' });

        const finalUrl = URL.createObjectURL(videoBlob);
        videoPlayback.src = finalUrl;

        // Limpar URLs temporárias
        URL.revokeObjectURL(screenUrl);
        URL.revokeObjectURL(cameraUrl);
    }
}
