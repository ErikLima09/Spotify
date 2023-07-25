const songName          = document.getElementById('song-name');
const bandName          = document.getElementById('band-name');
const song              = document.getElementById('audio');
const cover             = document.getElementById('cover');
const play              = document.getElementById('play');
const next              = document.getElementById('next');
const previous          = document.getElementById('previous');
const currentProgress   = document.getElementById('current-progress');
const progressContainer = document.getElementById('progress-container');
const shuffleButton     = document.getElementById('shuffle');
const repeatButton      = document.getElementById('repeat');
const songTime          = document.getElementById('song-time');
const totalTime         = document.getElementById('total-time');
const likeButton        = document.getElementById('like');

const maquinaDoTempo = {
    songName: 'Máquina Do Tempo',
    artist: 'Matuê',
    file: 'maquina_do_tempo',
    liked: false
};
const deixeMeIr = {
    songName: 'Deixe-me Ir 2',
    artist: '1kilo',
    file: 'deixe-me_ir',
    liked: true
};
const alorsOnDanse = {
    songName: 'Alors On Danse',
    artist: 'Stromae',
    file: 'alors_on_danse',
    liked: false
};
const cupidsChokehold = {
    songName: 'Cupids Chokehold',
    artist: 'Gym Class Heroes',
    file: 'cupids_chokehold',
    liked: false
};
const iDontKnow = {
    songName: 'I Dont Know',
    artist: 'Erika',
    file: 'i_dont_know',
    liked: false
};
const ifIloseMyself = {
    songName: 'If I Lose Myself ft. Alesso (Remix)',
    artist: 'OneRepublic',
    file: 'if_i_lose_myself',
    liked: false
};
const lamourToujours = {
    songName: 'Lamour Toujours',
    artist: 'Dzeko & Torres ft. Delaney Jane (Tiësto Edit)',
    file: 'lamour_toujours',
    liked: false
};

let isPlayng = false;
let isShuffled = false;
let repeatOn = false;
let playlist = JSON.parse(localStorage.getItem('playlist'));
let sortedPlaylist = [...playlist]; // Os ... significa "espalhar"
let index = 0;


function playSong() {
    play.querySelector('.bi').classList.remove('bi-play-circle-fill');
    play.querySelector('.bi').classList.add('bi-pause-circle-fill');
    song.play();
    isPlayng = true;
}
function pauseSong() {
    play.querySelector('.bi').classList.add('bi-play-circle-fill');
    play.querySelector('.bi').classList.remove('bi-pause-circle-fill');
    song.pause();
    isPlayng = false;
}

function playPauseDecider() {
    if(isPlayng === true) {
        pauseSong();
    } else {
        playSong();
    }
}

function likeButtonRender() {
    if(sortedPlaylist[index].liked === true) {
        likeButton.querySelector('.bi').classList.remove('bi-heart'); // Procura nos elementos que estão dentro de vc um cara que tenha essa classe .bi
        likeButton.querySelector('.bi').classList.add('bi-heart-fill'); // Procura nos elementos que estão dentro de vc um cara que tenha essa classe .bi
        likeButton.classList.add('button-active');
    } else {
        likeButton.querySelector('.bi').classList.add('bi-heart'); // Procura nos elementos que estão dentro de vc um cara que tenha essa classe .bi
        likeButton.querySelector('.bi').classList.remove('bi-heart-fill'); // Procura nos elementos que estão dentro de vc um cara que tenha essa classe .bi
        likeButton.classList.remove('button-active');
    }
}

function initializeSong() {
    cover.src = `imgs/${sortedPlaylist[index].file}.png`;
    song.src  = `songs/${sortedPlaylist[index].file}.mp3`;
    songName.innerText = sortedPlaylist[index].songName;
    bandName.innerText = sortedPlaylist[index].artist;
    likeButtonRender();
}
function previousSong() {
    if(index === 0) {
        index = 0;
    } else {
        index -= 1;
    }
    initializeSong();
    playSong();
}
function nextSong() {
    if(index === sortedPlaylist.length) {
        index = 0
    } else {
        index += 1
    }
    initializeSong();
    playSong();
}

function updateProgress() {
    const barWidth = (song.currentTime/song.duration)*100;
    currentProgress.style.setProperty('--progress', `${barWidth}%`);
    songTime.innerText = toHHMMSS(song.currentTime);
}

function  jumpTo(event) {
    const width = progressContainer.clientWidth // Largura total do elemento
    const clickPosition =  event.offsetX // O quanto eu cliquei em pixel a partir do canto esquerdo
    const jumpToTime = (clickPosition/width)* song.duration; //Tempo em segundos pra onde a musica vai
    song.currentTime = jumpToTime
}

function shuffleArray(preShuffleArray) {
    let size = preShuffleArray.length;
    let currentIndex = size - 1;
    while(currentIndex > 0) {
       let randomIndex = Math.floor(Math.random()* size);
       let aux = preShuffleArray[currentIndex];
       preShuffleArray[currentIndex] = preShuffleArray[randomIndex];
       preShuffleArray[randomIndex] = aux;
       currentIndex -= 1;
    }
}

function shuffleButtonClicked() {
    if(isShuffled === false) {
        isShuffled = true;
        shuffleArray(sortedPlaylist);
        shuffleButton.classList.add('button-active') //Adição de mais uma classe pra torna-lo verde
    } else {
        isShuffled = false;
        sortedPlaylist = [...playlist]
        shuffleButton.classList.remove('button-active')
    }
}

function repeatButtonClicked() {
    if(repeatOn === false) {
        repeatOn = true;
        repeatButton.classList.add('button-active');
    } else {
        repeatOn = false;
        repeatButton.classList.remove('button-active');
    }
}

function nextOrRepeat() {
    if(repeatOn === false) {
        nextSong();
    } else {
        playSong();
    }
}

function toHHMMSS(originalNumber) {
    let hours = Math.floor(originalNumber/3600);
    let minutes = Math.floor((originalNumber - hours * 3600)/60); 
    let seconds = Math.floor(originalNumber - hours* 3600 - minutes* 60);

    return (`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
}

function updateTotalTime() {
    totalTime.innerText = toHHMMSS(song.duration);
}

function likeButtonClicked() {
    if(sortedPlaylist[index].liked === false) {
        sortedPlaylist[index].liked = true
    } else {
        sortedPlaylist[index].liked = false
    }
    likeButtonRender();
    localStorage.setItem('playlist', JSON.stringify(playlist)); // Registre um item
    
}


initializeSong();

play.addEventListener('click', playPauseDecider); 
previous.addEventListener('click', previousSong);
next.addEventListener('click', nextSong);
song.addEventListener('timeupdate', updateProgress);
song.addEventListener('ended',nextOrRepeat);
song.addEventListener('loadedmetadata', updateTotalTime);
progressContainer.addEventListener('click',jumpTo);
shuffleButton.addEventListener('click', shuffleButtonClicked);
repeatButton.addEventListener('click', repeatButtonClicked);
likeButton.addEventListener('click', likeButtonClicked);
