import React, { useRef, useEffect,useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'

export default function Sphere(props) {
    // This reference will give us direct access to the mesh
    const mesh = useRef()
    
    // Set up state for the hovered and active state
    // Rotate mesh every frame, this is outside of React without overhead
    useFrame(() => {
      mesh.current.rotation.x = mesh.current.rotation.y += 0.01
    })

    console.log(props.sphereInfo);

    return (
      <mesh
        {...props}
        ref={mesh}
        scale={1}>
        <sphereBufferGeometry args={[1, props.sphereInfo.b, props.sphereInfo.c]}/>
        <meshPhysicalMaterial color={"#"+props.sphereInfo.colorHex} nvMapIntensity={1} clearcoat={0.1} clearcoatRoughness={0} roughness={1} metalness={0.4} />
      </mesh>
    )
  }
