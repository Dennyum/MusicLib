import React from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar'
import SearchResults from '../SearchResults/SearchResults'
import PlayList from '../Playlist/PlayList'
import Spotify from '../../util/Sportify'

class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      searchResults: [],
      playlistName:"",
      playlistTracks:[]
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName=this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search=this.search.bind(this);
  }

  addTrack(track){
    let tracks = this.state.playlistTracks;
    if(tracks.find(savedTrack => savedTrack.id === track.id)){
      return;
    }
    tracks.push(track);
    this.setState({playlistTracks : tracks});
  }

  removeTrack(track){
    let tracks = this.state.playlistTracks;
    tracks = tracks.filter(currentTrack => currentTrack.id !== track.id);

    this.setState({playlistTracks: tracks});
  }

  updatePlaylistName(name){
    this.setState({playlistName:name});
  }

  savePlaylist(){
    const trackURIS = this.state.playlistTracks.map(track => track.uri);
    Spotify.savePlayList(this.state.playlistName, trackURIS ).then(() => {
      this.setState({
        playlistName: "New Playlist",
        playlistTracks: []
      })
    })
  }

  search(term){
    Spotify.search(term).then(searchResults => {
      this.setState({
        searchResults: searchResults
      })
    })
  }


  render(){
    return (
      <div>
          <h1>Mu<span className="highlight">sic</span>Lib</h1>
          <div className="App">
              <SearchBar onSearch={this.search} />
              <div className="App-playlist">
                <SearchResults  onAdd={this.addTrack} 
                                searchResults={this.state.searchResults}/>
                <PlayList onRemove={this.removeTrack} 
                          playlistName={this.state.playlistName} 
                          playlistTracks={this.state.playlistTracks}
                          onNameChange={this.updatePlaylistName}
                          onSave={this.savePlaylist} />
            </div>
          </div>
      </div>
    )
  }
}

export default App;
