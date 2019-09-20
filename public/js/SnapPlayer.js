let SearchResult = document.querySelector('#result');
let PreviusItems = document.querySelector('#Previus');
var player;
let Crono;
let controls = {
    click: function(e) {
        e.classList.toggle('fa-play-circle');
        e.classList.toggle('fa-pause-circle');
        player.togglePlay();
    }
}



let timer = function(ms, partial) {
    let timerDom = document.querySelector('#time');
    let status = parseInt(timerDom.dataset.init)
    if (!status) {
        min = Math.floor((ms / 1000 / 60) << 0);
        sec = Math.floor((ms / 1000) % 60);
        document.querySelector('#mins').innerText = min;
        document.querySelector('#seconds').innerText = sec;
        let minus = 0;
        timerDom.dataset.init = 1;
        Crono = setInterval(function() {
            let nms = ms - minus;
            nmin = Math.floor((nms / 1000 / 60) << 0);
            nsec = Math.floor((nms / 1000) % 60);

            let porc = ms - nms;
            let total = (100 * porc) / ms;
            document.querySelector('#progressTimer').style.width = total + '%';
            document.querySelector('#pmins').innerText = nmin;
            document.querySelector('#pseconds').innerText = nsec;
            if (nms <= 0) {
                timerDom.dataset.init = 0;
                clearInterval(Crono);

            } else {
                minus = minus + 500;
            }
        }, 500);
    }

}

let RenderPreview = (track) => {
    let Preview = document.querySelector("#currentSong");
    return new Promise((resolve, fail) => {
        let { album, uri } = track;
        if (uri != Preview.dataset.trackId) {
            Preview.dataset.trackId = track.uri;
            Preview.querySelector('img').src = album.images[0].url;
            Preview.querySelector('.card-title').innerText = track.name;
            Preview.querySelector('.card-text').innerText = track.artists[0].name;
            Preview.Song = track;
            let LoadSong = new CustomEvent('LoadSong', {
                detail: track
            });
            Preview.dispatchEvent(LoadSong);
            let target = document.querySelector('#result').innerHTML = '';
            resolve({ track: track, dom: Preview });
        }

    });

}


let CreateListPlayer = function(track) {
    let { target, SnapApi } = this;
    let { album } = track;
    let html = albumHtml({ id: track.id, src: album.images[0].url, name: track.name, artist: track.artists[0].name }, track);
    let ghost = document.createElement('div');
    ghost.insertAdjacentHTML('beforeend', html);
    let InList = target.querySelector('#' + ghost.lastElementChild.id) || false;
    if (!InList) {
        target.appendChild(ghost.lastElementChild);
        let newBorn = target.lastElementChild;
        newBorn.addEventListener('click', () => {
            RenderPreview(track).then(function({ track, dom }) {
                SnapApi.PlaySong(track.uri);
            });

        }, false);
    }
}





let PlayerSnapPlugin = () => {


    let Preview = document.querySelector("#currentSong");
    let ShowPlay = () => {
        let button = Preview.querySelector('i[data-status="play"]');
        button.classList.remove('fa-play-circle');
        button.classList.add('fa-pause-circle');
    }
    let ShowPaused = () => {
        let button = Preview.querySelector('i[data-status="play"]');
        button.classList.remove('fa-pause-circle');
        button.classList.add('fa-play-circle');
    }


    Preview.addEventListener('LoadSong', function(event) {
        let { detail } = event;
        clearInterval(Crono);
        let timerDom = document.querySelector('#time');
        timerDom.dataset.init = 0;
        timer(detail.duration_ms, 0);
    }, false);


    Preview.addEventListener('Play', function(event) {
        let { detail } = event;
        timer(detail.duration, detail.position);
        ShowPlay();
    }, false);

    Preview.addEventListener('Paused', function(event) {
        let timer = document.querySelector('#time');
        timer.dataset.init = 0;
        ShowPaused();
        clearInterval(Crono);
    }, false);
};


let PlayerEvents = function(player, SpotifySnap) {
    let Preview = document.querySelector("#currentSong");
    // Error handling
    player.addListener('initialization_error', ({ message }) => { console.error(message); });
    player.addListener('authentication_error', ({ message }) => { window.location.href = 'loginSpo'; });
    player.addListener('account_error', ({ message }) => { console.error(message); });
    player.addListener('playback_error', ({ message }) => { console.error(message); });
    // Playback status updates
    player.addListener('player_state_changed', state => {
        let { track_window } = state;
        let EventTracks;
        if (state.paused) {
            EventTracks = new CustomEvent('Paused', {
                detail: state
            });
        } else {
            EventTracks = new CustomEvent('Play', {
                detail: state
            });
        }

        Preview.dispatchEvent(EventTracks);

    });
    // Ready
    player.addListener('ready', ({ device_id }) => {
        SpotifySnap.SetDevide(device_id);
    });

    // Not Ready
    player.addListener('not_ready', ({ device_id }) => {});

    // Connect to the player!
    player.connect().then((connect) => {
        console.log(connect);
        PlayerSnapPlugin();
    });

}