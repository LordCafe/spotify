let querystring = require('querystring');
let request = require('request');
let { generateRandomString, authOptions, RefreshAuth } = require('./helpersSpotify.js');

var stateKey = 'spotify_auth_state';
let client_id = '8710e416ce234171976128df1c02d93c';
let scope = 'user-read-private user-read-email';
let client_secret = '4799786a0c394f9ba9800dbe26574cc2';
let redirect_uri = 'http://localhost:3000/spotify';

module.exports = function(app) {
    app.get('/loginSpo', function(req, res) {
        var state = generateRandomString(16);
        res.cookie(stateKey, state);
        let dataQuery = querystring.stringify({
            response_type: 'code',
            client_id: client_id,
            scope: scope,
            redirect_uri: redirect_uri,
            state: state
        });

        let AuthUrl = 'https://accounts.spotify.com/authorize?' + dataQuery;     
        res.redirect(AuthUrl);

    });

    app.get('/spotify', (req, res) => {
        let { code = null, state = null } = req.query;
        let storeState = req.cookies ? req.cookies[stateKey] : null;
        if (state == null || state !== storeState) {
            let misMatch = querystring.stringify({
                error: 'state_mismatch'
            });
            res.redirect('/#' + misMatch);
        } else {
            res.clearCookie(stateKey);
            let AuthOptions = authOptions(code, client_id, client_secret, redirect_uri);
            request.post(AuthOptions, function(error, response, body) {
                if (!error && response.statusCode === 200) {
                    let { access_token, refresh_token } = body;
                    let Access = querystring.stringify({
                        access_token: access_token,
                        refresh_token: refresh_token
                    });

                    res.redirect('/playSpotify?' + Access);

                } else {

                    res.redirect('/#' +
                        querystring.stringify({
                            error: 'invalid_token'
                        }));
                }
            });


        }

    });


    app.get('/spotifyMe', function(req, res) {
        var access_token  = req.query.access_token;
        var options = {
            url: 'https://api.spotify.com/v1/me',
            headers: { 'Authorization': 'Bearer ' + access_token },
            json: true
        };

        // use the access token to access the Spotify Web API
        request.get(options, function(error, response, body) {
            res.json( body );
        });
    });
    app.get('/playSpotify', (req, res) => {
        res.render('spotify',{
        	layout:'SnapSpotify',
        	helpers:{
        		title:'Play spotify'
        	}
        });
    });

    app.get('/refresh_Spotify', function(req, res) {
        // requesting access token from refresh token
        var refresh_token = req.query.refresh_token;   
        let AuthOptions = RefreshAuth(client_id, client_secret, refresh_token);

        request.post(AuthOptions, function(error, response, body) {
          
            if (!error && response.statusCode === 200) {
                var access_token = body.access_token;               
                res.json({
                    'access_token': access_token
                });
            }else{
            	res.json( 	body );
            }
        });
    });


}