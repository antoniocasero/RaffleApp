"use client"

import { motion } from "framer-motion"

interface RaffleButtonProps {
  onClick: () => void
  disabled: boolean
}

export default function RaffleButton({ onClick, disabled }: RaffleButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="bg-blue-600 text-white px-12 py-6 rounded-lg text-2xl font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {disabled ? "SORTEANDO..." : "INICIAR SORTEO"}
    </motion.button>
  )
}

