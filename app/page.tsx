'use client'

import GameScene from "@/components/GameScene"
import SoundManager from "@/components/SoundManager"
import { useGameStore } from "@/store/gameStore"
import { useProgress } from "@react-three/drei"
import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState, useRef } from "react"
import { useWindowSize } from "react-use"
import Confetti from 'react-confetti'

export default function Home() {
  return (
    <main className="relative w-full h-screen overflow-hidden bg-transparent ">
      <SoundManager />
      <div className="absolute inset-0 z-0">
        <GameScene />
      </div>

      <UIOverlay />
    </main>
  )
}

function UIOverlay() {
  const { status, score, startGame, reset } = useGameStore()
  const { width, height } = useWindowSize()
  const { progress } = useProgress()

  const [isLoaded, setIsLoaded] = useState(false)
  const [isNewHighScore, setIsNewHighScore] = useState(false)
  const [highScore, setHighScore] = useState(0)

  // Fix: Use a ref to prevent double-checking the score in the same game session
  const hasProcessedGameOver = useRef(false)

  const playClick = () => {
    const audio = new Audio('/sounds/click.mp3')
    audio.volume = 0.5
    audio.play().catch(() => { })
  }

  useEffect(() => {
    if (progress === 100) {
      setTimeout(() => setIsLoaded(true), 500)
    }
  }, [progress])

  useEffect(() => {
    // 1. Reset the lock when game starts or menu loads
    if (status === 'PLAYING' || status === 'MENU') {
      hasProcessedGameOver.current = false
      
      // Load current high score for display
      const stored = Number(localStorage.getItem('highScore') || '0')
      setHighScore(stored)
    }

    // 2. Only check high score once when Game Over hits
    if (status === 'GAME_OVER' && !hasProcessedGameOver.current) {
      hasProcessedGameOver.current = true // Lock it immediately
      
      const stored = Number(localStorage.getItem('highScore') || '0')
      
      if (score > stored) {
        // NEW HIGH SCORE
        setIsNewHighScore(true)
        setHighScore(score) 
        localStorage.setItem('highScore', String(score))
      } else {
        // NO NEW RECORD
        setIsNewHighScore(false)
        setHighScore(stored)
      }
    }
  }, [status, score])

  return (
    <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center text-white">

      {/* Confetti - Only shows if GAME_OVER and isNewHighScore is true */}
      {status === 'GAME_OVER' && isNewHighScore && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={800}
          gravity={0.15}
          colors={['#FFD700', '#FFFFFF', '#00BFFF']} 
        />
      )}

      {/* --- LOADING SCREEN --- */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-900 pointer-events-auto"
          >
            <h2 className="text-4xl font-black tracking-widest text-white mb-4">
              LOADING
            </h2>
            <div className="w-64 h-2 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-white"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-2 text-white/50 text-sm font-mono">
              {Math.floor(progress)}%
            </p>
          </motion.div>
        )}
      </AnimatePresence>


      {/* --- GAME UI (Only show when loaded) --- */}
      {isLoaded && (
        <>
          {/* SCORE */}
          <AnimatePresence>
            {status === 'PLAYING' && (
              <motion.div
                key="score"
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.3 }}
                className="absolute top-6 text-6xl font-black tracking-widest text-white/90"
              >
                {Math.floor(score)}
              </motion.div>
            )}
          </AnimatePresence>

          {/* MENUS */}
          <AnimatePresence mode="wait">
            {status === 'MENU' && (
              <motion.div
                key="menu"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="pointer-events-auto text-center"
              >
                <motion.h1
                  initial={{ y: -200, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    duration: 0.9,
                    ease: [0.16, 1, 0.3, 1]
                  }}
                  className="text-[9rem] leading-none font-black tracking-tight text-white "
                >
                  WINTER
                  <br />
                  RUSH
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="mt-4 text-xl text-white/60 tracking-wider"
                >
                  survive the downhill
                </motion.p>

                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => { playClick(); startGame() }}
                  className="mt-12 px-14 py-4 text-2xl font-bold border border-white/30 text-white hover:border-white transition-all"
                >
                  PLAY
                </motion.button>

                {highScore > 0 && <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="mt-6 text-lg text-yellow-400/80 font-bold tracking-widest uppercase"
                >
                  High Score: {Math.floor(highScore)}
                </motion.p>}
              </motion.div>
            )}

            {status === 'GAME_OVER' && (
              <motion.div
                key="over"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="pointer-events-auto text-center flex flex-col items-center"
              >

                {isNewHighScore ? (
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1.2, opacity: 1 }}
                    transition={{ type: "spring", bounce: 0.6 }}
                  >
                    <h2 className="text-6xl font-black text-yellow-400 drop-shadow-[0_0_25px_rgba(250,204,21,0.8)]">
                      NEW HIGH SCORE!
                    </h2>
                  </motion.div>
                ) : (
                  <motion.h2
                    initial={{ y: -40 }}
                    animate={{ y: 0 }}
                    className="text-7xl font-black text-white"
                  >
                    WIPEOUT
                  </motion.h2>
                )}

                <div className="mt-6 flex flex-col items-center">
                  <span className="text-8xl font-black text-white tracking-tighter">
                    {Math.floor(score)}
                  </span>
                  
                  {/* Only show "BEST" label if we didn't just break the record */}
                  {!isNewHighScore && (
                    <span className="text-white/50 text-xl font-mono mt-2">
                      BEST: {Math.floor(highScore)}
                    </span>
                  )}
                </div>

                <motion.button
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => {
                    playClick()
                    reset()
                    setTimeout(() => {
                      startGame()
                    }, 100)
                  }}
                  className="mt-10 px-12 py-3 text-xl font-bold border border-white/30 text-white hover:border-white transition-all"
                >
                  RETRY
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => { playClick(); reset(); }}
                  className="mt-3 px-12 py-3 text-xl font-bold border border-white/30 text-white hover:border-white transition-all"
                >
                  MENU
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  )
}