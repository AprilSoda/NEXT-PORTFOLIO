import React from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'

const variantsIn = {
  initial: { y: '0' },
  enter: { y: '-100%' }
}

const variantsExit = {
  initial: { y: '100%' },
  exit: { y: '0' },
}

const variantsChildren = {
  initial: { y: '100%' },
  enter: { y: '0' },
}


function Transition({ children }) {
  const router = useRouter()
  return (
    <>
      <motion.div
        className='transition_div'
        initial="initial"
        animate='enter'
        variants={variantsIn}
        transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
      />
      <motion.div
        className='transition_div'
        initial="initial"
        exit="exit"
        variants={variantsExit}
        transition={{ duration: 0.5, ease: [0.95, 0.05, 0.795, 0.035] }}
      />
      <motion.div
        className='transition_children'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
      >
        {children}
      </motion.div>
    </>

  )
}

export default Transition