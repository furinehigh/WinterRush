'use client'

import GameScene from "@/components/GameScene"
import { useGameStore } from "@/store/gameStore"


export default function Home() {
  return (
    <main className="relative w-full h-screen bg-sky-200 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <GameScene />
      </div>

      <UIOverlay />
    </main>
  )
}

function UIOverlay() {
  const { status, score, startGame, reset } = useGameStore()


  return (
    <div className="absolute inset-0 z-10 pointer-events-none flex flex-col items-center justify-center font-bold font-sans text-white">
      {status === 'PLAYING' && (
        <div className="absolute top-8 text-5xl drop-shadow-lg tracking-wide">
          {Math.floor(score)}
        </div>
      )}

      {status === 'MENU' && (
        // CHANGE: pointer-events-none -> pointer-events-auto
        <div className="bg-black/40 backdrop-blur-md p-12 rounded-2xl text-center pointer-events-auto shadow-2xl border border-white/20">
          <h1 className="text-7xl mb-2 text-transparent bg-clip-text bg-gradient-to-b from-cyan-300 to-blue-600 ">
            WINTER RUSH
          </h1>

          <p className="text-xl mb-8 text-gray-200">Dodge trees. Don't crash.</p>

          <button onClick={startGame}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white text-2xl px-10 py-4 rounded-full transition-all transform hover:scale-110 shadow-lg"
          >
            PLAY NOW
          </button>

          <div className="mt-6 text-sm text-gray-300 flex gap-4 justify-center">
            <span>⬅️ Left</span>
            <span>⬆️ Jump</span>
            <span>➡️ Right</span>
          </div>
        </div>
      )}      
      
      {status === 'GAME_OVER' && (
        <div className="bg-red-900/80 backdrop-blur-md p-12 rounded-2xl text-center pointer-events-auto border border-red-500/50">
          <h2 className="text-6xl mb-4 text-red-200">
            WIPEOUT!
          </h2>
          <div className="text-3xl mb-8">
            Score: {Math.floor(score)}
          </div>
          <button onClick={reset} className="bg-white rext-red-900 hover:bg-gray-200 text-xl px-8 py-3 rounded-full transition-colors font-bold">
            TRY AGAIN
          </button>
        </div>
      )}
    </div>
  )
}