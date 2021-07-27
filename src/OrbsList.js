import React, { useRef, useEffect } from 'react'
import { Grid,Button,Paper,makeStyles } from '@material-ui/core';
import { lightGreen } from '@material-ui/core/colors';
import { Player } from 'video-react';
import web3 from 'web3';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& > *': {
      margin: theme.spacing(1),
    },
  }
}));

function OrbsList ( { orbs,accounts }) {
  //console.log(orbs);
  const classes = useStyles();
  return ( orbs.map(orb => {return (
                                      <Grid item xs={4} className="video_item">   
                                          <Player
                                            src={orb.uri} 
                                          />
                                          <div>
                                            <p>Price: {web3.utils.fromWei(orb.price, 'ether')} eth</p>
                                            <p>Owner: {orb.owner}</p>
                                          </div>
                                          {accounts[0]!=orb.owner ? <Button className="btnBuy" >Buy</Button> :<></>}
                                        </Grid>)}) );
}

export default OrbsList