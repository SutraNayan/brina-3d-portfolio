import { useEffect, useRef, useState, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Briefcase, Users, Award, TrendingUp, Terminal, Monitor, AppWindow, Building2, Globe2, Plane, Brain, Camera } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
gsap.registerPlugin(ScrollTrigger);

const stats = [
  {
    icon: Briefcase,
    value: 12,
    suffix: '+',
    label: 'Years Experience',
    color: '#00f5ff',
  },
  {
    icon: Users,
    value: 310,
    suffix: '+',
    label: 'Projects Completed',
    color: '#ff006e',
  },
  {
    icon: Award,
    value: 100,
    suffix: '%',
    label: 'Client Satisfaction',
    color: '#ffbe0b',
  },
  {
    icon: TrendingUp,
    value: 10,
    suffix: 'M+',
    label: 'Total Followers',
    color: '#111111', // Dark Charcoal
  },
];

// Skill Galaxy Data
const skillNodes = [
  { id: 1, name: 'Prompt Engineering', x: 20, y: 30, size: 40, color: '#b40101', icon: Terminal }, // KW Red
  { id: 2, name: 'Website', x: 50, y: 20, size: 35, color: '#cf142b', icon: Monitor }, // Lighter Red
  { id: 3, name: 'WebApp', x: 80, y: 35, size: 38, color: '#f1f1f1', icon: AppWindow }, // Silver
  { id: 4, name: 'Real Estate', x: 30, y: 60, size: 32, color: '#111111', icon: Building2 }, // Charcoal
  { id: 5, name: 'Multilingual', x: 70, y: 55, size: 30, color: '#b40101', icon: Globe2 },
  { id: 6, name: 'Drone', x: 45, y: 75, size: 36, color: '#cf142b', icon: Plane },
  { id: 7, name: 'AI', x: 85, y: 70, size: 34, color: '#f1f1f1', icon: Brain },
  { id: 8, name: 'Photography', x: 15, y: 80, size: 28, color: '#111111', icon: Camera },
];

const connections = [
  [0, 1], [1, 2], [2, 4], [4, 6], [6, 5], [5, 3], [3, 0],
  [0, 4], [1, 5], [2, 6], [3, 7], [7, 0],
];

function ConstellationStars() {
  const pointsRef = useRef<THREE.Points>(null);
  const particleCount = 400;

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const col = new Float32Array(particleCount * 3);

    // Keller Williams colors for the stars
    const colorsList = [
      new THREE.Color('#b40101'), // KW Red
      new THREE.Color('#cf142b'), // Lighter Red
      new THREE.Color('#f1f1f1'), // Silver/White
      new THREE.Color('#111111'), // Deep Charcoal glow
    ];

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      pos[i3] = (Math.random() - 0.5) * 15;
      pos[i3 + 1] = (Math.random() - 0.5) * 10;
      pos[i3 + 2] = (Math.random() - 0.5) * 5;

      const color = colorsList[Math.floor(Math.random() * colorsList.length)];
      col[i3] = color.r;
      col[i3 + 1] = color.g;
      col[i3 + 2] = color.b;
    }
    return [pos, col];
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.05;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function AnimatedCounter({
  value,
  suffix,
  isVisible,
}: {
  value: number;
  suffix: string;
  isVisible: boolean;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isVisible, value]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
}

