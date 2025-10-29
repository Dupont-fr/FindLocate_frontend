// src/components/ui/sheet.jsx
import React from 'react'
import { AnimatePresence } from 'framer-motion'

export const MobileSheet = ({ open, onClose, children }) => {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            className='fixed inset-0 bg-black bg-opacity-50 z-40'
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Contenu du menu */}
          <motion.div
            className='fixed top-0 right-0 w-64 h-full bg-white shadow-lg z-50 p-6'
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
