import React, { useRef, useEffect } from 'react'
import { Grid,Button,Paper,makeStyles } from '@material-ui/core';
import { lightGreen } from '@material-ui/core/colors';
import { Player } from 'video-react';
import web3 from 'web3';
import Sphere from './Sphere';
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

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

  function getSphereInfo(sphereInfo){
    let sphereInfoNew = ((sphereInfo.split('^^'))[0]).split(';');
    let object = { a: sphereInfoNew[0], b: sphereInfoNew[1], colorHex: sphereInfoNew[2] };
    return object;
  }

  const classes = useStyles();
  return ( orbs.map(orb => {return (
                                      <Grid item xs={12} className="video_item">   
                                          <div>
                                            <p>Price: {web3.utils.fromWei(orb.price, 'ether')} eth</p>
                                            <p>Owner: {orb.owner}</p>
                                            <Canvas id="canvas_list">
                                                <ambientLight intensity={0.5} />
                                                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
                                                <pointLight position={[-10, -10, -10]} />
                                                <Sphere sphereInfo={getSphereInfo(orb.dna)} position={[-1.2, 0, 0]} />
                                                <OrbitControls enableZoom={false} ></OrbitControls>                                      
                                            </Canvas>
                                          </div>
                                          {accounts[0]!=orb.owner ? <Button className="btnBuy" >Buy</Button> :<></>}
                                        </Grid>)}) );
}

export default OrbsList