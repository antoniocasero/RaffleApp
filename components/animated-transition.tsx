"use client"

import { motion } from "framer-motion"

interface AnimatedTransitionProps {
  number: number | null
}

export default function AnimatedTransition({ number }: AnimatedTransitionProps) {
  return (
    <motion.div
      key={number || "rolling"}
      animate={{
        y: [0, -20, 0],
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration: 0.2,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "loop",
      }}
      className="text-[20vw] font-bold text-white"
    >
      {number !== null ? number : "?"}
    </motion.div>
  )
}

