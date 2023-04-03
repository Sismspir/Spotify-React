import React, { useState, useEffect, useCallback} from 'react';
import react from '../src/react.jpg';
import Personal from './personal';
import Navbar from './navbar.js';
import axios from 'axios';
import SpotifyWebApi from 'spotify-web-api-js';
import { TextField } from '@mui/material';
import '../src/index.css';

function Spotify() {
  const [name] = useState();
  const [isShown, setIsShown] = useState(false);
  const [btnIsShown, setBtnIsShown] = useState(false);
  const [dt, setDt] = useState(new Date().toLocaleString());
  const [updatedName, setUpdatedName] = useState();
  const [setSelectedUser] = useState(null);
  const [num, setNum] = useState(5);
  const [searchKey, setSearchKey] = useState("");
  const [artists, setArtists] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [token, setToken] = useState("");
  const [activeId, setActiveId] = useState(-1);
  const [isClicked, setIsClicked] = useState(false);
  const [personalName, setPersonalName] = useState();
  const [followers, setFollowers] = useState();
  const spotifyApi = new SpotifyWebApi();

  useEffect(() => {
      let secTimer = setInterval( () => {
        setDt(new Date().toLocaleString())
      },1000)
      return () => clearInterval(secTimer);
}, [dt]);
  // handles the songs selector
  const handleClick = e => {
    setIsShown(!isShown);
    if(btnIsShown) {
      setBtnIsShown(false);
    }
  };

  const handleBtnClick = e => {
    setBtnIsShown(!btnIsShown);
    if(isShown) {
      setIsShown(false);
    }
  };

  const handleNameChange = (newName) => {
    setUpdatedName(newName);
  };

  spotifyApi.setAccessToken(token);

const searchArtists = async (e) => {
  if (token == null) {
    alert("You have to log in first.");
  };
  e.preventDefault()
  const {data} = await axios.get("https://api.spotify.com/v1/search", {
      headers: {
          Authorization: `Bearer ${token}`
      },
      params: {
          q: searchKey,
          type: "artist"
      }
  });

  const artists = data.artists.items;
  const promises = artists.map((artist) => {
    return spotifyApi.getArtistTopTracks(artist.id, "MA");
  });

  const topTracks = await Promise.all(promises);
  setArtists(artists.map((artist, index) => {
    return {
      ...artist,
      topTracks: topTracks[index].tracks.slice(0, num)
    };
  }));
  console.log(token, "ok");
}

const handlePicClick = useCallback( (id, artist, followers) => {
  setActiveId(id);
  setIsClicked(!isClicked);
  setPersonalName(artist);
  setFollowers(followers.total);
 
} , [isClicked]);

const handleSelectedSong = (id, artist, name) => {
  const newTrack = {id: id, artist: artist, name: name};
  const isFound = tracks.some(element => {
    if (element.id === newTrack.id) {
      return true;
    } else {
      return false;
    };
  })
  if (isFound) {
    alert("The track already exists in your list.");
    } else {
      alert(`${newTrack.name} added successfully!`)
      setTracks([...tracks, newTrack]);
    };
};

const handleNumChange = (event) => {
  setNum(event.target.value)
};

const renderArtists = () => {
  
  const rows = [];
  for (let i = 0; i < artists.length; i += 3) {
    const row = [];
    for (let j = i; j < i + 3 && j < artists.length; j++) {
      const artist = artists[j];
      row.push(
        <div key={artist.id} 
          className="transform"
          style={{
            position: 'relative',
            top: 0,
            left: 0,
            width: '30%',
            display: 'inline-block',
            verticalAlign: '',
            boxSizing: 'border-box',
            margin: '5px 15px 5px 15px'
          }}>
          <div style={{ padding: '5px 2px 20px 2px', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '1px 2px 3px #857474'}}>
          {artist.images.length ?   
          <img onClick={() => handlePicClick(artist.id, artist.name, artist.followers)}  style={{ borderRadius: '50%'}} width={"55%"} height={"150vh"} src={artist.images[0].url} alt=""/>
           : <div>{/*No Image*/}</div>}
           {/* on click dsiplays followers! */}
          {(artist.id === activeId && isClicked) && <div style={{ zIndex: '2', top: 0, marginTop: '4px', backgroundColor: '#ff7f00', padding: '5px', fontWeight: 'bold', borderRadius: '5px' }}>{artist.name}: {artist.genres}</div>}
          <table>
            <thead>
              <tr>
                <th style={{ textAlign: "center", width: "100%" }}>
                  {artist.name}</th>
              </tr>
            </thead>
            <tbody>
              {artist.topTracks.map(track =>
                <tr key={track.id} className='flexible'>
                  <td className='flexible'>{track.name} 
                  <button className='check-btn' onClick={() => handleSelectedSong(track.id, artist.name, track.name)}><span className='spaan'>Add</span></button></td>
                </tr> 
              )}
            </tbody>
          </table>
          </div>
        </div>
      );
    }
    rows.push(
      <div key={`row-${i}`} style={{ clear: '' }}>
        {row}
      </div>
    );
  }

  return rows;
}

  return (
  <div className='navbar'>
      <Navbar setSelectedUser={setSelectedUser} setToken={setToken} tracks={tracks} setTracks={setTracks}></Navbar>
  <div className='container'>
      <div className="App">
        </div>
  <div className='name'>
    <img className='react' src={react} alt="React"></img>
    <h2 className='custom-h2'> Find your favourite songs..</h2>
     <form className="flexible" onSubmit={searchArtists}>
        <TextField
          placeholder=""
          label="Pick your favourite artist!"
          variant="outlined"
          margin="normal"
          value={name}
          onChange={e => setSearchKey(e.target.value)}
          InputProps={{
            style: {
              backgroundColor: '#d5d0f5', 
              width: '100%',  },}}
        />
        <button className="gradient-button" type={"submit"}>Search</button>
      </form>
      <div style={{ display: 'none' }}>

      {/*React reads the first truthy value */}
      <Personal name={updatedName || name}  onNameChange={handleNameChange}/>
      </div>
        <div className='buttons'>
           <div className='flexible'>
                <button className='btn'
                onClick={handleClick}> Songs selector</button>
                {isShown && <form className='numform'>
                  <label className='numlabel'>
                    Display top {num} songs:
                  </label>
                  <select id="num" name="number" value={num} onChange={handleNumChange} className='numselect'>
                    <option value="">-</option>
                    <option value={5}>5</option>
                    <option value={6}>6</option>
                    <option value={7}>7</option>
                    <option value={8}>8</option>
                    <option value={9}>9</option>
                    <option value={10}>10</option>
                  </select>
                </form>
                    }          
            </div> 
            <div className='flexible'>
                <button className='btn'
                onClick={handleBtnClick}> Personal info</button>
                {btnIsShown && <Personal name={"" || personalName} followers={followers} onNameChange={handleNameChange}/>}
            </div>    
        </div>
     </div>
    </div>
    {renderArtists()}
  <div className='footer'>
  <h3>Spotify Playlist App {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</h3>
  </div>
  </div>  
  );
}

export default Spotify;