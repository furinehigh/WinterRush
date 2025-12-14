'use client'

import { useGameStore } from "@/store/gameStore"
import { useFrame } from "@react-three/fiber"
import { useRef, useState, useEffect } from "react"
import { useGLTF, Clone } from "@react-three/drei" 
import * as THREE from 'three'

type ObstacleType = 'TREE' | 'ROCK' | 'LOG' | 'SNOWBALL'

interface ObstacleData {
    id: number,
    lane: number,
    z: number,
    y: number,
    type: ObstacleType
    rotationY: number
    collected?: boolean
}

export default function ObstacleManager() {
    const [obstacles, setObstacles] = useState<ObstacleData[]>([])
    
    const treeModel = useGLTF('/tree.glb')
    const rockModel = useGLTF('/rock.glb')
    const logModel = useGLTF('/log.glb')

    const { speed, status, gameOver, incrementScore, playerLane, isJumping, isDucking, collectSnowball } = useGameStore()

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
            let shouldIncrementScore = false

            const next = prev.map((obs) => {
                const newZ = obs.z + speed * delta
                let collected = obs.collected

                // Collision Logic
                if (newZ > -1 && newZ < 1 && !collected) { 
                    if (obs.lane === playerLane) {
                        if (obs.type === 'SNOWBALL') {
                            const playerHeight = isJumping ? 2 : (isDucking ? 0.5 : 1)

                            let canCollect = false
                            if (obs.y === 0) canCollect = true
                            if (obs.y > 1 && isJumping) canCollect = true

                            if (canCollect){
                                collectSnowball()
                                collected= true
                            }
                        } else {
                            
                            let collision = true
    
                            // Logic: Rock = Jump over, Log = Duck under
                            if (obs.type === 'ROCK' && isJumping) collision = false
                            else if (obs.type === 'LOG' && isDucking) collision = false
                            
                            if (collision) gameOver()
                        }

                    }
                }

                return { ...obs, z: newZ, collected }
            }).filter((obs) => {
                if (obs.z > 10) {
                    if (obs.type  === 'SNOWBALL'){
                        shouldIncrementScore = true
                    }
                    return false
                }
                return true
            })

            if (shouldIncrementScore && Math.random() > 0.7) incrementScore()
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
        const choice = Math.random()
        // Adjusted probabilities
        const types: ObstacleType[] = ['TREE', 'TREE', 'ROCK', 'LOG', 'ROCK']
        
        const lane = lanes[Math.floor(Math.random() * lanes.length)]
        const type = types[Math.floor(Math.random() * types.length)]

        const newEntities: ObstacleData[] = []

        if (choice < 0.2) {
            newEntities.push({
                id: nextId.current++,
                lane,
                z: -100,
                y: 0,
                type: 'LOG',
                rotationY: 0
            })

            for (let i=0; i<3; i++) {
                newEntities.push({
                    id: nextId.current++,
                    lane,
                    z: -100 - (i*2),
                    y: 0,
                    type: 'SNOWBALL',
                    rotationY: 0
                })
            }
        } else if (choice < 0.4) {
            newEntities.push({
                id: nextId.current++,
                lane,
                z: -100,
                y: 0,
                type: 'ROCK',
                rotationY: Math.random() * Math.PI
            })

            newEntities.push({
                id: nextId.current++,
                lane,
                z: -100,
                y: 2.5,
                type: 'SNOWBALL',
                rotationY: 0
            })
        } else if (choice < 0.6) {
            for (let i=0; i<5; i++) {
                newEntities.push({
                    id: nextId.current++,
                    lane,
                    z: -100 - (i*3),
                    y: 0,
                    type: 'SNOWBALL',
                    rotationY: 0
                })
            }
        } else {
            newEntities.push({
                id: nextId.current++,
                lane,
                z: -100,
                y: 0,
                type: 'TREE',
                rotationY: Math.random() * Math.PI * 2
            })
        }

        setObstacles(prev => [...prev, ...newEntities])
    }

    return (
        <>
            {obstacles.map(obs => {
                if (obs.collected) return null
                return (
                    <Obstacle 
                        key={obs.id} 
                        data={obs} 
                        models={{
                            tree: treeModel.scene, 
                            rock: rockModel.scene, 
                            log: logModel.scene
                        }} 
                    />
                )
            })}
        </>
    )
}

const Obstacle = ({ data, models }: { data: ObstacleData, models: any }) => {
    const x = data.lane * 3.5

    const snowballRef = useRef<THREE.Group>(null)

    useFrame((_, delta) => {
        if (data.type == 'SNOWBALL' && snowballRef.current) {
            snowballRef.current.rotation.y += delta * 3
            snowballRef.current.rotation.x += delta * 2
        }
    })

    return (
        <group position={[x, -1, data.z]}>

            {data.type == "SNOWBALL" && (
                <group position={[0, data.y + 0.5, 0]} ref={snowballRef}>
                    <mesh castShadow>
                        <dodecahedronGeometry args={[0.4, 0]} />
                        <meshStandardMaterial
                            color='#ffffff'
                            emissive='#e0f7fa'
                            emissiveIntensity={0.5}
                            roughness={0.1}
                        />
                    </mesh>
                </group>
            )}
            
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