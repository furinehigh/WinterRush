'use client'

import { useGameStore } from "@/store/gameStore"
import { useFrame } from "@react-three/fiber"
import { useEffect, useRef } from "react"
import { Group, Mesh } from "three"

const LANE_WIDTH = 3.5
const JUMP_DURATION = 0.6 // seconds

export default function Player() {
    const groupRef = useRef<Group>(null)
    const bodyRef = useRef<Mesh>(null)
    
    // Store
    const { status, setPlayerLane, playerLane, setIsJumping, setIsDucking, isJumping, isDucking } = useGameStore()
    
    // Track when the specific action started
    const jumpStartTime = useRef(0)
    const duckStartTime = useRef(0)

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (status !== 'PLAYING') return

            if (e.key === 'ArrowLeft') setPlayerLane(Math.max(playerLane - 1, -1))
            if (e.key === 'ArrowRight') setPlayerLane(Math.min(playerLane + 1, 1))
            
            if (e.key === 'ArrowUp' && !isJumping) {
                setIsJumping(true)
                jumpStartTime.current = Date.now() // Capture start time
                // Auto-reset is handled in useFrame now for precision
            }
            if (e.key === 'ArrowDown' && !isDucking) {
                setIsDucking(true)
                duckStartTime.current = Date.now()
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [status, playerLane, isJumping, isDucking, setPlayerLane, setIsJumping, setIsDucking])

    useFrame((state, delta) => {
        if (!groupRef.current || !bodyRef.current) return

        // 1. Lane Switching
        const targetX = playerLane * LANE_WIDTH
        groupRef.current.position.x += (targetX - groupRef.current.position.x) * 15 * delta

        // 2. Precise Jump Math (No double bounce)
        if (isJumping) {
            const timeSinceJump = (Date.now() - jumpStartTime.current) / 1000 // in seconds
            
            if (timeSinceJump < JUMP_DURATION) {
                // Create a perfect 0 -> 1 -> 0 Sine wave
                // We map time (0 to 0.6) to Radians (0 to PI)
                const progress = (timeSinceJump / JUMP_DURATION) * Math.PI
                groupRef.current.position.y = Math.sin(progress) * 2.5 // Jump Height
            } else {
                // Jump Over
                groupRef.current.position.y = 0
                setIsJumping(false)
            }
        } else {
            // Snap to ground
            groupRef.current.position.y = 0 
        }

        // 3. Precise Duck Math
        if (isDucking) {
            const timeSinceDuck = (Date.now() - duckStartTime.current) / 1000
            if (timeSinceDuck > 0.8) {
                setIsDucking(false)
            }
        }

        // 4. Visuals (Squash & Tilt)
        const targetScaleY = isDucking ? 0.5 : 1
        bodyRef.current.scale.y += (targetScaleY - bodyRef.current.scale.y) * 15 * delta

        const tilt = (targetX - groupRef.current.position.x) * 0.1
        bodyRef.current.rotation.z = tilt
        bodyRef.current.rotation.x = isDucking ? -0.5 : 0.2
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