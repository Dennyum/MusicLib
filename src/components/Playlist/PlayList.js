import React from 'react'
import TrackList from '../TrackList/TrackList'
import './PlayList.css'

class PlayList extends React.Component{
    constructor(props){
        super(props);
        this.handleNameChange=this.handleNameChange.bind(this);
    }

    handleNameChange(e){
        let newPlaylistName = e.target.value;
        this.props.onNameChange(newPlaylistName)
    }
    

    render(){
        return (
            <div className="Playlist">
                <input onChange={this.handleNameChange} defaultValue={"New Playlist"}/>
                <TrackList onRemove={this.props.onRemove} 
                           tracks={this.props.playlistTracks} 
                           isRemoval={true}/>
                <button className="Playlist-save" onClick={this.props.onSave} >SAVE TO SPOTIFY</button>
            </div>
        )
    }
}

export default PlayList;