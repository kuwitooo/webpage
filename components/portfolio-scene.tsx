'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState } from 'react'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import {
  AdditiveBlending,
  BufferGeometry,
  CanvasTexture,
  ExtrudeGeometry,
  Float32BufferAttribute,
  IcosahedronGeometry,
  Shape,
  SRGBColorSpace,
  getConsoleFunction,
  setConsoleFunction,
  type Group,
  type LineSegments,
  type Mesh,
  type MeshPhysicalMaterial,
  type Points,
  type PointsMaterial,
  type Sprite,
  Vector3,
  WireframeGeometry,
} from 'three'

const threeGlobal = globalThis as typeof globalThis & { __kuwitoClockWarningFilterInstalled?: boolean }
if (!threeGlobal.__kuwitoClockWarningFilterInstalled) {
  const previousThreeConsole = getConsoleFunction()
  setConsoleFunction((type, message, ...params) => {
    if (type === 'warn' && message === 'THREE.Clock: This module has been deprecated. Please use THREE.Timer instead.') return
    if (previousThreeConsole) {
      previousThreeConsole(type, message, ...params)
    } else {
      console[type](message, ...params)
    }
  })
  threeGlobal.__kuwitoClockWarningFilterInstalled = true
}

function FrameRateController({ active, fps = 30 }: { active: boolean; fps?: number }) {
  const invalidate = useThree((state) => state.invalidate)

  useEffect(() => {
    if (!active) return

    let frame = 0
    let lastRender = 0
    const frameInterval = 1000 / fps
    const tick = (time: number) => {
      if (time - lastRender >= frameInterval) {
        lastRender = time
        invalidate()
      }
      frame = window.requestAnimationFrame(tick)
    }

    frame = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(frame)
  }, [active, fps, invalidate])

  return null
}

function SoftGlow({ calm, baseSize = 9, position = [0, 0, 0] }: { calm: number; baseSize?: number; position?: [number, number, number] }) {
  const sprite = useRef<Sprite>(null)
  const elapsed = useRef(0)
  const [texture, setTexture] = useState<CanvasTexture | null>(null)

  useEffect(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 128
    canvas.height = 128
    const context = canvas.getContext('2d')
    if (!context) return

    const gradient = context.createRadialGradient(64, 64, 0, 64, 64, 64)
    gradient.addColorStop(0, 'rgba(90,150,255,.9)')
    gradient.addColorStop(0.35, 'rgba(40,90,255,.3)')
    gradient.addColorStop(1, 'rgba(0,0,0,0)')
    context.fillStyle = gradient
    context.fillRect(0, 0, 128, 128)

    const glowTexture = new CanvasTexture(canvas)
    glowTexture.colorSpace = SRGBColorSpace
    setTexture(glowTexture)
    return () => glowTexture.dispose()
  }, [])

  useFrame((_, delta) => {
    if (!sprite.current) return
    elapsed.current += delta
    const size = baseSize + Math.sin(elapsed.current * calm * 1.4) * (baseSize > 7 ? 0.5 : 0.18)
    sprite.current.scale.set(size, size, 1)
  })

  if (!texture) return null
  return (
    <sprite ref={sprite} position={position} scale={[baseSize, baseSize, 1]}>
      <spriteMaterial map={texture} blending={AdditiveBlending} depthWrite={false} />
    </sprite>
  )
}

function OrbitRing({ radius, tilt, color, speed, phase, index, calm }: { radius: number; tilt: number; color: string; speed: number; phase: number; index: number; calm: number }) {
  const ring = useRef<Group>(null)
  const bead = useRef<Mesh>(null)
  const elapsed = useRef(0)

  useFrame((_, delta) => {
    if (!ring.current || !bead.current) return
    elapsed.current += delta
    ring.current.rotation.z += delta * calm * 0.1
    const angle = elapsed.current * calm * speed + phase
    bead.current.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, 0)
  })

  return (
    <group ref={ring} rotation={[tilt, index * 0.7, 0]}>
      <mesh>
        <torusGeometry args={[radius, 0.012, 8, 180]} />
        <meshBasicMaterial color={color} transparent opacity={0.8} />
      </mesh>
      <mesh ref={bead}>
        <sphereGeometry args={[0.09, 16, 16]} />
        <meshBasicMaterial color="#bfe0ff" />
      </mesh>
    </group>
  )
}

