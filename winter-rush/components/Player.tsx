'use client'

import { useGameStore } from "@/store/gameStore"
import { useFrame } from "@react-three/fiber"
import { useEffect, useRef, useState } from "react"
import { Group, Mesh } from "three"


const LANE_WIDTH = 3.5

export default function Player() {
    const groupRef = useRef<Group>(null)

    const bodyRef = useRef<Mesh>(null)
    const {status, setPlayerLane, playerLane} = useGameStore()

    const [isJumping, setIsJumping] = useState(false)
    const [isDucking, setIsDucking] = useState(false)

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (status !== 'PLAYING') return

            if (e.key == 'ArrowLeft') setPlayerLane(Math.max(playerLane - 1, -1))
            if (e.key == 'ArrowRight') setPlayerLane(Math.min(playerLane + 1, 1))
            
            if (e.key == 'ArrowUp' && !isJumping) {
                setIsJumping(true)
                setTimeout(() => setIsJumping(false), 600)
            }

            if (e.key == 'ArrowDown' && !isDucking) {
                setIsDucking(true)
                setTimeout(() => setIsDucking(false), 800)
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [status, playerLane, isJumping, isDucking, setPlayerLane])

    useFrame((state, delta) => {
        if (!groupRef.current || !bodyRef.current) return

        const targetX = playerLane * LANE_WIDTH

        groupRef.current.position.x += (targetX - groupRef.current.position.x) * 15 * delta

        if (isJumping) {
            groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 15) * 2
            if (groupRef.current.position.y < 0) groupRef.current.position.y = 0
        } else {
            groupRef.current.position.y += (0-groupRef.current.position.y) * 15 * delta
        }

        const targetScaleY = isDucking ? 0.5 : 1
        bodyRef.current.scale.y += (targetScaleY - bodyRef.current.scale.y) * 15 * delta

        const tilt = (targetX - groupRef.current.position.x) * 0.1

        bodyRef.current.position.z = tilt
        bodyRef.current.position.x = isDucking ? -0.5 : 0.2
    })

    return (
        <group ref={groupRef} position={[0, 0, 0]}>
            <mesh ref={bodyRef} position={[0, 0.75, 0]} castShadow>
                <boxGeometry args={[1, 1.5, 1]} />
                <meshStandardMaterial color={isDucking ? '#f59e0b' : '#3b82f6'} />

            </mesh>
        </group>
    )
}