'use client'

import { motion } from 'framer-motion'

const GridBackground = () => {
    return (
        <div className="absolute inset-0 z-0">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 2 }}
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: 'radial-gradient(circle at center, hsla(var(--primary) / 0.1), transparent 60%)',
                }}
            />
            <div
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: `
                        linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px),
                        linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)
                    `,
                    backgroundSize: '40px 40px',
                    maskImage: 'radial-gradient(ellipse 100% 50% at 50% 100%, black, transparent)',
                }}
            />
        </div>
    )
}

export default GridBackground
