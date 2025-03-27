"use client"

import { motion } from "framer-motion"

interface NumberDisplayProps {
  number: number | null
}

export default function NumberDisplay({ number }: NumberDisplayProps) {
  return (
    <motion.div
      key={number || "empty"}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="text-[20vw] font-bold text-white"
    >
      {number !== null ? number : "?"}
    </motion.div>
  )
}

