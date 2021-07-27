import React, { useRef, useEffect,useState } from 'react'
import * as Tone from 'tone'
import sampler from "./samplerLoader";
import { soliditySha3 }  from 'web3-utils';
import {Button,Grid,Avatar} from '@material-ui/core';
import web3 from 'web3';
import { Canvas, useFrame } from '@react-three/fiber'


/*Generally speaking, using setState inside useEffect will create an infinite loop that most likely you don't want to cause. 
There are a couple of exceptions to that rule which I will get into later.
useEffect is called after each render and when setState is used inside of it, it will cause the component to 
re-render which will call useEffect and so on and so on.
One of the popular cases that using useState inside of useEffect will not cause an infinite loop is when you pass an 
empty array as a second argument to useEffect like useEffect(() => {....}, []) which means that the effect function 
should be called once: after the first mount/render only. This is used widely when you're doing data fetching in a 
component and you want to save the request data in the component's state.*/


//start recorder https://tonejs.github.io/docs/14.7.39/Recorder
//https://github.com/spite/ccapture.js/
//https://stackoverflow.com/questions/50681683/how-to-save-canvas-animation-as-gif-or-webm
//https://stackoverflow.com/questions/52768330/combine-audio-and-video-streams-into-one-file-with-mediarecorder
//https://github.com/videojs/mux.js/
//https://github.com/muaz-khan/Ffmpeg.js/blob/master/merging-wav-and-webm-into-mp4.html
//https://developer.mozilla.org/en-US/docs/Web/API/Blob/Blob
//https://stackoverflow.com/questions/15970729/appending-blob-data
//https://github.com/samirkumardas/jmuxer
//muxer ---> obj that conmbines video and audio
//https://ipfs.infura.io/ipfs/QmNMgdubv1NY7cVrDSyyxSa5Gcu3ueaFm6DzRGkZEVwrqt
//https://modernweb.com/creating-particles-html5-canvas/
//https://codepen.io/blancocd/pen/wvJXpge
//https://xparkmedia.com/blog/mediaelements-add-a-share-button-to-video-elements-using-jquery/
//https://video-react.js.org/
/*
  ANOTHER INTERESTING POSIBILITY IS STORE THE DATA BUT NOT AS A VIDEO BUT AS THE DATA TO RECONSTRUCT THE
  CANVAS ELEMENT AND THE SOUND, SO WE LET THEM PLAY WITH THE ELEMENT WITH ORBITABLE AND THAT STUFF AND IS MORE
  INTERACTIVE, WE CAN HAVE A LIST AND OTHER USERS CAN PLAY WITH THEM IF THEY LIKE THEY CAN BUY THEM

*/
const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient.create({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }) 

