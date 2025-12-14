import { create } from 'zustand'

type GameStatus = 'MENU' | 'PLAYING' | 'GAME_OVER'

interface GameState {
  status: GameStatus
  score: number
  speed: number
  playerLane: number // -1, 0, 1
  snowballs: number
  isJumping: boolean
  isDucking: boolean
  
  setPlayerLane: (lane: number) => void
  setIsJumping: (v: boolean) => void  // NEW
  setIsDucking: (v: boolean) => void  // NEW
  collectSnowball: () => void
  startGame: () => void
  gameOver: () => void
  reset: () => void
  incrementScore: () => void
}

export const useGameStore = create<GameState>((set) => ({
  status: 'MENU',
  score: 0,
  speed: 20,
  playerLane: 0,
  snowballs: 0,
  isJumping: false,
  isDucking: false,

  setPlayerLane: (lane) => set({ playerLane: lane }),
  setIsJumping: (v) => set({ isJumping: v }),
  setIsDucking: (v) => set({ isDucking: v }),
  collectSnowball: () => set((state) => ({snowballs: state.snowballs + 1})),
  startGame: () => set({ status: 'PLAYING', score: 0, speed: 20, playerLane: 0, isJumping: false, isDucking: false }),
  gameOver: () => set({ status: 'GAME_OVER', speed: 0 }),
  reset: () => set({ status: 'MENU', score: 0, speed: 20 }),
  incrementScore: () => set((state) => ({ score: state.score + 1 })),
}))