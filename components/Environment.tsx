'use client'

import { Sky, Sparkles, useTexture } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { useGameStore } from "@/store/gameStore"

const WORLD_SPEED = 1
const WORLD_TO_TEXTURE = 1 / 5

export default function Environment() {
    const { speed, status } = useGameStore()

    const snow = useTexture({
        map: '/textures/snow/color.jpg',
        normalMap: '/textures/snow/normal.jpg',
        roughnessMap: '/textures/snow/roughness.jpg',
        aoMap: '/textures/snow/ao.jpg'
    })

    Object.values(snow).forEach((t: any) => {
        if (!t) return
        t.wrapS = t.wrapT = THREE.RepeatWrapping
        t.repeat.set(20, 40)
    })

    useFrame((_, delta) => {
        if (status !== 'PLAYING') return
        const dz = speed * delta * WORLD_SPEED
        const scroll = dz * WORLD_TO_TEXTURE
        snow.map.offset.y += scroll
        snow.normalMap && (snow.normalMap.offset.y += scroll)
        snow.roughnessMap && (snow.roughnessMap.offset.y += scroll)
        snow.aoMap && (snow.aoMap.offset.y += scroll)
    })

    return (
        <>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 20, 10]} intensity={1.5} castShadow />
            <fog attach="fog" args={['#e0f7fa', 10, 50]} />
            <Sky sunPosition={[100, 20, 100]} turbidity={0.1} rayleigh={0.5} />
            <Sparkles count={300} scale={[20, 10, 30]} size={4} speed={1.5} opacity={0.6} />
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
                <planeGeometry args={[100, 200]} />
                <meshStandardMaterial
                    map={snow.map}
                    normalMap={snow.normalMap}
                    roughnessMap={snow.roughnessMap}
                    aoMap={snow.aoMap}
                    roughness={0.9}
                    metalness={0}
                />
            </mesh>
        </>
    )
}

// PRELOAD ASSETS
useTexture.preload('/textures/snow/color.jpg')
useTexture.preload('/textures/snow/normal.jpg')
useTexture.preload('/textures/snow/roughness.jpg')
useTexture.preload('/textures/snow/ao.jpg')