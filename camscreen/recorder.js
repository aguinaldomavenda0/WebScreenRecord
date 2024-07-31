const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const screenPlayback = document.getElementById('screenPlayback');
const cameraPlayback = document.getElementById('cameraPlayback');
const videoPlaybackControls = document.getElementById('videos');

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

    screenRecorder.onstop = saveScreenRecording;
    cameraRecorder.onstop = saveCameraRecording;

    startBtn.disabled = false;
    stopBtn.disabled = true;

    videoPlaybackControls.style.display = 'block'
    videoPlaybackControls.classList.remove('d-none')

});

function saveScreenRecording() {
    const screenBlob = new Blob(screenChunks, { type: 'video/webm' });
    const screenUrl = URL.createObjectURL(screenBlob);
    screenPlayback.src = screenUrl;

    // Criar link para download do vídeo da tela
    const screenDownload = document.createElement('a');
    screenDownload.classList.add('btn')
    screenDownload.classList.add('btn-primary')
    screenDownload.classList.add('mr-2')
    screenDownload.href = screenUrl;
    screenDownload.download = 'screen-recording.webm';
    screenDownload.textContent = 'Baixar Gravação da Tela';
    document.body.appendChild(screenDownload);

    // Resetar chunks para futuras gravações
    screenChunks = [];
}

function saveCameraRecording() {
    const cameraBlob = new Blob(cameraChunks, { type: 'video/webm' });
    const cameraUrl = URL.createObjectURL(cameraBlob);
    cameraPlayback.src = cameraUrl;

    // Criar link para download do vídeo da câmera
    const cameraDownload = document.createElement('a');
    cameraDownload.classList.add('btn')
    cameraDownload.classList.add('btn-primary')
    cameraDownload.classList.add('mr-2')
    cameraDownload.href = cameraUrl;
    cameraDownload.download = 'camera-recording.webm';
    cameraDownload.textContent = 'Baixar Gravação da Câmera';
    document.body.appendChild(cameraDownload);

    // Resetar chunks para futuras gravações
    cameraChunks = [];
}

function baixarVideo() {
    // Obtém a tag <video>
    const video = document.querySelector('video');
  
    // Verifica se a tag foi encontrada
    if (video) {
      // Obtém a URL do vídeo
      const videoUrl = video.src;
  
      // Cria um link de download
      const link = document.createElement('a');
      link.href = videoUrl;
      link.download = 'myrecord.mp4'; // Substitua 'meu_video.mp4' pelo nome desejado
  
      // Simula um clique no link
      link.click();
  
      // Remove o link da página
      document.body.removeChild(link);
    } else {
      console.error('Não foi encontrada nenhuma tag <video> na página.');
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