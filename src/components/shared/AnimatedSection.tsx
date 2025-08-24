'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

type AnimatedSectionProps = {
  children: React.ReactNode
  className?: string
  id?: string
}

export default function AnimatedSection({ children, className, id }: AnimatedSectionProps) {
  return (
    <motion.section
      id={id}
      className={cn("w-full py-24 md:py-32", className)}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="container mx-auto px-4 md:px-6">
        {children}
      </div>
    </motion.section>
  )
}
