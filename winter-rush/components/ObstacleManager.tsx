'use client'

type ObstacleType = 'TREE' | 'ROCK' | 'LOG'

interface ObstacleData {
    id: number,
    lane: number,
    z: number,
    type: ObstacleType
}