import { useEffect, useRef, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ArrowDown, Sparkles, ChevronRight } from 'lucide-react';
import gsap from 'gsap';
import * as THREE from 'three';
import { useTheme } from '../context/ThemeContext';

// ========================================
// FLUID SIMULATION SHADER
// ========================================
const fluidVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fluidFragmentShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform vec2 uResolution;
  uniform float uIntensity;
  varying vec2 vUv;
  
  // Simplex noise function
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
  
  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
             -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
      + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }
  
  void main() {
    vec2 uv = vUv;
    vec2 mouse = uMouse * 0.5 + 0.5;
    
    // Create flowing liquid effect
    float time = uTime * 0.3;
    
    // Multiple layers of noise
    float noise1 = snoise(uv * 3.0 + time);
    float noise2 = snoise(uv * 5.0 - time * 0.5);
    float noise3 = snoise(uv * 8.0 + time * 0.3);
    
    // Mouse interaction - create ripples
    float dist = distance(uv, mouse);
    float ripple = sin(dist * 20.0 - uTime * 3.0) * exp(-dist * 3.0) * uIntensity;
    
    // Combine noises
    float finalNoise = noise1 * 0.5 + noise2 * 0.3 + noise3 * 0.2 + ripple * 0.3;
    
    // Keller Williams Colors - Scarlet, Charcoal, Silver
    vec3 color1 = vec3(0.70, 0.00, 0.00); // KW Red (#B40101 approximated)
    vec3 color2 = vec3(0.06, 0.06, 0.06); // Deep Charcoal
    vec3 color3 = vec3(0.81, 0.08, 0.17); // Lighter KW Red (#cf142b)
    vec3 color4 = vec3(0.94, 0.94, 0.94); // KW Silver/White (#f1f1f1)
    
    // Mix colors based on noise
    vec3 finalColor = mix(color1, color2, finalNoise * 0.5 + 0.5);
    finalColor = mix(finalColor, color3, noise2 * 0.3 + 0.2);
    finalColor = mix(finalColor, color4, noise3 * 0.2);
    
    // Add glow based on mouse proximity
    float glow = smoothstep(0.5, 0.0, dist) * uIntensity;
    finalColor += vec3(glow * 0.3);
    
    // Vignette
    float vignette = 1.0 - smoothstep(0.3, 1.0, length(uv - 0.5));
    finalColor *= vignette * 0.8 + 0.2;
    
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

// ========================================
// FLUID BACKGROUND COMPONENT
// ========================================
function FluidBackground() {
  const meshRef = useRef<THREE.Mesh>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const { viewport } = useThree();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      uIntensity: { value: 1.0 },
    }),
    []
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uTime.value = state.clock.elapsedTime;
      material.uniforms.uMouse.value.x += (mouseRef.current.x - material.uniforms.uMouse.value.x) * 0.05;
      material.uniforms.uMouse.value.y += (mouseRef.current.y - material.uniforms.uMouse.value.y) * 0.05;
    }
  });

  return (
    <mesh ref={meshRef} scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <shaderMaterial
        vertexShader={fluidVertexShader}
        fragmentShader={fluidFragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}

// ========================================
// FLOATING PARTICLES
// ========================================
function FloatingParticles() {
  const pointsRef = useRef<THREE.Points>(null);
  const particleCount = 150;

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const col = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      pos[i3] = (Math.random() - 0.5) * 15;
      pos[i3 + 1] = (Math.random() - 0.5) * 15;
      pos[i3 + 2] = (Math.random() - 0.5) * 5;

      const color = new THREE.Color();
      const hue = Math.random() > 0.5 ? 0.5 + Math.random() * 0.1 : 0.9 + Math.random() * 0.1;
      color.setHSL(hue, 0.8, 0.6);
      col[i3] = color.r;
      col[i3 + 1] = color.g;
      col[i3 + 2] = color.b;
    }

    return [pos, col];
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02;
      pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        vertexColors
        transparent
        opacity={0.9}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ========================================
// GEOMETRIC SHAPES
// ========================================
function GeometricShapes() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      groupRef.current.children.forEach((child, i) => {
        child.position.y += Math.sin(state.clock.elapsedTime * 0.5 + i) * 0.003;
        child.rotation.x += 0.002;
        child.rotation.z += 0.001;
      });
    }
  });

  return (
    <group ref={groupRef}>
      {/* Floating Icosahedron */}
      <mesh position={[-4, 2, -3]}>
        <icosahedronGeometry args={[0.4, 0]} />
        <meshStandardMaterial
          color="#d4af37"
          transparent
          opacity={0.3}
          wireframe
          emissive="#d4af37"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Floating Torus Knot */}
      <mesh position={[4, -1, -4]}>
        <torusKnotGeometry args={[0.3, 0.1, 64, 8]} />
        <meshStandardMaterial
          color="#c5a059"
          transparent
          opacity={0.3}
          wireframe
          emissive="#c5a059"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Floating Octahedron */}
      <mesh position={[3, 3, -5]}>
        <octahedronGeometry args={[0.35]} />
        <meshStandardMaterial
          color="#f4e8c1"
          transparent
          opacity={0.3}
          wireframe
          emissive="#f4e8c1"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Floating Dodecahedron */}
      <mesh position={[-3, -2, -4]}>
        <dodecahedronGeometry args={[0.3]} />
        <meshStandardMaterial
          color="#8b7355"
          transparent
          opacity={0.3}
          wireframe
          emissive="#8b7355"
          emissiveIntensity={0.2}
        />
      </mesh>
    </group>
  );
}

