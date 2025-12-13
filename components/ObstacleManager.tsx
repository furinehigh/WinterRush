'use client'

import { useGameStore } from "@/store/gameStore"
import { useFrame } from "@react-three/fiber"
import { useRef, useState, useEffect } from "react"
import { useGLTF, Clone } from "@react-three/drei" 

type ObstacleType = 'TREE' | 'ROCK' | 'LOG'

interface ObstacleData {
    id: number,
    lane: number,
    z: number,
    type: ObstacleType
    rotationY: number 
}

export default function ObstacleManager() {
    const [obstacles, setObstacles] = useState<ObstacleData[]>([])
    
    const treeModel = useGLTF('/tree.glb')
    const rockModel = useGLTF('/rock.glb')
    const logModel = useGLTF('/log.glb')

    const { speed, status, gameOver, incrementScore, playerLane, isJumping, isDucking } = useGameStore()

    const lastSpawnZ = useRef(-30)
    const nextId = useRef(0)

    useEffect(() => {
        if (status === 'MENU') {
            setObstacles([])
            lastSpawnZ.current = -30
        }
    }, [status])

    useFrame((state, delta) => {
        if (status !== 'PLAYING') return

        setObstacles((prev) => {
            let shouldRemove = false

            const next = prev.map((obs) => {
                const newZ = obs.z + speed * delta

                // Collision Logic
                if (newZ > -1 && newZ < 1) { 
                    if (obs.lane === playerLane) {
                        let collision = true

                        // Logic: Rock = Jump over, Log = Duck under
                        if (obs.type === 'ROCK' && isJumping) collision = false
                        else if (obs.type === 'LOG' && isDucking) collision = false
                        
                        if (collision) gameOver()
                    }
                }

                return { ...obs, z: newZ }
            }).filter((obs) => {
                if (obs.z > 10) {
                    shouldRemove = true
                    return false
                }
                return true
            })

            if (shouldRemove) incrementScore()
            return next
        })

        lastSpawnZ.current += speed * delta
        
        if (lastSpawnZ.current >= 0) {
            lastSpawnZ.current = -15 
            spawnNewObstacle()
        }
    })

    const spawnNewObstacle = () => {
        const lanes = [-1, 0, 1]
        // Adjusted probabilities
        const types: ObstacleType[] = ['TREE', 'TREE', 'ROCK', 'LOG', 'ROCK']
        
        const lane = lanes[Math.floor(Math.random() * lanes.length)]
        const type = types[Math.floor(Math.random() * types.length)]

        setObstacles(prev => [...prev, {
            id: nextId.current++,
            lane,
            z: -100,
            type,
            rotationY: Math.random() * Math.PI * 2 
        }])
    }

    return (
        <>
            {obstacles.map(obs => (
                <Obstacle 
                    key={obs.id} 
                    data={obs} 
                    models={{
                        tree: treeModel.scene, 
                        rock: rockModel.scene, 
                        log: logModel.scene
                    }} 
                />
            ))}
        </>
    )
}

const Obstacle = ({ data, models }: { data: ObstacleData, models: any }) => {
    const x = data.lane * 3.5

    // FIX: Position Y set to -1 to match the floor level in Environment.tsx
    return (
        <group position={[x, -1, data.z]}>
            
            {/* TREE */}
            {data.type === 'TREE' && (
                <group 
                    position={[0, 0, 0]} 
                    rotation={[0, data.rotationY, 0]} 
                >
                    <Clone 
                        object={models.tree} 
                        scale={0.7} 
                        castShadow 
                        receiveShadow
                    />
                </group>
            )}

            {/* ROCK */}
            {data.type === 'ROCK' && (
                <group 
                    position={[0, 0, 0]} 
                    rotation={[0, data.rotationY, 0]} 
                >
                    <Clone 
                        object={models.rock} 
                        scale={0.008} 
                        castShadow
                        receiveShadow
                    />
                </group>
            )}

            {/* LOG (Obstacle you must slide UNDER) */}
            {data.type === 'LOG' && (
                <group position={[0, 0, 0]}> 
                    <group rotation={[0, 0, 0]}> 
                        <Clone 
                            object={models.log} 
                            scale={0.2} 
                            castShadow 
                        />
                    </group>
                </group>
            )}
        </group>
    )
}

useGLTF.preload('/tree.glb')
useGLTF.preload('/rock.glb')
useGLTF.preload('/log.glb')