function StarDust({ calm }: { calm: number }) {
  const stars = useRef<Points>(null)
  const geometry = useMemo(() => {
    const count = 900
    const positions = new Float32Array(count * 3)
    for (let index = 0; index < count; index += 1) {
      const radius = 5 + Math.random() * 10
      const azimuth = Math.random() * Math.PI * 2
      const polar = Math.acos(2 * Math.random() - 1)
      positions.set([
        radius * Math.sin(polar) * Math.cos(azimuth),
        radius * Math.sin(polar) * Math.sin(azimuth),
        radius * Math.cos(polar),
      ], index * 3)
    }

    const pointsGeometry = new BufferGeometry()
    pointsGeometry.setAttribute('position', new Float32BufferAttribute(positions, 3))
    return pointsGeometry
  }, [])

  useFrame((_, delta) => {
    if (stars.current) stars.current.rotation.y += delta * calm * 0.02
  })

  return (
    <points ref={stars} geometry={geometry}>
      <pointsMaterial color="#7fb0ff" size={0.04} transparent opacity={0.85} blending={AdditiveBlending} depthWrite={false} />
    </points>
  )
}

function HeroCloud() {
  const model = useRef<Group>(null)
  const faceMaterial = useRef<MeshPhysicalMaterial>(null)
  const sideMaterial = useRef<MeshPhysicalMaterial>(null)
  const scrollTarget = useRef(0)
  const scrollProgress = useRef(0)
  const elapsed = useRef(0)
  const geometry = useMemo(() => {
    const shape = new Shape()
    shape.moveTo(-1.58, -0.7)
    shape.bezierCurveTo(-1.88, -0.7, -2.02, -0.49, -2.02, -0.22)
    shape.bezierCurveTo(-2.03, 0.02, -1.93, 0.18, -1.76, 0.29)
    shape.bezierCurveTo(-2.06, 0.72, -1.77, 1.22, -1.22, 1.2)
    shape.bezierCurveTo(-1.06, 1.82, -0.18, 1.9, 0.22, 1.27)
    shape.bezierCurveTo(0.55, 1.82, 1.39, 1.75, 1.55, 1.02)
    shape.bezierCurveTo(2.2, 1.1, 2.55, 0.63, 2.29, 0.12)
    shape.bezierCurveTo(2.42, -0.24, 2.19, -0.7, 1.69, -0.7)
    shape.lineTo(-1.58, -0.7)
    const cloudGeometry = new ExtrudeGeometry(shape, {
      depth: 0.58,
      bevelEnabled: true,
      bevelSegments: 8,
      steps: 1,
      bevelSize: 0.12,
      bevelThickness: 0.12,
      curveSegments: 32,
    })
    cloudGeometry.center()
    return cloudGeometry
  }, [])

  useEffect(() => {
    const updateScrollProgress = () => {
      const distance = Math.max(0, window.scrollY || document.documentElement.scrollTop)
      scrollTarget.current = Math.min(1, distance / Math.max(1, window.innerHeight * 0.75))
    }

    updateScrollProgress()
    window.addEventListener('scroll', updateScrollProgress, { passive: true })
    window.addEventListener('resize', updateScrollProgress)
    return () => {
      window.removeEventListener('scroll', updateScrollProgress)
      window.removeEventListener('resize', updateScrollProgress)
    }
  }, [])

  useFrame(({ size }, delta) => {
    if (!model.current) return
    elapsed.current += delta
    const time = elapsed.current
    const entrance = Math.min(1, time / 1.15)
    const entranceEase = entrance * entrance * (3 - 2 * entrance)
    scrollProgress.current += (scrollTarget.current - scrollProgress.current) * Math.min(1, delta * 4)
    const progress = scrollProgress.current
    const exitProgress = Math.min(1, progress / 0.72)
    const easedProgress = exitProgress * exitProgress * (3 - 2 * exitProgress)
      model.current.scale.setScalar((size.width < 640 ? 1.12 : 1.9) * (1 + Math.sin(time * 0.58) * 0.012))
    model.current.position.x = easedProgress * (size.width < 640 ? 2.4 : 3.2) + Math.sin(time * 0.34) * 0.1
    model.current.rotation.y = Math.sin(time * 0.42) * 0.2 + easedProgress * 0.14
    model.current.rotation.x = Math.cos(time * 0.5) * 0.12
    model.current.rotation.z = Math.sin(time * 0.31) * 0.045 + easedProgress * 0.1
    model.current.position.y = Math.sin(time * 0.86) * 0.2 + Math.cos(time * 0.38) * 0.07
    if (faceMaterial.current) {
      faceMaterial.current.opacity = 0.52 * entranceEase * (1 - easedProgress)
    }
    if (sideMaterial.current) {
      sideMaterial.current.opacity = 0.42 * entranceEase * (1 - easedProgress)
    }
  })

  return (
    <group ref={model}>
      <mesh
        geometry={geometry}
        castShadow
        receiveShadow
      >
        <meshPhysicalMaterial
          ref={faceMaterial}
          attach="material-0"
          color="#f3f8ff"
          transparent
          opacity={0}
          roughness={0.42}
          metalness={0}
          clearcoat={0.24}
          clearcoatRoughness={0.38}
          specularIntensity={0.24}
          emissive="#b8d6ff"
          emissiveIntensity={0.045}
          depthWrite={false}
        />
        <meshPhysicalMaterial
          ref={sideMaterial}
          attach="material-1"
          color="#dce9fa"
          transparent
          opacity={0}
          roughness={0.48}
          metalness={0.02}
          clearcoat={0.18}
          clearcoatRoughness={0.46}
          specularIntensity={0.2}
          emissive="#9bbbe7"
          emissiveIntensity={0.035}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}

type ParticlePointer = { x: number; y: number; active: boolean }

function ParticleCloud({ pointer }: { pointer: { current: ParticlePointer } }) {
  const { size } = useThree()
  const particleCount = size.width < 640 ? 1300 : size.width < 1024 ? 2100 : 2800
  const field = useRef<Group>(null)
  const pointsMaterial = useRef<PointsMaterial>(null)
  const visibilityTarget = useRef(0)
  const visibility = useRef(0)
  const elapsed = useRef(0)
  const pointerInfluence = useRef(0)
  const pointerLocal = useMemo(() => new Vector3(), [])
  const [calm, setCalm] = useState(1)
  const geometry = useMemo(() => {
    const count = particleCount
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const random = (seed: number) => {
      const value = Math.sin(seed * 127.1 + 311.7) * 43758.5453
      return value - Math.floor(value)
    }

    for (let index = 0; index < count; index += 1) {
      const u = Math.max(0.0001, random(index * 3 + 1))
      const v = random(index * 3 + 2)
      const w = Math.max(0.0001, random(index * 3 + 3))
      const radiusA = Math.sqrt(-2 * Math.log(u))
      const radiusB = Math.sqrt(-2 * Math.log(w))
      const x = radiusA * Math.cos(2 * Math.PI * v) * 2.05
      const y = radiusA * Math.sin(2 * Math.PI * v) * 1.55
      const z = (random(index * 7 + 4) - 0.5) * radiusB * 1.3
      positions.set([x, y, z], index * 3)

      const glow = Math.max(0.3, 1 - Math.hypot(x / 3.8, y / 4.8, z / 2.6))
      const tint = random(index * 11 + 5)
      colors.set([
        glow * (0.76 + tint * 0.2),
        glow * (0.84 + tint * 0.13),
        glow,
      ], index * 3)
    }

    const pointsGeometry = new BufferGeometry()
    pointsGeometry.setAttribute('position', new Float32BufferAttribute(positions, 3))
    pointsGeometry.setAttribute('color', new Float32BufferAttribute(colors, 3))
    return pointsGeometry
  }, [particleCount])
  const basePositions = useMemo(
    () => new Float32Array(geometry.attributes.position.array as Float32Array),
    [geometry],
  )

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setCalm(preference.matches ? 0.15 : 1)
    update()
    preference.addEventListener('change', update)
    return () => preference.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    const section = document.getElementById('services')
    if (!section) return

    const observer = new IntersectionObserver(([entry]) => {
      visibilityTarget.current = entry.isIntersecting ? 1 : 0
    }, { threshold: 0.05, rootMargin: '-18% 0px -18% 0px' })

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  useFrame(({ size, viewport }, delta) => {
    if (!field.current) return
    elapsed.current += delta
    const time = elapsed.current * calm
    visibility.current += (visibilityTarget.current - visibility.current) * Math.min(1, delta * 3.5)
    const visible = visibility.current
    const scale = 1.02 + visible * 0.2
    const mobile = size.width < 640
    field.current.scale.set(scale * (mobile ? 0.32 : 1), scale * (mobile ? 1.25 : 1), scale)
    field.current.rotation.y += delta * calm * 0.075
    field.current.rotation.z = Math.sin(time * 0.18) * 0.035
    field.current.position.x = -3.2 * (1 - visible) + Math.sin(time * 0.22) * 0.08
    field.current.position.y = Math.cos(time * 0.2) * 0.1

    const pointerState = pointer.current
    pointerInfluence.current += ((pointerState.active ? 1 : 0) - pointerInfluence.current) * Math.min(1, delta * 7)
    if (pointerInfluence.current > 0.001) {
      pointerLocal.set(pointerState.x * viewport.width * 0.5, pointerState.y * viewport.height * 0.5, 0)
      field.current.updateWorldMatrix(true, false)
      field.current.worldToLocal(pointerLocal)

      const positions = geometry.attributes.position.array as Float32Array
      const radius = mobile ? 1.05 : 1.25
      const strength = pointerInfluence.current * 0.72
      const smoothing = Math.min(1, delta * 10)

      for (let index = 0; index < positions.length; index += 3) {
        const baseX = basePositions[index]
        const baseY = basePositions[index + 1]
        const dx = baseX - pointerLocal.x
        const dy = baseY - pointerLocal.y
        const distance = Math.hypot(dx, dy)
        let targetX = baseX
        let targetY = baseY

        if (distance < radius) {
          const falloff = (1 - distance / radius) ** 2 * strength
          const direction = 1 / Math.max(distance, 0.001)
          targetX += dx * direction * falloff
          targetY += dy * direction * falloff
        }

        positions[index] += (targetX - positions[index]) * smoothing
        positions[index + 1] += (targetY - positions[index + 1]) * smoothing
        positions[index + 2] += (basePositions[index + 2] - positions[index + 2]) * smoothing
      }

      geometry.attributes.position.needsUpdate = true
    }

    if (pointsMaterial.current) {
      pointsMaterial.current.opacity = 0.72 * visible
      pointsMaterial.current.size = mobile ? 0.014 : 0.022
    }
  })

  return (
    <group ref={field}>
      <points geometry={geometry}>
        <pointsMaterial ref={pointsMaterial} vertexColors transparent opacity={0} size={0.022} sizeAttenuation depthWrite={false} />
      </points>
    </group>
  )
}

export function SkillsParticleField() {
  const container = useRef<HTMLDivElement>(null)
  const pointer = useRef<ParticlePointer>({ x: 0, y: 0, active: false })
  const [active, setActive] = useState(false)

  useEffect(() => {
    const element = container.current
    if (!element) return
    const observer = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), { rootMargin: '160px' })
    observer.observe(element)

    const trackPointer = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return
      const bounds = element.getBoundingClientRect()
      const inside = event.clientX >= bounds.left && event.clientX <= bounds.right && event.clientY >= bounds.top && event.clientY <= bounds.bottom
      pointer.current.active = inside
      if (!inside || bounds.width === 0 || bounds.height === 0) return
      pointer.current.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1
      pointer.current.y = 1 - ((event.clientY - bounds.top) / bounds.height) * 2
    }
    const clearPointer = () => { pointer.current.active = false }

    window.addEventListener('pointermove', trackPointer, { passive: true })
    window.addEventListener('blur', clearPointer)
    return () => {
      observer.disconnect()
      window.removeEventListener('pointermove', trackPointer)
      window.removeEventListener('blur', clearPointer)
    }
  }, [])

  return (
    <div ref={container} className="h-full w-full">
      <Canvas dpr={1} gl={{ alpha: true, antialias: false, powerPreference: 'low-power' }} frameloop="demand" camera={{ fov: 48, position: [0, 0, 7] }}>
        <FrameRateController active={active} />
        <ParticleCloud pointer={pointer} />
      </Canvas>
    </div>
  )
}

