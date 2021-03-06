import React, { useRef, useEffect,useState } from 'react'
import { Grid,Button,Paper,makeStyles } from '@material-ui/core';
import { lightGreen } from '@material-ui/core/colors';
import { Player } from 'video-react';
import web3 from 'web3';
import Sphere from './Sphere';
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as Tone from 'tone'
import sampler from "./samplerLoader";


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
  //we can have an id of sphere and when its sound it played it starts to move fast from to left and right
  const [soundPlayed, setSoundPlayed] = useState({id:'', value:false});

  function getSphereInfo(dna){
    let sphereInfoNew = ((dna.split('^^'))[0]).split(';');
    let object = { a: sphereInfoNew[0], b: sphereInfoNew[1], colorHex: sphereInfoNew[2] };
    return object;
  }

  async function playSound(dna){
    
    
    let soundInfo = ((dna.split('^^'))[1]).split('||');
    const now = Tone.now();
    let time = 0;
    let dataSong = soundInfo[0].split(';');

    setSoundPlayed({id:dataSong[3], value:true});

    for(let i=0;i < soundInfo.length;i++){ 
      let info = soundInfo[i].split(';');
      //console.log(now,now+parseFloat(info[2]));
      sampler.triggerAttack(info[0]+info[1], now+parseFloat(info[2]), 2);
      time = parseFloat(info[2]);
    }

     // wait for the notes to end and stop the recording
     setTimeout(() => {
        setSoundPlayed({id:'', value: false});
      }, time * 1000);
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
                                        <Sphere soundPlayed={soundPlayed} sphereInfo={getSphereInfo(orb.dna)} position={[-1.2, 0, 0]} />
                                        <OrbitControls ></OrbitControls>                                      
                                    </Canvas>
                                  </div>
                                  <Button className="btnPlayOrbSound" onClick={()=>playSound(orb.dna)} >Listen</Button> 
                                  {accounts[0]!=orb.owner ? <Button className="btnBuy" >Buy</Button> :<></>}
                                </Grid>)}) );
}

export default OrbsList