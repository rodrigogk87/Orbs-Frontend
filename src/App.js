import logo from './logo.svg';
import './App.css';
import * as Tone from 'tone'
import Button from '@material-ui/core/Button';
import sampler from "./samplerLoader";

//https://en.wikipedia.org/wiki/Scientific_pitch_notation
function App() {

  

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
      console.log(tone+note);
      sampler.triggerAttack(tone+note, now+j, 2)
      if(i%Math.round((Math.random() * 4) + 2)==0)
      synthDrum.triggerAttackRelease("C2", "8n",now+j);
    }
    console.log('END OF SECUENCES');
  }


  return (
    <div className="App">
      <header className="App-header">
        <Button onClick={playTone} variant="contained">Random Melody</Button>    
      </header>
    </div>
  );
}

export default App;
