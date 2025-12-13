'use client'

import { Canvas } from "@react-three/fiber"
import { Suspense } from "react"
import Environment from "./Environment"
import Player from "./Player"
import ObstacleManager from "./ObstacleManager"
import SideScenery from "./SideScenery"


export default function GameScene( ){
    return (
        <Canvas shadows camera={{ position: [0, 4, 8], fov: 60}}>
            <Suspense fallback={null}>
                <Environment />
                <SideScenery />
                <Player />
                <ObstacleManager />
            </Suspense>
        </Canvas>
    )
}