function OrbBirth({accounts,contract,reloadList}){
  
  const [ clicked, setClicked ] = useState(false);
  const [ duration, setDuration ] = useState(0);
  const [ elements, setElements ] = useState([]);
  const [orbBlobs, setOrbBlobs] = useState([]);
  const [finished, setFinished] = useState(false);
  const [borning, setBorning ] = useState(false);

  let soundInfo = [];

  
  function Sphere(props) {
    // This reference will give us direct access to the mesh
    const mesh = useRef()
    // Set up state for the hovered and active state
    // Rotate mesh every frame, this is outside of React without overhead
    useFrame(() => {
      mesh.current.rotation.x = mesh.current.rotation.y += 0.01
    })
    
    let colorhex = props.elements[0];
    console.log(colorhex);
    let a = 0.1+(Math.random() * 30);
    let b = 0.1+(Math.random() * 30);

    return (
      <mesh
        {...props}
        ref={mesh}
        scale={1}>
        <sphereBufferGeometry args={[1, a, b]} />
        <meshPhysicalMaterial color={"#"+colorhex} nvMapIntensity={1} clearcoat={0.1} clearcoatRoughness={0} roughness={1} metalness={0.4} />
      </mesh>
    )
  }


  useEffect(() => {
    const uploadToIpfs = async () =>{ 
        if(orbBlobs.length == 1){    
          /*setFinished(true);
          setBorning(false);
          const url = URL.createObjectURL(orbBlobs[0]);
          const anchor = document.createElement("a");
          anchor.download = "recording.webm";
          anchor.href = url;
          anchor.click();*/
          /*console.log(orbBlobs[0],'file to uload');
          const file = await ipfs.add(orbBlobs[0],async (error, result) => {
              console.log('Ipfs result', result)
              if(error) {
                console.error(error,'error ipfs')
                return
              }else{
                console.log(result[0].hash,'hash');            
                
              }
          })
          console.log(file,'file',file.path,'filepath');
          if(typeof file.path !== "undefined" && file.path!=''){
              console.log(accounts[0],file.path,'to mint');
              await contract.methods.mintCollectable(accounts[0],file.path).send({from:accounts[0],value: web3.utils.toWei('0.01', 'ether') }).then((result) => {
                  setFinished(true);
                  setBorning(false);
                  //reloadList();
              }).catch((err) => {
                  console.log("Failed with error: " + err);
                  setFinished(true);
                  setBorning(false);
              });
           }*/
        }
    }

    uploadToIpfs();

  }, [orbBlobs])


  const playTone = async() =>{
    setBorning(true);
    const audio_recorder = new Tone.Recorder();

    const video_chunks = []; 
    console.log(canvasRef.current);
    const stream = canvasRef.current.captureStream();
    const video_recorder = new MediaRecorder(stream);
    let audioTrack = audio_recorder._recorder.stream.getAudioTracks()[0];
    // add it to your canvas stream:
    stream.addTrack(audioTrack);
    
    //SET DATA
    sampler.connect(audio_recorder);
    setClicked(true);
    const arrNotes = ["A","B","C","D","E","F","G"]
    const duration = 15;
    setDuration(duration);
    const now = Tone.now(); 
    //START RECORDERD
    video_recorder.ondataavailable = e => { video_chunks.push(e.data); }
    video_recorder.start();

    //the math of the music :-)
    let jaux = -1;
    let j=0;
    for(let i=0;duration-j > 0;i++){ 
      
      j= i/(Math.round((Math.random() * 2) + ((Math.random() * 5) + 1)) );
      
      if(j < jaux){
        j=jaux+1/((Math.random() * 6) + 2);
      }
      jaux = j;
      let note=Math.round((Math.random() * 6) + 1);
      let tone = arrNotes[Math.round(Math.random() * 6)];
      let element = soliditySha3(tone+note+' '+(now+j)).slice(-6);
      
      setElements((elements)=>[...elements,element]);
      sampler.triggerAttack(tone+note, now+j, 2)
      
      //if(i%Math.round((Math.random() * 4) + 2)==0)
      //synthDrum.triggerAttackRelease("C2", "8n",now+j);
      
      soundInfo[i]=tone+";"+note+";"+(now+j)+";"+element;
    }

    // wait for the notes to end and stop the recording
    setTimeout(async () => {
      // the recorded audio is returned as a blob
      const recording_video = await video_recorder.stop();
      video_recorder.onstop = e => setOrbBlobs((orbBlobs)=>[...orbBlobs,new Blob(video_chunks, {type: 'video/webm'})]);   

    }, duration * 1000);

    //guardar en blockchain
    //let res = await contract.methods.mintCollectable(accounts[0],soundInfo).send({from:accounts[0] });    
    //console.log(accounts[0],soundInfo);
  }
  
    
  const canvasRef = useRef(null)

  
  return    <div id="orbBirthParent">
                <Canvas ref={canvasRef}>
                  {borning ?
                    <>
                    <ambientLight intensity={0.5} />
                    <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
                    <pointLight position={[-10, -10, -10]} />
                    <Sphere elements={elements} position={[-1.2, 0, 0]} /></>
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

export default OrbBirth