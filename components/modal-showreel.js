import { useState, useContext, useRef } from "react"
import { AnimatePresence, motion } from 'framer-motion';

export default function ModalShowreel({ isOpen, onClose }) {

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <motion.div
            className="modal-content"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.2 }}
          >
            {/* 모달 내용 */}
            <div className="videoWrapper">
              {/* 유튜브 Embed */}
              <iframe width="560" height="315"
                src="https://www.youtube.com/embed/odseADJDpwA?si=E-gk0il0Xq4tcFPU?vol=0&autoplay=1&loop=1&color=white&controls=1&modestbranding=1&playsinline=1&rel=0&enablejsapi=1" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              ></iframe>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}