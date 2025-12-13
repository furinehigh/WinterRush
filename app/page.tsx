'use client'

import GameScene from "@/components/GameScene"
import { useGameStore } from "@/store/gameStore"
import { useProgress } from "@react-three/drei"
import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"

export default function Home() {
  return (
    <main className="relative w-full h-screen overflow-hidden bg-transparent ">
      <div className="absolute inset-0 z-0">
        <GameScene />
      </div>

      <UIOverlay />
    </main>
  )
}

function UIOverlay() {
  const { status, score, startGame, reset } = useGameStore()
  const [isHighScore, setIsHighScore] = useState(false)
  const [highScore, setHighScore] = useState(0)

  const { progress } = useProgress()

  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (progress == 100) {
      setTimeout(() => setIsLoaded(true), 500)

    }
  }, [progress])

  useEffect(() => {
      const highScore = Number(localStorage.getItem('highScore'))
      setHighScore(highScore)
      if (highScore < score) {
        localStorage.setItem('highScore', String(score))
        setIsHighScore(true)
      }
  }, [status])

  return (
    <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center text-white">

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
                  onClick={startGame}
                  className="mt-12 px-14 py-4 text-2xl font-bold border border-white/30 text-white hover:border-white transition-all"
                >
                  PLAY
                </motion.button>

                {highScore > 0 && <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="mt-4 text-xl text-white/60 tracking-wider"

                >
                  High Score: {highScore}
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
                className="pointer-events-auto text-center flex flex-col"
              >
                <motion.h2
                  initial={{ y: -40 }}
                  animate={{ y: 0 }}
                  className="text-7xl font-black text-white"
                >
                  WIPEOUT
                </motion.h2>

                <div className="mt-4 text-3xl text-white/70">
                  {Math.floor(score)}
                </div>

                <motion.button
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => {
                    reset()
                    setTimeout(() => {

                      startGame()
                    }, 500)
                  }}
                  className="mt-10 px-12 py-3 text-xl font-bold border border-white/30 text-white hover:border-white transition-all"
                >
                  RETRY
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={reset}
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
