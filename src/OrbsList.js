import React, { useRef, useEffect } from 'react'
import { Grid,Avatar,Paper,makeStyles } from '@material-ui/core';
import { lightGreen } from '@material-ui/core/colors';
import { Player } from 'video-react';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  green: {
    color: theme.palette.getContrastText(lightGreen[500]),
    backgroundColor: lightGreen[500],   
    width: theme.spacing(7),
    height: theme.spacing(7)
  }
}));

function OrbsList ( { orbs }) {
  //console.log(orbs);
  const classes = useStyles();
  return ( orbs.map(orb => {return (
                                      <Grid item xs={4} className="video_item">
                                        <div className={classes.green}>{orb.price} bnb</div>
                                        <Player
                                            playsInline
                                            src={orb.uri} 
                                          />
                                        </Grid>)}) );
}

export default OrbsList