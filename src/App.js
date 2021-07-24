import logo from './logo.svg';
import './App.css';
import * as Tone from 'tone'
import {Button,Grid,Avatar} from '@material-ui/core';
import sampler from "./samplerLoader";
import React,{ useState,useEffect }  from 'react';
import Canvas from './Canvas';

//https://en.wikipedia.org/wiki/Scientific_pitch_notation
function App() {

  const [ elements, setElements ] = useState([]);


  const playTone = () =>{
    
    const arrNotes = ["A","B","C","D","E","F","G"]
    const duration = 200;
    const now = Tone.now()
    const synthDrum = new Tone.MembraneSynth().toDestination();
    
    console.log('START OF SECUENCES');
    //the math of the music :-)
    let jaux = -1;
    for(let i=0;i<duration;i++){ 
      let j=i/(Math.round((Math.random() * 4) + 1));
      if(j < jaux){
        j=jaux+1/2;
      }
      jaux = j;
      let note=Math.round((Math.random() * 4) + 2);
      let tone = arrNotes[Math.round(Math.random() * 6)];
      let element = tone+note+' '+(now+j);
      
      setElements((elements)=>[...elements,element]);
      sampler.triggerAttack(tone+note, now+j, 2)
      if(i%Math.round((Math.random() * 4) + 2)==0)
      synthDrum.triggerAttackRelease("C2", "8n",now+j);
    }
    console.log('END OF SECUENCES');
  }


  return (
    <div className="App">
      <header className="App-header">
         <Canvas elements={elements}/>
         <Button onClick={playTone} variant="contained">Random Melody</Button>    
      </header>
    </div>
  );
}

export default App;
