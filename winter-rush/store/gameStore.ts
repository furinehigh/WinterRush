import {create} from 'zustand'


type GameStatus = 'MENU' | 'PLAYING' | 'GAME_OVER'

interface GameState{
    status: GameStatus
    score: number
    speed: number
    playerLane: number // -1, 0, 1
    setPlayerLane: (lane: number) => void
    startGame: () => void
    gameOver: () => void
    reset: () => void
    incrementScore: () => void
    increaseSpeed: () => void
}


export const useGameStore = create<GameState>((set) => ({
    status: 'MENU',
    score: 0,
    speed: 20,
    playerLane: 0,
    setPlayerLane: (lane) => set({playerLane: lane}),
    startGame: () => set({status: 'PLAYING', score: 0, speed: 20, playerLane: 0}),
    gameOver: () => set({status: 'GAME_OVER', speed: 0}),
    reset: () => set({status: 'MENU', score: 0, speed: 20}),
    incrementScore: () => set((state) => ({score: state.score + 1})),
    increaseSpeed: () => set((state) => ({speed: state.speed + 0.5}))
}))