function ChatBubbleModel() {
  const model = useRef<Group>(null)
  const elapsed = useRef(0)
  const upperBarGeometry = useMemo(() => new RoundedBoxGeometry(1.8, 0.39, 0.18, 8, 0.18), [])
  const lowerBarGeometry = useMemo(() => new RoundedBoxGeometry(1.1, 0.39, 0.18, 8, 0.18), [])
  const bodyGeometry = useMemo(() => {
    const shape = new Shape()
    shape.moveTo(-1.48, 0.55)
    shape.bezierCurveTo(-1.5, 1.35, -0.9, 1.55, -0.1, 1.52)
    shape.bezierCurveTo(0.75, 1.5, 1.5, 1.35, 1.53, 0.65)
    shape.bezierCurveTo(1.58, -0.12, 1.28, -0.75, 0.55, -0.86)
    shape.bezierCurveTo(0.05, -0.95, -0.45, -0.88, -0.78, -1.05)
    shape.bezierCurveTo(-1.04, -1.2, -1.23, -1.53, -1.28, -1.18)
    shape.bezierCurveTo(-1.34, -0.9, -1.15, -0.68, -1.37, -0.48)
    shape.bezierCurveTo(-1.55, -0.16, -1.55, 0.22, -1.48, 0.55)
    const geometry = new ExtrudeGeometry(shape, { depth: 0.36, bevelEnabled: true, bevelSegments: 8, steps: 1, bevelSize: 0.12, bevelThickness: 0.12, curveSegments: 24 })
    return geometry
  }, [])
  useFrame((state, delta) => {
    if (!model.current) return
    elapsed.current += delta
    const time = elapsed.current
    const mobileScale = Math.min(0.84, Math.max(0.64, (state.size.width / 390) * 0.78))
    model.current.scale.setScalar(state.size.width < 640 ? mobileScale : 0.98)
    model.current.position.x = Math.sin(time * 0.72) * 0.18 + Math.sin(time * 0.31) * 0.08
    model.current.position.y = Math.cos(time * 0.53) * 0.15 + Math.sin(time * 0.87) * 0.05
    model.current.position.z = Math.sin(time * 0.46) * 0.07
    model.current.rotation.x = Math.sin(time * 0.59) * 0.06
    model.current.rotation.y = Math.cos(time * 0.48) * 0.075
    model.current.rotation.z = Math.sin(time * 0.42) * 0.04
  })

  return (
    <group ref={model} scale={1.04}>
        <mesh geometry={bodyGeometry} position={[0, 0, -0.18]} castShadow receiveShadow>
          <meshPhysicalMaterial color="#17489c" transparent opacity={0.76} depthWrite={false} roughness={0.42} metalness={0.03} clearcoat={0.38} clearcoatRoughness={0.28} emissive="#0b3474" emissiveIntensity={0.34} />
        </mesh>
        <mesh geometry={upperBarGeometry} position={[-0.02, 0.48, 0.39]} castShadow>
          <meshPhysicalMaterial color="#dceaff" transparent opacity={0.84} depthWrite={false} roughness={0.16} clearcoat={0.72} emissive="#8dbbff" emissiveIntensity={0.12} />
        </mesh>
        <mesh geometry={lowerBarGeometry} position={[-0.34, -0.15, 0.39]} castShadow>
          <meshPhysicalMaterial color="#dceaff" transparent opacity={0.84} depthWrite={false} roughness={0.16} clearcoat={0.72} emissive="#8dbbff" emissiveIntensity={0.12} />
        </mesh>
      </group>
  )
}

