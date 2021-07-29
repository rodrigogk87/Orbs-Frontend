import React, { useRef, useEffect,useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'

export default function Sphere(props) {
    // This reference will give us direct access to the mesh
    const mesh = useRef()
    const meshMaterial = useRef()
    const [flatShadingOn, setFlatShadingOn] = useState(false);
    let randomRight = Math.random();
    let randomLeft = Math.random();
    
    let dxPerFrame = (0.01 + randomRight );

    // Set up state for the hovered and active state
    // Rotate mesh every frame, this is outside of React without overhead
    //no esta funcionando bien flatShading={(props.sphereInfo.b % 2) == 0} 
    //
    useFrame(() => {
      mesh.current.rotation.x = mesh.current.rotation.y += (0.01 * props.sphereInfo.b/10);
      if(typeof props.soundPlayed!='undefined' && props.soundPlayed.id==props.sphereInfo.colorHex){
        mesh.current.position.x += dxPerFrame; // move ball
        if(mesh.current.position.x >  5+(randomRight * 3)){ dxPerFrame = -0.01-randomRight; randomLeft=Math.random();} // if we're too far right, move towards the left
        if(mesh.current.position.x < -5-(randomLeft * 3)){ dxPerFrame = 0.01+randomLeft; randomRight=Math.random();}
      }   
    })

    
    useEffect(() => {
    }, []);

      
    return (
      <mesh
        {...props}
        ref={mesh}
        scale={1}>
        <sphereBufferGeometry args={[1, props.sphereInfo.b, props.sphereInfo.c]}/>
        <meshPhysicalMaterial ref={meshMaterial}  color={"#"+props.sphereInfo.colorHex} nvMapIntensity={1} clearcoat={0.1} clearcoatRoughness={0} roughness={1} metalness={0.4} />
      </mesh>
    )
  }
