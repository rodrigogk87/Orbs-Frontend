import * as Tone from 'tone';
import A0 from "./samples/A0.mp3";
import A1 from "./samples/A1.mp3";
import A2 from "./samples/A2.mp3";
import A3 from "./samples/A3.mp3";
import A4 from "./samples/A4.mp3";
import A5 from "./samples/A5.mp3";
import A6 from "./samples/A6.mp3";
import A7 from "./samples/A7.mp3";
import C1 from "./samples/C1.mp3";
import C2 from "./samples/C2.mp3";
import C3 from "./samples/C3.mp3";
import C4 from "./samples/C4.mp3";
import C5 from "./samples/C5.mp3";
import C6 from "./samples/C6.mp3";
import C7 from "./samples/C7.mp3";
import Ds1 from "./samples/Ds1.mp3";
import Ds2 from "./samples/Ds2.mp3";
import Ds3 from "./samples/Ds3.mp3";
import Ds4 from "./samples/Ds4.mp3";
import Ds5 from "./samples/Ds5.mp3";
import Ds6 from "./samples/Ds6.mp3";
import Ds7 from "./samples/Ds7.mp3";
import Fs1 from "./samples/Fs1.mp3";
import Fs2 from "./samples/Fs2.mp3";
import Fs3 from "./samples/Fs3.mp3";
import Fs4 from "./samples/Fs4.mp3";
import Fs5 from "./samples/Fs5.mp3";
import Fs6 from "./samples/Fs6.mp3";
import Fs7 from "./samples/Fs7.mp3";

const sampler = new Tone.Sampler(
    {
        "A0": A0,
        "A1": A1,
        "A2": A2,
        "A3": A3,
        "A4": A4,
        "A5": A5,
        "A6": A6,
        "A7": A7,
        "C1": C1,
        "C2": C2,
        "C3": C3,
        "C4": C4,
        "C5": C5,
        "C6": C6,
        "C7": C7,
        "D#1": Ds1,
        "D#2": Ds2,
        "D#3": Ds3,
        "D#4": Ds4,
        "D#5": Ds5,
        "D#6": Ds6,
        "D#7": Ds7,
        "F#1": Fs1,
        "F#2": Fs2,
        "F#3": Fs3,
        "F#4": Fs4,
        "F#5": Fs5,
        "F#6": Fs6,
        "F#7": Fs7
    },
    {
        release: 1,
        onload: () => {
            console.log("Sampler loaded!");
        }
    }
).toDestination();

export default sampler;