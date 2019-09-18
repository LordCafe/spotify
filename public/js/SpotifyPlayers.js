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

class SpotifyPlayers {
    constructor({ token }) {
        this.token = token;
        this.device = null;
    }

    SetDevide(id){
        this.device = id; 
        console.log("device ready");
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

    GetLastPlayed() {
        let url = 'https://api.spotify.com/v1/me/player/recently-played';
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


    PlaySong(idtrack){
        
        return  fetch(`https://api.spotify.com/v1/me/player/play?device_id=${this.device}`, {
            method: 'PUT',
            body: JSON.stringify({ uris: [idtrack] }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`
            },
        }).then((data)=>{
            
        });

    }



}





let albumHtml = ({ id, src, name, artist }, all ) => {
    console.log(all);
    let matchAlbum = `    
        <div id="${id}" class="row spotify-result" >           
           
            <div class='col-1'>            
                 <i class="fa fa-play"></i>      
            </div>               
            <div class='col-8'>
                <div>
                    <span class="spotify-title">${name}</span>
                <div>
                
                <span class="spotify-artist">${ artist }</span> *
                <span class="spotify-album">${ all.album.name }</span> 
            </div>                               
                    
                   
                          
        </div>
     `;

    return matchAlbum;
}




