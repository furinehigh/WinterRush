'use client'

import { useRef, useEffect } from "react"
import { Group, MathUtils } from "three"
import { useFrame } from "@react-three/fiber"
import { useGLTF } from "@react-three/drei"
import { useGameStore } from "@/store/gameStore"

const LANE_WIDTH = 3.5
const JUMP_DURATION = 600
const DUCK_DURATION = 800

export default function Player() {
    const groupRef = useRef<Group>(null)
    const modelRef = useRef<Group>(null)

    const idle = useGLTF('/skier_idle.glb')
    const jump = useGLTF('/skier_idle.glb')
    const duck = useGLTF('/snowman_head.glb')

    const {
        status,
        playerLane,
        setPlayerLane,
        isJumping,
        isDucking,
        setIsJumping,
        setIsDucking
    } = useGameStore()

    const jumpStart = useRef(0)
    const duckStart = useRef(0)

    // input
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (status !== 'PLAYING') return

            if (e.key === 'ArrowLeft')
                setPlayerLane(Math.max(playerLane - 1, -1))

            if (e.key === 'ArrowRight')
                setPlayerLane(Math.min(playerLane + 1, 1))

            if (e.key === 'ArrowUp' && !isJumping) {
                setIsJumping(true)
                jumpStart.current = Date.now()
            }

            if (e.key === 'ArrowDown' && !isDucking) {
                setIsDucking(true)
                duckStart.current = Date.now()
            }
        }

        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [status, playerLane, isJumping, isDucking])

    useFrame((_, delta) => {
        if (!groupRef.current || !modelRef.current) return
        if (status === 'GAME_OVER') return

        const t = 12 * delta

        // lane move
        const targetX = playerLane * LANE_WIDTH
        groupRef.current.position.x = MathUtils.lerp(
            groupRef.current.position.x,
            targetX,
            t
        )

        // lean
        const diff = targetX - groupRef.current.position.x
        groupRef.current.rotation.z = MathUtils.lerp(
            groupRef.current.rotation.z,
            -diff * 0.01,
            t
        )

        // ----- jump visual -----
        if (isJumping) {
            const elapsed = Date.now() - jumpStart.current
            const p = Math.min(elapsed / JUMP_DURATION, 1)
            const arc = Math.sin(p * Math.PI)

            // go big or go home
            modelRef.current.position.y = MathUtils.lerp(
                modelRef.current.position.y,
                arc * 3,   // ⬆️ jump height (was 0.35)
                t
            )

            // slight stretch for cartoon pop
            modelRef.current.scale.y = MathUtils.lerp(
                modelRef.current.scale.y,
                1 + arc * 1, // more airtime feel
                t
            )

            if (elapsed > JUMP_DURATION)
                setIsJumping(false)
        }
        else {
            modelRef.current.position.y = MathUtils.lerp(
                modelRef.current.position.y,
                0,
                t
            )
            modelRef.current.scale.y = MathUtils.lerp(
                modelRef.current.scale.y,
                1,
                t
            )
        }

        // duck timing
        if (isDucking && Date.now() - duckStart.current > DUCK_DURATION)
            setIsDucking(false)
    })

    const model =
        isJumping ? jump.scene :
            isDucking ? duck.scene :
                idle.scene

    return (
        <group ref={groupRef}>
            <group ref={modelRef}>
                <primitive
                    object={model}
                    scale={0.2}
                    position={[0, -0.9, 0]}
                    rotation={[0, Math.PI / 2, 0]}
                    
                />
            </group>
        </group>
    )
}


useGLTF.preload('/skier_idle.glb')
useGLTF.preload('/snowman_head.glb')
