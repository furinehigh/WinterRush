'use client'

import { useGameStore } from "@/store/gameStore"
import { Volume2, VolumeX } from "lucide-react"
import { useEffect, useRef, useState } from "react"


export default function SoundManager() {
    const {status, isJumping, playerLane, score} = useGameStore()

    const bgmRef = useRef<HTMLAudioElement | null>(null)
    const windRef = useRef<HTMLAudioElement | null>(null)
    const jumpRef = useRef<HTMLAudioElement | null>(null)
    const slideRef = useRef<HTMLAudioElement | null>(null)
    const crashRef = useRef<HTMLAudioElement | null>(null)

    const prevLane = useRef(playerLane)

    const [isMuted, setIsMuted] = useState(false)

    useEffect(() => {
        bgmRef.current = new Audio('/sounds/bgm.mp3')
        bgmRef.current.loop = true
        bgmRef.current.volume = 0.3

        windRef.current = new Audio('/sounds/wind.mp3')
        windRef.current.loop = true
        windRef.current.volume = 0.5

        jumpRef.current = new Audio('/sounds/jump.mp3')
        jumpRef.current.volume = 0.6

        slideRef.current = new Audio('/sounds/slide.mp3')
        slideRef.current.volume = 0.4

        crashRef.current = new Audio('/sounds/crash.mp3')
        crashRef.current.volume = 0.8

        return () =>{
            bgmRef.current?.pause()
            windRef.current?.pause()
        }
    }, [])

    useEffect(() => {
        if (isMuted) return

        if (status == 'PLAYING') {
            bgmRef.current?.play().catch(() => {})
            windRef.current?.play().catch(() => {})

        } else if (status === 'GAME_OVER'){
            bgmRef.current?.pause()
            windRef.current?.pause()

            if (bgmRef.current) bgmRef.current.currentTime = 0

            crashRef.current?.play().catch(() => {})
        } else if (status ==='MENU') {
            bgmRef.current?.pause()
            windRef.current?.pause()
        }
    }, [status, isMuted])

    useEffect(() => {
        if (isJumping && status == 'PLAYING' && !isMuted) {
            if (jumpRef.current) {
                jumpRef.current.currentTime = 0
                jumpRef.current.play().catch(() => {})


            }
        }
    }, [isJumping, status, isMuted])

    useEffect(() => {
        if (prevLane.current !== playerLane && status === 'PLAYING' && !isMuted) {
            if (slideRef.current) {
                slideRef.current.currentTime = 0
                slideRef.current.play().catch(() => {})
            }
        }

        prevLane.current = playerLane
    }, [playerLane, status, isMuted])

    return (
        <div>
            <button onClick={() => {
                setIsMuted(!isMuted)
                if (!isMuted){
                    bgmRef.current?.pause()
                    windRef.current?.pause()
                } else if (status == 'PLAYING') {
                    bgmRef.current?.play()
                    windRef.current?.play()
                }
            }}
            className="text-white/50 hover:text-white font-bold border border-white/20 p-2 rounded-full w-10 h-10 flex items-center justify-center transition-colors"
            >
                {isMuted ? <VolumeX /> : <Volume2 />}
            </button>
        </div>
    )
}