import { create } from 'zustand'

type GameStatus = 'MENU' | 'PLAYING' | 'GAME_OVER'

interface GameState {
    status: GameStatus
    score: number
    snowballs: number
    speed: number
    playerLane: number
    isJumping: boolean
    isDucking: boolean
    
    startGame: () => void
    gameOver: () => void
    reset: () => void
    incrementScore: () => void
    collectSnowball: () => void
    
    setPlayerLane: (lane: number) => void
    setIsJumping: (isJumping: boolean) => void
    setIsDucking: (isDucking: boolean) => void
}

export const useGameStore = create<GameState>((set) => ({
    status: 'MENU',
    score: 0,
    snowballs: 0,
    speed: 0,
    playerLane: 0,
    isJumping: false,
    isDucking: false,

    startGame: () => set({ 
        status: 'PLAYING', 
        score: 0, 
        snowballs: 0, 
        speed: 20, // Starting Speed
        playerLane: 0 
    }),
    
    gameOver: () => set({ status: 'GAME_OVER', speed: 0 }),
    
    reset: () => set({ status: 'MENU', score: 0, snowballs: 0, speed: 0, playerLane: 0 }),
    
    incrementScore: () => set((state) => {
        // CHANGED: 0.5 -> 0.1 for smoother acceleration
        // It will take longer to reach max speed (60)
        const newSpeed = Math.min(state.speed + 0.1, 60)
        
        return { 
            score: state.score + 10,
            speed: newSpeed 
        }
    }),
    
    // Collecting snowballs gives points but DOES NOT increase speed
    // This rewards the player without punishing them with instant speed
    collectSnowball: () => set((state) => ({ 
        snowballs: state.snowballs + 1,
        score: state.score + 50 
    })),

    setPlayerLane: (lane) => set({ playerLane: lane }),
    setIsJumping: (isJumping) => set({ isJumping }),
    setIsDucking: (isDucking) => set({ isDucking }),
}))