// ========================================
// SCENE
// ========================================
function Scene() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={0.5} color="#00f5ff" />
      <pointLight position={[-10, -10, 5]} intensity={0.5} color="#ff006e" />
      <FluidBackground />
      <FloatingParticles />
      <GeometricShapes />
    </>
  );
}

// ========================================
// KINETIC TEXT COMPONENT
// ========================================
function KineticText({ text, className }: { text: string; className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const chars = containerRef.current?.querySelectorAll('.kinetic-char');
    if (chars) {
      gsap.fromTo(
        chars,
        { y: 100, opacity: 0, rotateX: 90 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 1,
          stagger: 0.03,
          ease: 'power3.out',
          delay: 0.5,
        }
      );
    }
  }, []);

  return (
    <div ref={containerRef} className={`perspective-1000 ${className}`}>
      {text.split('').map((char, i) => (
        <span
          key={i}
          className="kinetic-char inline-block preserve-3d"
          style={{ display: char === ' ' ? 'inline' : 'inline-block' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </div>
  );
}

// ========================================
// MAIN HERO COMPONENT
// ========================================
export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { theme } = useTheme();

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Subtitle animation
      gsap.fromTo(
        '.hero-subtitle',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 1.2 }
      );

      // CTA animation
      gsap.fromTo(
        '.hero-cta',
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.8,
          ease: 'back.out(1.7)',
          delay: 1.5,
        }
      );

      // Badge animation
      gsap.fromTo(
        '.hero-badge',
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.6,
          ease: 'back.out(1.7)',
          delay: 0.3,
        }
      );

      // Scroll parallax for content
      gsap.to('.hero-content', {
        yPercent: -30,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: '50% top',
          scrub: true,
        },
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  // Mouse move handler for 3D tilt effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleScrollToWorks = () => {
    const portfolio = document.querySelector('#portfolio');
    if (portfolio) {
      portfolio.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* WebGL Canvas Background */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
          <Scene />
        </Canvas>
      </div>

      {/* Abstract Image Overlay */}
      <div className="absolute inset-0 z-[1] opacity-30 mix-blend-overlay">
        <img
          src="/images/hero-abstract.jpg"
          alt=""
          className="w-full h-full object-cover"
        />
      </div>

      {/* Gradient Overlay */}
      <div
        className="absolute inset-0 z-[2]"
        style={{
          background: theme === 'dark'
            ? 'radial-gradient(ellipse at center, transparent 0%, rgba(10, 10, 15, 0.5) 100%)'
            : 'radial-gradient(ellipse at center, transparent 0%, rgba(248, 249, 252, 0.5) 100%)'
        }}
      />

      {/* Content */}
      <div
        ref={contentRef}
        className="hero-content relative z-10 text-center px-6 perspective-1000"
        style={{
          transform: `rotateX(${mousePosition.y * -2}deg) rotateY(${mousePosition.x * 2}deg)`,
          transition: 'transform 0.3s ease-out',
        }}
      >
        {/* Glass Card */}
        <div className="glass rounded-3xl p-8 md:p-12 lg:p-16 max-w-4xl mx-auto glow-cyan">
          {/* Badge */}
          <div className="hero-badge inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-cyan)]/10 border border-[var(--color-cyan)]/30 mb-8">
            <Sparkles className="w-4 h-4 text-[var(--color-cyan)]" />
            <span className="text-sm text-[var(--text-secondary)]">Available for freelance work</span>
          </div>

          {/* Title with Kinetic Typography */}
          <KineticText
            text="I'm BriNa"
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 font-[var(--font-display)] text-[var(--text-primary)]"
          />

          {/* Subtitle */}
          <p className="hero-subtitle text-xl md:text-2xl text-[var(--text-secondary)] mb-4 font-light relative inline-block">
            a{' '}
            <span className="text-gradient font-medium relative z-10">
              Creative Developer
            </span>
            {/* Hand-Drawn SVG Underline */}
            <svg className="absolute -bottom-2 md:-bottom-3 left-6 w-full h-4 md:h-6 text-[var(--color-cyan)] opacity-70 z-0 pointer-events-none" viewBox="0 0 200 20" preserveAspectRatio="none" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 15Q50 5 100 12T195 8" />
              <path d="M15 18Q60 8 110 15T185 12" opacity="0.5" />
            </svg>
          </p>

          <p className="hero-subtitle text-base md:text-lg text-[var(--text-tertiary)] max-w-xl mx-auto mb-10">
            Crafting immersive digital experiences through the fusion of design
            and cutting-edge technology.
          </p>

          {/* CTA Buttons */}
          <div className="hero-cta flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleScrollToWorks}
              className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[var(--color-cyan)] to-[var(--color-magenta)] text-white font-medium rounded-full hover:scale-105 transition-all duration-300 glow-cyan"
            >
              Explore Works
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <a
              href="#footer"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector('#footer')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="group flex items-center gap-3 px-8 py-4 border border-[var(--border-color)] text-[var(--text-primary)] font-medium rounded-full hover:bg-[var(--bg-glass)] transition-all duration-300"
            >
              Get in Touch
              <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
            </a>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <div className="w-6 h-10 border-2 border-[var(--color-cyan)]/30 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-[var(--color-cyan)] rounded-full animate-bounce" />
        </div>
      </div>

      {/* Corner Decorations */}
      <div className="absolute top-20 left-10 w-20 h-20 border border-[var(--color-cyan)]/20 rounded-full animate-pulse" />
      <div className="absolute bottom-20 right-10 w-32 h-32 border border-[var(--color-magenta)]/20 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
    </section>
  );
}
