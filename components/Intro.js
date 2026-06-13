import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

// Minimal brand wordmark fade. Shown once per session (sessionStorage), then
// fades out to reveal the page — keeps first load fast and unobtrusive.
export default function Intro() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (sessionStorage.getItem('introSeen')) return
    sessionStorage.setItem('introSeen', '1')
    // 클라이언트 전용 1회 초기화 — sessionStorage는 SSR에서 읽을 수 없음
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShow(true)
    const timer = setTimeout(() => setShow(false), 1300)
    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="intro-overlay"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
        >
          <motion.span
            className="intro-logo"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
          >
            KIM TAE KYUN
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}