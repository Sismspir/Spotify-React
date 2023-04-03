import { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';
import SpotifyWebApi from 'spotify-web-api-js';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';


const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
  },
  appBar: {
    backgroundColor: '#301934',
  },
  title: {
    flexGrow: 1,
  },

  table: {
    '&::-webkit-scrollbar': {
      display: 'none',
    },
    paddingRight: '30px',
  },
  newTable: {
    minWidth: 650, // sets the minimum width of the table to 650px
    border: '1px solid #ccc', // sets a border for the table
    '& th': {
      backgroundColor: '#f0f0f0', // sets a background color for the table header cells
      fontWeight: 'bold', // sets a bold font weight for the table header cells
    },
    '& td': {
      padding: '10px', // sets padding for the table cells
    },
  },
  bold: {
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
}));

const Navbar = (props) => {
  const classes = useStyles();
  const [showUsers, setShowUsers] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
      setShowUsers(!showUsers);
  };

  const handleSelectedUser = (track) => {
    props.setTracks(prevTracks => prevTracks.filter(t => t.id !== track.id));
    alert(`${track.name} deleted successfully!`)
  };
  
  const handleClickAbout = () => {
    setIsOpen(!isOpen);
    setShowUsers(false)
  }

    const CLIENT_ID = "1e7b871c063e4cf699dbfac790b0e86a";
    const REDIRECT_URI = "http://localhost:3000";
    const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
    const RESPONSE_TYPE = "token";
    const [token, setToken] = useState("")
    const spotifyApi = new SpotifyWebApi();
    spotifyApi.setAccessToken(token);
  
    const logout = () => {
      setToken("");
      window.localStorage.removeItem("token")
  }
  
    useEffect(() => {
      const hash = window.location.hash
      let token = window.localStorage.getItem("token")
  
      if (!token && hash) {
          token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]
  
          window.location.hash = ""
          window.localStorage.setItem("token", token)
      }
  
      setToken(token);
      props.setToken(token);
      window.addEventListener('beforeunload', () => {
        logout();
      });
  }, [props])

  return (
    <div className={classes.root}>
      <AppBar position="static" className={classes.appBar}>
        <Toolbar>
            <Typography variant="h6" className={classes.title}>
            Spotify React
            </Typography>
            <Button color="inherit" onClick={handleClickAbout}>About</Button>
            <Button color="inherit" onClick={handleClick}>Playlist</Button>
            {!token ?
            <Button 
            color="inherit" component="a"  href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}>Log In</Button>
            : <Button  
            color="inherit" onClick={logout}>Logout</Button>}
        </Toolbar>
      </AppBar>
      {(showUsers) && (
        <TableContainer className={classes.table} component={Paper}>
          <Table className={classes.newTable}>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Artist</TableCell>
                <TableCell>Song</TableCell>
                <TableCell>Delete</TableCell>   
              </TableRow>
            </TableHead>
            <TableBody>
              {props.tracks.map(track => (
                <TableRow key={track.id}>
                  <TableCell>{track.id.substring(0, 3)}</TableCell>
                  <TableCell>{track.artist}</TableCell>
                  <TableCell>{track.name}</TableCell>
                  <TableCell>
                    <Button size="small" variant="contained" color="secondary" onClick={() => handleSelectedUser(track)}> Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {(isOpen) && ( <Dialog
        open={isOpen}
        onClose={handleClickAbout}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Spotify React"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
          This is a React app that uses the Spotify API. You can search for your favorite artists and create your own playlist. Furthermore, you can click on each image to view the number of followers your favorite artist has.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClickAbout} color="primary" autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>)}
    </div>
  );
};

export default Navbar;