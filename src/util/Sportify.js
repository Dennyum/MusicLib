const clientID = '928232fecb6b4188ac5b9072cb2ec149'
const redirectURI = 'http://FernandoPereira.surge.sh'

let accessToken ;

const Spotify = {
    getAccessToken(){
        if(accessToken){
            return accessToken
        }

        // Chek fot acces token match
        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

        if(accessTokenMatch && expiresInMatch){
            accessToken = accessTokenMatch[1];
            const expiresIn = Number(expiresInMatch[1]);

            // Clear aprameter and grab another access token when it expire
            window.setTimeout(() => accessToken = '',expiresIn* 1000);
            window.history.pushState('Access Token', null, '/');
            return accessToken;
        }else{
            const accessURL = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
            window.location = accessURL;
        }
    },
    search(term){
        const accessToken = Spotify.getAccessToken();
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`,{
            headers:{
                Authorization: `Bearer ${accessToken}`
            }
        }).then(response => {
            return response.json()
        }).then(jsonResponse => {
            if(!jsonResponse){
                return [];
            }
            return jsonResponse.tracks.items.map(track => ({
                id: track.id,
                name: track.name,
                artist: track.artists[0].name,
                album: track.album.name,
                uri: track.uri
            }));
        });
    },

    savePlayList(name, trackUris){
         if(!name || !trackUris.length){
             return
         }
         const accessToken = Spotify.getAccessToken();
         const headers = { Authorization : `Bearer ${accessToken}`};
         let userID;

         return fetch('https://api.spotify.com/v1/me',{headers: headers}
         ).then(response => response.json()
         ).then(jsonResponse => {
             userID = jsonResponse.id;
             return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`,{
                 headers:headers,
                 method: 'POST',
                 body: JSON.stringify({name:name})
             }).then(response => response.json()
             ).then(jsonResponse => {
                 const playlistId = jsonResponse.id;
                 return fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistId}/tracks`,{
                     headers:headers,
                     method: 'POST',
                     body: JSON.stringify({uris:trackUris})
                 })
             })
         })

    }
}

export default Spotify;















