import React, { useRef, useEffect,useState } from 'react'
import * as Tone from 'tone'
import sampler from "./samplerLoader";
import { soliditySha3 }  from 'web3-utils';
import {Button,Grid,Avatar} from '@material-ui/core';
import web3 from 'web3';

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

  
  const draw = (ctx, frameCount,elements) => {
    if(elements.length > 0){
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
      ctx.fillStyle = '#'+elements[frameCount%elements.length];
      ctx.beginPath()
      ctx.arc(ctx.canvas.width/2, ctx.canvas.height/2, 50*(0.7+Math.sin(frameCount*0.05)**2), 0, 2*Math.PI)
      ctx.fill()
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    // width="960" height="484"
    context.canvas.width  = 960;
    context.canvas.height = 484;
    let frameCount = 0
    let animationFrameId
    let subelements = [];
    for(let i=0;i<elements.length;i++){
      if(i>5){
        break;
      }
      subelements[i] = elements[i];
    }
    //Our draw came here
    const render = () => {
      frameCount++
      draw(context, frameCount,subelements)
      animationFrameId = window.requestAnimationFrame(render)
      if(orbBlobs.length == 1)
      context.clearRect(0, 0, canvas.width, canvas.height);
    }
    render()
    
    return () => {
      window.cancelAnimationFrame(animationFrameId);
    }
  }, [draw])


  useEffect(() => {
    const uploadToIpfs = async () =>{ 
        if(orbBlobs.length == 1){    
          console.log(orbBlobs[0],'file to uload');
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
           }
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
      
      j= i/(Math.round((Math.random() * 2) + ((Math.random() * 10) + 1)) );
      
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
                <canvas ref={canvasRef}/>
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