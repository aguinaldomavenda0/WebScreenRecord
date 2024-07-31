const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const videoPlayback = document.getElementById('videoPlayback');
const videoPlaybackControls = document.getElementById('videos');

let mediaRecorder;
let recordedChunks = [];

startBtn.addEventListener('click', async () => {
    // Solicitar permissão para capturar a tela
    const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { mediaSource: 'screen' }
    });

    // Configurar o MediaRecorder
    mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm; codecs=vp9'
    });

    // Manusear dados gravados
    mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
            recordedChunks.push(event.data);
        }
    };

    // Manusear o final da gravação
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