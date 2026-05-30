import React, { useCallback, useRef, useState, useEffect } from "react"
import { AnimatePresence, motion, useMotionTemplate, useMotionValue, useSpring } from "motion/react"

export function Lens({
  children,
  zoomFactor = 1.3,
  lensSize = 170,
  isStatic = false,
  position = { x: 0, y: 0 },
  defaultPosition,
  duration = 0.15,
  lensColor = "black",
  ariaLabel = "Zoom Area"
}) {
  if (zoomFactor < 1) {
    throw new Error("zoomFactor must be greater than 1")
  }
  if (lensSize < 0) {
    throw new Error("lensSize must be greater than 0")
  }

  const [isHovering, setIsHovering] = useState(false)
  const containerRef = useRef(null)

  const initX = defaultPosition?.x ?? position.x
  const initY = defaultPosition?.y ?? position.y
  const mouseX = useMotionValue(initX)
  const mouseY = useMotionValue(initY)

  const springConfig = { damping: 25, stiffness: 220, mass: 0.25 }
  const x = useSpring(mouseX, springConfig)
  const y = useSpring(mouseY, springConfig)

  useEffect(() => {
    if (isStatic) {
      mouseX.set(position.x)
      mouseY.set(position.y)
    } else if (defaultPosition && !isHovering) {
      mouseX.set(defaultPosition.x)
      mouseY.set(defaultPosition.y)
    }
  }, [isStatic, position.x, position.y, defaultPosition, isHovering, mouseX, mouseY])

  const handleMouseEnter = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    mouseX.set(e.clientX - rect.left)
    mouseY.set(e.clientY - rect.top)
    setIsHovering(true)
  }, [mouseX, mouseY])

  const handleMouseMove = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    mouseX.set(e.clientX - rect.left)
    mouseY.set(e.clientY - rect.top)
  }, [mouseX, mouseY])

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false)
    if (defaultPosition) {
      mouseX.set(defaultPosition.x)
      mouseY.set(defaultPosition.y)
    }
  }, [defaultPosition, mouseX, mouseY])

  const handleKeyDown = useCallback((e) => {
    if (e.key === "Escape") setIsHovering(false)
  }, [])

  const maskImage = useMotionTemplate`radial-gradient(circle ${
    lensSize / 2
  }px at ${x}px ${y}px, ${lensColor} 100%, transparent 100%)`

  const transformOrigin = useMotionTemplate`${x}px ${y}px`

  return (
    <div
      ref={containerRef}
      className="relative z-20 overflow-hidden rounded-xl select-none"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      onKeyDown={handleKeyDown}
      role="region"
      aria-label={ariaLabel}
      tabIndex={0}>
      {children}
      {isStatic || defaultPosition ? (
        <motion.div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          style={{
            maskImage,
            WebkitMaskImage: maskImage,
            transformOrigin,
            willChange: "transform, mask-image, -webkit-mask-image",
            zIndex: 50,
          }}>
          <motion.div
            className="absolute inset-0"
            style={{
              scale: zoomFactor,
              transformOrigin,
              willChange: "transform",
            }}>
            {children}
          </motion.div>
        </motion.div>
      ) : (
        <AnimatePresence mode="popLayout">
          {isHovering && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration }}
              className="absolute inset-0 overflow-hidden pointer-events-none"
              style={{
                maskImage,
                WebkitMaskImage: maskImage,
                transformOrigin,
                willChange: "transform, mask-image, -webkit-mask-image",
                zIndex: 50,
              }}>
              <motion.div
                className="absolute inset-0"
                style={{
                  scale: zoomFactor,
                  transformOrigin,
                  willChange: "transform",
                }}>
                {children}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  )
}
