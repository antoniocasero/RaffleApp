"use client"

import { useState, useEffect } from "react"
import { Volume2, VolumeX, Settings } from "lucide-react"
import NumberDisplay from "@/components/number-display"
import AnimatedTransition from "@/components/animated-transition"
import RaffleButton from "@/components/raffle-button"
import ConfigModal from "@/components/config-modal"
import ConfettiEffect from "@/components/confetti-effect"

export default function Home() {
  const [number, setNumber] = useState<number | null>(null)
  const [isRolling, setIsRolling] = useState(false)
  const [previousNumbers, setPreviousNumbers] = useState<number[]>([])
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)
  const [isConfigOpen, setIsConfigOpen] = useState(false)
  const [minNumber, setMinNumber] = useState(1)
  const [maxNumber, setMaxNumber] = useState(199)
  const [showConfetti, setShowConfetti] = useState(false)
  const [confettiEnabled, setConfettiEnabled] = useState(true)

  useEffect(() => {
    // Load previous numbers from localStorage if available
    const savedNumbers = localStorage.getItem("previousRaffleNumbers")
    if (savedNumbers) {
      setPreviousNumbers(JSON.parse(savedNumbers))
    }

    // Load configuration from localStorage if available
    const savedConfig = localStorage.getItem("raffleConfig")
    if (savedConfig) {
      const { min, max, confetti } = JSON.parse(savedConfig)
      setMinNumber(min)
      setMaxNumber(max)
      // Set confetti preference if it exists, otherwise default to true
      setConfettiEnabled(confetti !== undefined ? confetti : true)
    }

    // Setup full screen capability
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "f") {
        document.documentElement.requestFullscreen().catch((err) => {
          console.error("Error attempting to enable full-screen mode:", err)
        })
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const generateNumber = async () => {
    if (isRolling) return

    // Initialize or reset audio
    if (soundEnabled) {
      if (!audio) {
        const tickSound = new Audio("/sounds/drums.mp3")
        tickSound.preload = "auto"
        await tickSound.load()
        setAudio(tickSound)
      } else {
        audio.currentTime = 0
      }
    }

    // Reset confetti state
    setShowConfetti(false)

    setIsRolling(true)

    // Generate the final number right away, but don't display it yet
    const finalNumber = Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber

    // Play sound if enabled
    const playTickSound = async () => {
      if (soundEnabled && audio) {
        try {
          audio.currentTime = 0
          await audio.play()
        } catch (e) {
          console.error("Audio play error:", e)
          if (e instanceof Error && e.name === "NotAllowedError") {
            setSoundEnabled(false)
          }
        }
      }
    }

    // Animation during 3 seconds
    const interval = setInterval(async () => {
      const randomNum = Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber
      setNumber(randomNum)
      await playTickSound()
    }, 50)

    // Stop after 3 seconds and save the result
    setTimeout(() => {
      clearInterval(interval)

      // Set the final number we generated earlier
      setNumber(finalNumber)
      setIsRolling(false)

      // Add to previous numbers
      const updatedNumbers = [...previousNumbers, finalNumber]
      setPreviousNumbers(updatedNumbers)
      localStorage.setItem("previousRaffleNumbers", JSON.stringify(updatedNumbers))

      // Only trigger confetti animation if enabled
      if (confettiEnabled) {
        setShowConfetti(true)
      }
    }, 3000)
  }

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled)
  }

  const saveConfig = (min: number, max: number, confetti: boolean) => {
    setMinNumber(min)
    setMaxNumber(max)
    setConfettiEnabled(confetti)

    // Save to localStorage
    localStorage.setItem("raffleConfig", JSON.stringify({ min, max, confetti }))
  }

  const resetNumbers = () => {
    setPreviousNumbers([])
    localStorage.removeItem("previousRaffleNumbers")
  }

  return (
    <main className="h-screen w-screen bg-black flex flex-col items-center justify-center overflow-hidden relative">
      {/* Club Name */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
        <h1 className="text-2xl md:text-3xl font-bold text-white text-center">Moteros del Arlanza</h1>
      </div>

      {/* Confetti Effect */}
      <ConfettiEffect trigger={showConfetti} />

      {/* Control buttons - top right */}
      <div className="absolute top-4 right-4 flex space-x-2">
        <button
          onClick={() => setIsConfigOpen(true)}
          className="text-white p-2 rounded-full hover:bg-gray-800"
          title="Configurar rango de números"
        >
          <Settings size={24} />
        </button>
        <button
          onClick={toggleSound}
          className="text-white p-2 rounded-full hover:bg-gray-800"
          title={soundEnabled ? "Desactivar sonido" : "Activar sonido"}
        >
          {soundEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
        </button>
      </div>

      {/* Number display */}
      <div className="flex-1 flex items-center justify-center">
        {isRolling ? <AnimatedTransition number={number} /> : <NumberDisplay number={number} />}
      </div>

      {/* Button */}
      <div className="mb-16">
        <RaffleButton onClick={generateNumber} disabled={isRolling} />
      </div>

      {/* Range indicator */}
      <div className="absolute bottom-10 left-0 right-0 text-center">
        <p className="text-gray-500 text-sm">
          Rango: {minNumber} - {maxNumber}
        </p>
      </div>

      {/* Previous numbers (small display at bottom) */}
      {previousNumbers.length > 0 && (
        <div className="absolute bottom-2 left-0 right-0 text-center">
          <p className="text-gray-500 text-xs">Anteriores: {previousNumbers.slice(-5).join(", ")}</p>
        </div>
      )}

      {/* Configuration Modal */}
      <ConfigModal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        minNumber={minNumber}
        maxNumber={maxNumber}
        confettiEnabled={confettiEnabled}
        onSave={saveConfig}
        onResetNumbers={resetNumbers}
      />
    </main>
  )
}
