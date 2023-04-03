import React, { useState,} from 'react';
import Button from "@material-ui/core/Button";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogContent from "@material-ui/core/DialogContent";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";


export default function Personal(props) {
    const [updated , setUpdated] = useState(false);
    const handleClick = () => {
        setUpdated(!updated);    
      } 
  
    return (
        <div>
          <Dialog open={updated}>
            <DialogTitle id="alert-dialog-title">Artist Info</DialogTitle>
            <DialogContent>
          <DialogContentText id="alert-dialog-description">
          <div style={{fontWeight: "bold"}}>{props.name}: {props.followers} followers</div>
              </DialogContentText>
                   </DialogContent>
                      <DialogActions>
                        <Button onClick={handleClick} color="primary" autoFocus>
                  Close
                      </Button>
                     </DialogActions>
              </Dialog>
              <div className='centered'>
              <Button variant="contained" 
              color="primary" onClick={handleClick}>click me!</Button>
         </div>
      </div>
    );
}
