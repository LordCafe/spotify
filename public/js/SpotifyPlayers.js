const Refresh = (event) => {
    let urlParams = new URLSearchParams(location.search);
    const Refreshtoken = urlParams.get('refresh_token');
    let url = '/refresh_Spotify?refresh_token=' + Refreshtoken;
    fetch(url).then((result) => {
        return result.json();
    }).then((data) => {
        console.log(data);

    });
}


window.onSpotifyWebPlaybackSDKReady = () => {
    let urlParams = new URLSearchParams(location.search);
    const token = urlParams.get('access_token');
    const player = new Spotify.Player({
        name: 'snapmusic',
        getOAuthToken: cb => { cb(token); }
    });



    // Error handling
    player.addListener('initialization_error', ({ message }) => { console.error(message); });
    player.addListener('authentication_error', ({ message }) => { console.error(message); });
    player.addListener('account_error', ({ message }) => { console.error(message); });
    player.addListener('playback_error', ({ message }) => { console.error(message); });

    // Playback status updates
    player.addListener('player_state_changed', state => { console.log(state); });

    // Ready
    player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
    });

    // Not Ready
    player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
    });

    // Connect to the player!
    player.connect();
};

class SpotifyPlayers {
    constructor({ token }) {
        this.token = token
    }


    Search(params) {
        let Data = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.token,

            }
        }
        let urlSpotify = 'https://api.spotify.com/v1/search';
        var url = new URL(urlSpotify);
        Object.keys(params).forEach(function(key) {
            url.searchParams.append(key, params[key]);
        });
        return fetch(url, Data).then((data) => {
            return data.json();
        }).then((result) => {
            return result
        });
    }

    GetInfo = () => {
        let url = 'https://api.spotify.com/v1/me';
        let options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.token,

            }
        }
        return fetch(url, options).then((result) => {
            return result.json();
        });
    }

}

let urlParams = new URLSearchParams(location.search);
const token = urlParams.get('access_token');
let SpotifySnap = new SpotifyPlayers({
    token: token

});

let albumHtml = ({ id, src, name, artist }) => {
    let matchAlbum = `    
        <div id="${id}" class="row spotify-result" >
            <div class="col-1">
                <i class="fa fa-music"></i>        
            </div>
            <div class="col-8" >
                <div>
                    <h5 class="spotify-title">${name}</h5>
                    <p class="spotify-text">${artist}</p>                            
                </div>
            </div>              
        </div>
     `;

    return matchAlbum;
}




document.addEventListener('DOMContentLoaded', function(event) {
    SpotifySnap.GetInfo().then((user) => {
        let { images: [avatar], display_name } = user;
        let profile = document.querySelector('#profile-spotify');
        profile.querySelector('img').src = avatar.url;
        profile.querySelector(".card-title").innerText = display_name;

    });
});