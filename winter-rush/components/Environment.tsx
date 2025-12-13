'use client'

import { Sky, Sparkles } from "@react-three/drei"


export default function Environment() {
    return (
        <>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 20, 10]} intensity={1.5} castShadow />

            <fog attach="fog" args={['#e0f7fa', 10, 50]} />

            <Sky sunPosition={[100, 20, 100]} turbidity={0.1} rayleigh={0.5} />

            <Sparkles 
                count={300}
                scale={[20, 10, 30]}
                size={5}
                speed={2}
                opacity={0.6}
                color='#ffffff'
            />

            <mesh rotation={[-Math.PI / 2, 0,0]} position={[0, -1, 0]} receiveShadow>
                <planeGeometry args={[100, 200]} />
                <meshStandardMaterial color='#fff' roughness={0.1} />
            </mesh>
        </>
    )
}