export function PortfolioScene({ variant = 'hero' }: { variant?: 'hero' | 'contact' }) {
  const isContact = variant === 'contact'
  const scene = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(!isContact)

  useEffect(() => {
    const element = scene.current
    if (!element) return
    const observer = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), { rootMargin: '160px' })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={scene} className={isContact ? 'h-[400px] w-full sm:h-[520px]' : 'h-full w-full'} role="img" aria-label={isContact ? 'Animated 3D chat bubble' : 'Animated 3D glass cloud'}>
      <Canvas dpr={1} gl={{ alpha: true, antialias: false, powerPreference: 'low-power' }} frameloop="demand" camera={{ fov: 45, position: [0, 0, isContact ? 5.1 : 6.2] }}>
        <FrameRateController active={active} />
        {isContact ? (
          <>
            <ChatBubbleModel />
            <ambientLight intensity={1.25} />
            <directionalLight position={[3, 5, 5]} intensity={4} />
            <pointLight position={[-3, -2, 3]} intensity={11} color="#287bff" />
            <pointLight position={[2, 2, 4]} intensity={14} color="#afceff" />
          </>
        ) : (
          <>
            <HeroCloud />
            <ambientLight color="#dceaff" intensity={1.05} />
            <directionalLight position={[4, 5, 6]} intensity={3.5} color="#ffffff" />
            <pointLight position={[-3, 2.6, 3.5]} intensity={4.2} distance={12} color="#c8e7ff" />
            <pointLight position={[-4, -2, 4]} intensity={2.5} distance={24} color="#70bbff" />
            <pointLight position={[3, 1.5, -2]} intensity={2.2} distance={10} color="#3d88ee" />
          </>
        )}
      </Canvas>
    </div>
  )
}
