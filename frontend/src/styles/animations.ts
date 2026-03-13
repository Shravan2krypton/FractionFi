// Advanced Animation System for FractionFi
export const animations = {
  // Entrance Animations
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3, ease: 'easeInOut' },
  },
  
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
  },
  
  slideDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
  },
  
  slideLeft: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
  },
  
  slideRight: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
  },
  
  scaleIn: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
  },
  
  bounce: {
    initial: { scale: 0.3, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: { 
      type: 'spring', 
      stiffness: 300, 
      damping: 20,
      mass: 0.8
    },
  },
  
  // Hover Animations
  hover: {
    scale: {
      whileHover: { scale: 1.05 },
      transition: { duration: 0.2, ease: 'easeInOut' },
    },
    lift: {
      whileHover: { y: -4, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' },
      transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
    },
    glow: {
      whileHover: { boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)' },
      transition: { duration: 0.3, ease: 'easeInOut' },
    },
  },
  
  // Loading Animations
  pulse: {
    animate: { 
      scale: [1, 1.05, 1],
      opacity: [1, 0.7, 1],
    },
    transition: { 
      duration: 2, 
      repeat: Infinity,
      ease: 'easeInOut'
    },
  },
  
  spin: {
    animate: { rotate: 360 },
    transition: { 
      duration: 1, 
      repeat: Infinity,
      ease: 'linear'
    },
  },
  
  // Page Transitions
  pageTransition: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
  },
  
  // Stagger Animations
  staggerContainer: {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      }
    },
  },
  
  staggerItem: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
  },
};

// CSS Animation Classes
export const cssAnimations = {
  // Smooth transitions
  'transition-all': 'transition-all duration-300 ease-in-out',
  'transition-transform': 'transition-transform duration-300 ease-in-out',
  'transition-opacity': 'transition-opacity duration-300 ease-in-out',
  
  // Hover effects
  'hover-lift': 'hover:-translate-y-1 hover:shadow-lg transition-transform duration-200',
  'hover-scale': 'hover:scale-105 transition-transform duration-200',
  'hover-glow': 'hover:shadow-blue-500/25 transition-shadow duration-300',
  
  // Loading animations
  'spin-slow': 'animate-spin duration-1000',
  'pulse-slow': 'animate-pulse duration-2000',
  'bounce-gentle': 'animate-bounce duration-1500',
  
  // Entrance animations
  'fade-in': 'animate-fade-in duration-500',
  'slide-up': 'animate-slide-up duration-500',
  'scale-in': 'animate-scale-in duration-500',
};

// Keyframe Animations
export const keyframes = {
  float: `
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
    }
  `,
  
  shimmer: `
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
  `,
  
  glow: `
    @keyframes glow {
      0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.5); }
      50% { box-shadow: 0 0 30px rgba(59, 130, 246, 0.8); }
    }
  `,
  
  slideInFromRight: `
    @keyframes slideInFromRight {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `,
  
  slideInFromLeft: `
    @keyframes slideInFromLeft {
      from { transform: translateX(-100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `,
};
