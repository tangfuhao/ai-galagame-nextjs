"use client"

import { motion } from "framer-motion"

interface Choice {
  id: string
  text: string
  disabled?: boolean
}

interface ChoiceOptionsProps {
  options: Choice[]
  onSelect: (choiceId: string) => void
}

export function ChoiceOptions({ options, onSelect }: ChoiceOptionsProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="flex flex-col gap-4 w-full max-w-xl px-4">
        {options.map((option, index) => (
          <motion.button
            key={option.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => !option.disabled && onSelect(option.id)}
            disabled={option.disabled}
            className={`
              py-3 px-6 text-white text-lg text-center
              bg-[url('/choice-bg.png')] bg-cover bg-center
              hover:brightness-110 transition-all
              ${option.disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
            `}
          >
            {option.text}
          </motion.button>
        ))}
      </div>
    </div>
  )
}
