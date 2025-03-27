"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"

// Update the ConfigModalProps interface to include confettiEnabled
interface ConfigModalProps {
  isOpen: boolean
  onClose: () => void
  minNumber: number
  maxNumber: number
  confettiEnabled: boolean
  onSave: (min: number, max: number, confettiEnabled: boolean) => void
  onResetNumbers: () => void
}

// Update the function parameters to include confettiEnabled
export default function ConfigModal({
  isOpen,
  onClose,
  minNumber,
  maxNumber,
  confettiEnabled,
  onSave,
  onResetNumbers,
}: ConfigModalProps) {
  const [min, setMin] = useState(minNumber)
  const [max, setMax] = useState(maxNumber)
  const [confetti, setConfetti] = useState(confettiEnabled)
  const [error, setError] = useState("")

  useEffect(() => {
    // Reset form values when modal opens
    if (isOpen) {
      setMin(minNumber)
      setMax(maxNumber)
      setConfetti(confettiEnabled)
      setError("")
    }
  }, [isOpen, minNumber, maxNumber, confettiEnabled])

  // Update the handleSave function to include confetti
  const handleSave = () => {
    // Validate input
    if (min >= max) {
      setError("El número mínimo debe ser menor que el máximo")
      return
    }

    if (min < 1) {
      setError("El número mínimo debe ser al menos 1")
      return
    }

    if (max > 9999) {
      setError("El número máximo no puede exceder 9999")
      return
    }

    // Save and close
    onSave(min, max, confetti)
    onClose()
  }

  // Close modal when clicking outside
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleBackdropClick}
        >
          <motion.div
            className="bg-gray-900 p-6 rounded-lg w-full max-w-md mx-4 border border-gray-700"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Configuración del Sorteo</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Número Mínimo</label>
                <input
                  type="number"
                  value={min}
                  onChange={(e) => setMin(Number.parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Número Máximo</label>
                <input
                  type="number"
                  value={max}
                  onChange={(e) => setMax(Number.parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
                />
              </div>

              <div className="flex items-center justify-between py-2">
                <label className="text-sm font-medium text-gray-300">Animación de Confetti</label>
                <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full">
                  <input
                    type="checkbox"
                    className="absolute w-6 h-6 opacity-0 z-10 cursor-pointer"
                    checked={confetti}
                    onChange={(e) => setConfetti(e.target.checked)}
                  />
                  <div
                    className={`w-12 h-6 transition-colors duration-200 ease-in-out rounded-full ${
                      confetti ? "bg-blue-600" : "bg-gray-600"
                    }`}
                  />
                  <div
                    className={`absolute left-0 top-0 bg-white w-6 h-6 rounded-full transition-transform duration-200 ease-in-out transform ${
                      confetti ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </div>
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <div className="flex flex-col space-y-3 pt-2">
                <button 
                  onClick={onResetNumbers} 
                  className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-500"
                >
                  Resetear números anteriores
                </button>
                <div className="flex justify-end space-x-3">
                  <button onClick={onClose} className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600">
                    Cancelar
                  </button>
                  <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500">
                    Guardar
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