export default function Statistics() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const galaxyRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Set visibility when section enters viewport
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 80%',
        onEnter: () => setIsVisible(true),
      });

      // Stat cards entrance
      gsap.fromTo(
        '.stat-card',
        { y: 80, opacity: 0, rotateX: 45 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 1,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Skill galaxy entrance
      gsap.fromTo(
        '.skill-node',
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: galaxyRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Connection lines draw
      gsap.fromTo(
        '.connection-line',
        { strokeDashoffset: 1000 },
        {
          strokeDashoffset: 0,
          duration: 2,
          stagger: 0.05,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: galaxyRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="statistics"
      ref={sectionRef}
      className="relative min-h-screen py-24 lg:py-32 overflow-hidden flex items-center"
    >
      {/* Abstract Background */}
      <div className="absolute inset-0 z-0 opacity-30">
        <img
          src="/images/stats-abstract.jpg"
          alt=""
          className="w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to bottom, var(--bg-primary) 0%, transparent 30%, transparent 70%, var(--bg-primary) 100%)`
          }}
        />
      </div>

      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--color-cyan)]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[var(--color-magenta)]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 w-full">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 font-[var(--font-display)] text-[var(--text-primary)]">
            By The <span className="text-gradient">Numbers</span>
          </h2>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
            A snapshot of my journey and the impact I've made along the way.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-20">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="stat-card relative group perspective-1000"
            >
              <div
                className="relative p-8 rounded-3xl glass overflow-hidden transition-all duration-500 hover:scale-105"
                style={{
                  boxShadow: `0 0 40px ${stat.color}10`,
                }}
              >
                {/* Glow Effect */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `radial-gradient(circle at center, ${stat.color}20 0%, transparent 70%)`,
                  }}
                />

                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
                    style={{ background: `${stat.color}20` }}
                  >
                    <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
                  </div>

                  {/* Value */}
                  <div
                    className="text-4xl md:text-5xl lg:text-6xl font-bold mb-2"
                    style={{ color: stat.color }}
                  >
                    <AnimatedCounter
                      value={stat.value}
                      suffix={stat.suffix}
                      isVisible={isVisible}
                    />
                  </div>

                  {/* Label */}
                  <p className="text-[var(--text-secondary)] text-sm md:text-base">{stat.label}</p>
                </div>

                {/* Corner Decoration */}
                <div
                  className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full opacity-20"
                  style={{ background: stat.color }}
                />

                {/* Animated Border */}
                <div
                  className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    border: `1px solid ${stat.color}50`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Skill Galaxy */}
        <div className="text-center mb-10">
          <h3 className="text-3xl md:text-4xl font-bold mb-4 font-[var(--font-display)] text-[var(--text-primary)]">
            Skill <span className="text-gradient-gold">Constellation</span>
          </h3>
          <p className="text-[var(--text-secondary)]">
            Explore my technical universe - hover over nodes to discover connections
          </p>
        </div>

        <div
          ref={galaxyRef}
          className="relative w-full aspect-[2/1] max-w-4xl mx-auto"
        >
          {/* 3D Stars Background */}
          <div className="absolute inset-0 z-0 pointer-events-none opacity-80">
            <Canvas camera={{ position: [0, 0, 4], fov: 60 }}>
              <ambientLight intensity={0.5} />
              <ConstellationStars />
            </Canvas>
          </div>

          {/* SVG Connections */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {connections.map((connection, i) => {
              const node1 = skillNodes[connection[0]];
              const node2 = skillNodes[connection[1]];
              const isActive = hoveredNode === connection[0] || hoveredNode === connection[1];

              return (
                <line
                  key={i}
                  className="connection-line"
                  x1={`${node1.x}%`}
                  y1={`${node1.y}%`}
                  x2={`${node2.x}%`}
                  y2={`${node2.y}%`}
                  stroke={isActive ? 'var(--color-cyan)' : 'var(--border-color)'}
                  strokeWidth={isActive ? 2 : 1}
                  strokeDasharray="1000"
                  strokeDashoffset="0"
                  style={{
                    opacity: isActive ? 1 : 0.3,
                    transition: 'all 0.3s ease',
                  }}
                />
              );
            })}
          </svg>

          {/* Skill Nodes */}
          {skillNodes.map((node, index) => (
            <div
              key={node.id}
              className="skill-node absolute cursor-pointer"
              style={{
                left: `${node.x}%`,
                top: `${node.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
              onMouseEnter={() => setHoveredNode(index)}
              onMouseLeave={() => setHoveredNode(null)}
            >
              <div
                className={`relative flex flex-col items-center transition-all duration-300 ${hoveredNode === index ? 'scale-125' : hoveredNode !== null ? 'opacity-50' : ''
                  }`}
              >
                {/* Node Circle */}
                <div
                  className="w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-all duration-300"
                  style={{
                    background: `${node.color}20`,
                    border: `2px solid ${node.color}`,
                    boxShadow: hoveredNode === index ? `0 0 30px ${node.color}50` : 'none',
                  }}
                >
                  <node.icon className="w-5 h-5 md:w-6 md:h-6" style={{ color: node.color }} />
                </div>

                {/* Node Label */}
                <span
                  className="mt-2 text-xs md:text-sm font-medium whitespace-nowrap"
                  style={{ color: node.color }}
                >
                  {node.name}
                </span>

                {/* Orbit Ring */}
                <div
                  className="absolute w-20 h-20 md:w-24 md:h-24 rounded-full border border-dashed animate-spin"
                  style={{
                    borderColor: `${node.color}30`,
                    animationDuration: `${10 + index * 2}s`,
                    opacity: hoveredNode === index ? 1 : 0,
                    transition: 'opacity 0.3s ease',
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Decorative Line */}
        <div className="mt-20 flex items-center justify-center gap-4">
          <div className="h-px w-20 bg-gradient-to-r from-transparent to-[var(--border-color)]" />
          <div className="w-2 h-2 rounded-full bg-[var(--color-cyan)] animate-pulse" />
          <div className="h-px w-40 bg-[var(--border-color)]" />
          <div className="w-2 h-2 rounded-full bg-[var(--color-magenta)] animate-pulse" />
          <div className="h-px w-20 bg-gradient-to-l from-transparent to-[var(--border-color)]" />
        </div>
      </div>
    </section>
  );
}
