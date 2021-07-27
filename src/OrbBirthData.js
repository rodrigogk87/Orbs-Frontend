import React, { useRef, useEffect,useState } from 'react'
import * as Tone from 'tone'
import sampler from "./samplerLoader";
import { soliditySha3 }  from 'web3-utils';
import {Button,Grid,Avatar} from '@material-ui/core';
import web3 from 'web3';
import { Canvas, useFrame } from '@react-three/fiber'
import Sphere from './Sphere';
import { OrbitControls } from '@react-three/drei'

/*
  WE  STORE THE DATA TO RECONSTRUCT THE
  CANVAS ELEMENT AND THE SOUND, SO WE LET THEM PLAY WITH THE ELEMENT WITH ORBITABLE AND THAT STUFF AND IS MORE
  INTERACTIVE, WE CAN HAVE A LIST AND OTHER USERS CAN PLAY WITH THEM IF THEY LIKE THEY CAN BUY THEM

  DNA STRUCTURE
  STRING: ANIMATION_DATA^^SOUND_DATA
  ANIMATION_DATA: STRING: a;b;hexcolor
  SOUND_DATA: STRING: SAMPLE_DATA_0||SAMPLE_DATA_1||...etc
  SAMPLE_DATA: STRING: tone;note;tempo;element
  element = soliditySha3(tone+note+' '+(now+j)).slice(-6), that represents a random hex value used in animation data.
*/
const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient.create({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }) 

function OrbBirthData({accounts,contract,reloadList}){
  
  const [ clicked, setClicked ] = useState(false);
  const [ duration, setDuration ] = useState(0);
  const [ audioElements, setAudioElements ] = useState([]);
  const [ videoElements, setVideoElements ] = useState([]);
  const [ soundInfo, setSoundInfo ] = useState(false);
  const [ orbBlobs, setOrbBlobs] = useState([]);
  const [ finished, setFinished] = useState(false);
  const [ borning, setBorning ] = useState(false);
  const [ sphereInfo ,setSphereInfo ] = useState(false);

  
  useEffect(() => {
    if(soundInfo){
      let arrayValues = (soundInfo.split('||'))[0].split(';');
      let colorHex = arrayValues[arrayValues.length-1];
      setSphereInfo({a: Math.round((Math.random() * 30) + 1),b:Math.round((Math.random() * 30) + 1),colorHex: colorHex})
    }
  }, [soundInfo])

  useEffect( () => {
    if(sphereInfo){
      //guardar info en Smart contract
      const saveContract = async () =>{ 
        let dna = sphereInfo.a+';'+sphereInfo.b+';'+sphereInfo.colorHex+'^^'+soundInfo;
        let res = await contract.methods.mintCollectable(accounts[0],dna).send({from:accounts[0]});    
        console.log(res);
      }
  
      saveContract();
    }
  }, [sphereInfo])



  const playTone = async() =>{

    setBorning(true); 
    setClicked(true);
    const arrNotes = ["A","B","C","D","E","F","G"]
    const duration = 15;
    setDuration(duration);
    const now = Tone.now(); 

    let jaux = -1;
    let j=0;
    let soundInfoTmp = '';
    for(let i=0;duration-j > 0;i++){ 
      
      j= i/(Math.round((Math.random() * 2) + ((Math.random() * 5) + 1)) );
      
      if(j < jaux){
        j=jaux+1/((Math.random() * 6) + 2);
      }
      jaux = j;
      let note=Math.round((Math.random() * 6) + 1);
      let tone = arrNotes[Math.round(Math.random() * 6)];
      let audioElement = soliditySha3(tone+note+' '+(now+j)).slice(-6);
      
      setAudioElements((audioElements)=>[...audioElements,audioElement]);
      sampler.triggerAttack(tone+note, now+j, 2)
      
      //if(i%Math.round((Math.random() * 4) + 2)==0)
      //synthDrum.triggerAttackRelease("C2", "8n",now+j);

      if(duration-j <= 0)
      soundInfoTmp+=tone+";"+note+";"+(now+j)+";"+audioElement;
      else
      soundInfoTmp+=tone+";"+note+";"+(now+j)+";"+audioElement+"||";
      
    }
    
    setSoundInfo(soundInfoTmp);

    setTimeout(async () => {
      setFinished(true);
      setBorning(false);
    }, duration * 1000);

  }
  
    
  const canvasRef = useRef(null)

  
  return    <div id="orbBirthParent">
                <Canvas ref={canvasRef}>
                  {borning && sphereInfo ?
                    <>
                    <ambientLight intensity={0.5} />
                    <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
                    <pointLight position={[-10, -10, -10]} />
                    <Sphere sphereInfo={sphereInfo} position={[-1.2, 0, 0]} />
                    <OrbitControls enableZoom={false} ></OrbitControls>
                    </>
                    :<></>
                  }
                </Canvas>
                {!finished && !borning ?
                <Button className="btnBirth" id="generator" onClick={playTone} variant="contained">Mint Orb</Button>
                :
                !borning ?
                <Button className="btnBirth" id="reloader" onClick={()=>window.location.reload()} variant="contained">Mint Another!</Button>
                :
                <div>Orb is borning, wait to claim.....</div>
                }
              </div>
}

export default OrbBirthData