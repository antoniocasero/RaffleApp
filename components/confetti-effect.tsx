"use client"

import { useEffect, useRef } from "react"
import confetti from "canvas-confetti"

interface ConfettiEffectProps {
  trigger: boolean
}

export default function ConfettiEffect({ trigger }: ConfettiEffectProps) {
  const confettiRef = useRef<HTMLCanvasElement>(null)
  const confettiInstanceRef = useRef<confetti.CreateTypes | null>(null)

  useEffect(() => {
    // Initialize confetti
    if (confettiRef.current && !confettiInstanceRef.current) {
      confettiInstanceRef.current = confetti.create(confettiRef.current, {
        resize: true,
        useWorker: true,
      })
    }

    // Cleanup function
    return () => {
      if (confettiInstanceRef.current) {
        confettiInstanceRef.current.reset()
      }
    }
  }, [])

  useEffect(() => {
    if (trigger && confettiInstanceRef.current) {
      // Fire confetti when triggered
      const duration = 3 * 1000
      const end = Date.now() + duration

      // Intense confetti burst
      const intenseBurst = () => {
        confettiInstanceRef.current?.({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff"],
        })
      }

      // Initial burst
      intenseBurst()

      // Side bursts
      setTimeout(() => {
        confettiInstanceRef.current?.({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
        })
        confettiInstanceRef.current?.({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
        })
      }, 250)

      // Continuous smaller bursts
      const interval = setInterval(() => {
        if (Date.now() > end) {
          clearInterval(interval)
          return
        }

        confettiInstanceRef.current?.({
          particleCount: 30,
          spread: 100,
          origin: { y: 0.7 },
        })
      }, 400)
    }
  }, [trigger])

  return (
    <canvas
      ref={confettiRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{ width: "100%", height: "100%" }}
    />
  )
}

