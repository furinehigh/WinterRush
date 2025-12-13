'use client'

import { useGameStore } from "@/store/gameStore"
import { Clone, useGLTF } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useState } from "react"



const VISIBLE_LENGTH = 100
const START_Z = -100
const ITEM_COUNT = 25

const LEFT_FENCE_X = -6
const RIGHT_FENCE_X = 6
const JUNGLE_LEFT_START = -8
const JUNGLE_RIGHT_START= 8
const JUNGLE_WIDTH= 25

type SceneryType = 'TREE' | 'ROCK' | 'PINE'

interface SceneryItem {
    id: number
    x: number
    z: number
    scale: [number, number, number]
    rotation: number
    type: SceneryType
}

export default function SideScenery() {
    const {speed, status} = useGameStore()

    const treeModal = useGLTF('/tree.glb')
    const rockModel = useGLTF('/rock.glb')

    const [items, setItems] = useState<SceneryItem[]>(() => {
        const initialItems: SceneryItem[] = []

        for (let i = 0; i < ITEM_COUNT; i++) {
            const z = START_Z + (i * (VISIBLE_LENGTH / ITEM_COUNT))

            addJungleItem(initialItems, i * 3, z, -1)

            addJungleItem(initialItems, i * 3 + 1, z, -1)
            addJungleItem(initialItems, i*3 + 2, z, 1)

            addJungleItem(initialItems, i * 3 + 3, z, 1)
        }

        return initialItems
    })

    const [fences, setFences] = useState(() => {
        const f = []

        for (let z = -100; z < 20; z += 4) {
            f.push({id: Math.random(), z})
            
        }

        return f
    })

    useFrame((_, delta) => {
        if (status !== 'PLAYING') return

        const moveAmount = speed * delta

        setItems(prev => prev.map(item => {
            let newZ = item.z + moveAmount

            if (newZ > 15) {
                newZ = -100 + (newZ - 15)
            }

            return {...item, z: newZ}
        }))


        setFences(prev => prev.map(f => {
            let newZ = f.z + moveAmount

            if (newZ > 10) {
                newZ = -110
            }

            return {...f, z: newZ}
        }))


    })

    return (
        <group position={[0, -1, 0]}>
            {items.map(item => (
                <group key={item.id} position={[item.x, 0, item.z]}>
                    {item.type === 'TREE' && (
                        <Clone object={treeModal.scene} scale={item.scale as any} rotation={[0, item.rotation, 0]}/>

                    )}

                    {item.type === 'PINE' && (
                        <Clone object={treeModal.scene} scale={[item.scale[0] * 0.6, item.scale[1] * 1.5, item.scale[2] * 0.6] as any} rotation={[0, item.rotation, 0]} />
                    )}

                    {item.type === 'ROCK' && (
                        <Clone object={rockModel.scene} scale={item.scale as any} rotation={[0, item.rotation, 0]} />
                    )}
                </group>
            ))}

            {[LEFT_FENCE_X, RIGHT_FENCE_X].map((xPos, i) => (
                <group key={i} position={[xPos, 0, 0]}>
                    {fences.map((f, idx) => (
                        <group key={f.id} position={[0, 0, f.z]}>
                            <mesh position={[0, 0.5, 0]} castShadow>
                                <boxGeometry args={[0.2, 1.5, 0.2]} />
                                <meshStandardMaterial color='#5d4037' />
                            </mesh>

                            <mesh position={[0, 0.4, 2]} castShadow>
                                <boxGeometry args={[0.1, 0.15, 4.2]} />
                                <meshStandardMaterial color='#4e342e' roughness={1} />
                            </mesh>

                            <mesh position={[0, 0.4, 2]} castShadow>
                                <boxGeometry args={[0.1, 0.15, 4.2]} />
                                <meshStandardMaterial color='#4e342e' roughness={1} />
                            </mesh>
                        </group>
                    ))}
                </group>
            ))}
        </group>
    )
}
function addJungleItem(arr: SceneryItem[], idBase: number, zBase: number, side: 1 | -1) {
    const isRock = Math.random() > 0.8
    const isPine = Math.random() > 0.5

    const xOffset = JUNGLE_LEFT_START + (Math.random() * JUNGLE_WIDTH * -1)

    const finalX = side === -1
        ? (JUNGLE_LEFT_START - Math.random() * JUNGLE_WIDTH)
        : (JUNGLE_RIGHT_START + Math.random() * JUNGLE_WIDTH)

    const scaleBase = Math.random() * 0.5 + 0.5

    // FIX: Rock scale drastically reduced (0.015)
    // Trees kept normal
    const finalScale: [number, number, number] = isRock 
        ? [0.015, 0.015, 0.015] 
        : [scaleBase, scaleBase, scaleBase]

    arr.push({
        id: idBase + Math.random(),
        x: finalX,
        z: zBase + (Math.random() * 5),
        rotation: Math.random() * Math.PI * 2,
        scale: finalScale,
        type: isRock ? 'ROCK' : (isPine ? 'PINE' : 'TREE')
    })
}
