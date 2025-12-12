import { useState, useEffect, useRef } from 'react';

// Animated snowflake component
const Snowflake = ({ style }) => (
  <div 
    className="absolute text-white opacity-80 pointer-events-none animate-pulse"
    style={style}
  >
    ✦
  </div>
);

// Spotlight beam component
const Spotlight = ({ delay, position }) => (
  <div 
    className="absolute w-32 h-96 opacity-10"
    style={{
      background: 'linear-gradient(180deg, rgba(255,215,0,0.4) 0%, transparent 100%)',
      transform: `rotate(${position === 'left' ? '15deg' : '-15deg'})`,
      top: '-50px',
      left: position === 'left' ? '5%' : 'auto',
      right: position === 'right' ? '5%' : 'auto',
      animation: `spotlight 4s ease-in-out ${delay}s infinite alternate`,
    }}
  />
);

// Curtain component
const Curtain = ({ side }) => (
  <div 
    className="absolute top-0 h-full w-24 md:w-32"
    style={{
      background: 'linear-gradient(to right, #8B0000, #B22222, #8B0000)',
      boxShadow: side === 'left' 
        ? 'inset -20px 0 30px rgba(0,0,0,0.5)' 
        : 'inset 20px 0 30px rgba(0,0,0,0.5)',
      left: side === 'left' ? 0 : 'auto',
      right: side === 'right' ? 0 : 'auto',
    }}
  >
    <div 
      className="h-full w-full"
      style={{
        background: `repeating-linear-gradient(
          180deg,
          transparent,
          transparent 40px,
          rgba(0,0,0,0.1) 40px,
          rgba(0,0,0,0.1) 80px
        )`,
      }}
    />
  </div>
);

// Star twinkle component
const Star = ({ style }) => (
  <div 
    className="absolute text-yellow-300"
    style={{
      ...style,
      animation: `twinkle ${2 + Math.random() * 2}s ease-in-out infinite`,
      animationDelay: `${Math.random() * 2}s`,
    }}
  >
    ★
  </div>
);

export default function MeissnerHolidayCard() {
  const [isOpen, setIsOpen] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [snowflakes, setSnowflakes] = useState([]);
  const [stars, setStars] = useState([]);
  const containerRef = useRef(null);

  // Generate snowflakes
  useEffect(() => {
    const flakes = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      animationDuration: `${5 + Math.random() * 10}s`,
      animationDelay: `${Math.random() * 5}s`,
      fontSize: `${8 + Math.random() * 12}px`,
      opacity: 0.3 + Math.random() * 0.5,
    }));
    setSnowflakes(flakes);

    const starArray = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: `${10 + Math.random() * 80}%`,
      top: `${5 + Math.random() * 30}%`,
      fontSize: `${6 + Math.random() * 10}px`,
    }));
    setStars(starArray);
  }, []);

  // Handle card opening
  const handleOpen = () => {
    setIsOpen(true);
    setTimeout(() => setShowMessage(true), 800);
  };

  return (
    <div 
      ref={containerRef}
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: 'linear-gradient(180deg, #0a0a0a 0%, #1a1a2e 50%, #0a0a0a 100%)',
      }}
    >
      {/* Global styles */}
      <style>{`
        @keyframes fall {
          0% {
            transform: translateY(-10vh) rotate(0deg);
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
          }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes spotlight {
          0% { opacity: 0.05; }
          100% { opacity: 0.15; }
        }
        @keyframes curtainOpen {
          0% { transform: scaleX(1); }
          100% { transform: scaleX(0); }
        }
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes glow {
          0%, 100% { text-shadow: 0 0 10px rgba(255,215,0,0.5), 0 0 20px rgba(255,215,0,0.3); }
          50% { text-shadow: 0 0 20px rgba(255,215,0,0.8), 0 0 40px rgba(255,215,0,0.5), 0 0 60px rgba(255,215,0,0.3); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .gold-shimmer {
          background: linear-gradient(90deg, #D4AF37 0%, #FFD700 25%, #FFF8DC 50%, #FFD700 75%, #D4AF37 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 3s linear infinite;
        }
      `}</style>

      {/* Snowflakes */}
      {snowflakes.map((flake) => (
        <Snowflake
          key={flake.id}
          style={{
            left: flake.left,
            fontSize: flake.fontSize,
            opacity: flake.opacity,
            animation: `fall ${flake.animationDuration} linear ${flake.animationDelay} infinite`,
          }}
        />
      ))}

      {/* Main Card */}
      <div 
        className="relative w-full max-w-2xl overflow-hidden rounded-lg shadow-2xl"
        style={{
          background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)',
          border: '2px solid rgba(212, 175, 55, 0.3)',
          minHeight: '500px',
        }}
      >
        {/* Spotlights */}
        <Spotlight delay={0} position="left" />
        <Spotlight delay={2} position="right" />

        {/* Stars */}
        {stars.map((star) => (
          <Star key={star.id} style={{ left: star.left, top: star.top, fontSize: star.fontSize }} />
        ))}

        {/* Curtains */}
        <div
          className="absolute top-0 left-0 h-full origin-left z-20"
          style={{
            animation: isOpen ? 'curtainOpen 1.5s ease-out forwards' : 'none',
          }}
        >
          <Curtain side="left" />
        </div>
        <div
          className="absolute top-0 right-0 h-full origin-right z-20"
          style={{
            animation: isOpen ? 'curtainOpen 1.5s ease-out forwards' : 'none',
          }}
        >
          <Curtain side="right" />
        </div>

        {/* Content */}
        <div className="relative z-10 p-8 md:p-12 text-center">
          {/* Logo/Header */}
          <div 
            className="mb-8"
            style={{
              opacity: showMessage ? 1 : 0,
              animation: showMessage ? 'fadeInUp 0.8s ease-out forwards' : 'none',
            }}
          >
            <h1 
              className="text-3xl md:text-4xl font-light tracking-widest mb-2 gold-shimmer"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              MEISSNER
            </h1>
            <h2 
              className="text-xl md:text-2xl font-light tracking-wider text-gray-300"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              MANAGEMENT
            </h2>
          </div>

          {/* Decorative divider */}
          <div 
            className="flex items-center justify-center gap-4 mb-8"
            style={{
              opacity: showMessage ? 1 : 0,
              animation: showMessage ? 'fadeInUp 0.8s ease-out 0.2s forwards' : 'none',
              animationFillMode: 'backwards',
            }}
          >
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-yellow-600" />
            <span className="text-yellow-500 text-2xl">✦</span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-yellow-600" />
          </div>

          {/* Holiday Message */}
          <div
            style={{
              opacity: showMessage ? 1 : 0,
              animation: showMessage ? 'fadeInUp 0.8s ease-out 0.4s forwards' : 'none',
              animationFillMode: 'backwards',
            }}
          >
            <p 
              className="text-4xl md:text-5xl font-light mb-6"
              style={{ 
                fontFamily: 'Georgia, serif',
                color: '#FFD700',
                animation: showMessage ? 'glow 3s ease-in-out infinite' : 'none',
              }}
            >
              Happy Holidays
            </p>
            <p 
              className="text-lg md:text-xl text-gray-300 font-light mb-8 leading-relaxed"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Wishing you a season filled with<br />
              joy, wonder, and standing ovations.
            </p>
          </div>

          {/* Year */}
          <div
            style={{
              opacity: showMessage ? 1 : 0,
              animation: showMessage ? 'fadeInUp 0.8s ease-out 0.6s forwards' : 'none',
              animationFillMode: 'backwards',
            }}
          >
            <p 
              className="text-gray-400 text-sm tracking-widest mb-8"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              2025 • SYDNEY
            </p>
          </div>

          {/* Thank you message */}
          <div
            className="border-t border-yellow-900/30 pt-6 mt-6"
            style={{
              opacity: showMessage ? 1 : 0,
              animation: showMessage ? 'fadeInUp 0.8s ease-out 0.8s forwards' : 'none',
              animationFillMode: 'backwards',
            }}
          >
            <p 
              className="text-gray-400 text-sm italic"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Thank you for being part of our story this year.<br />
              Here's to new acts and encore performances in 2025.
            </p>
          </div>

          {/* Open button (shows before card is opened) */}
          {!isOpen && (
            <button
              onClick={handleOpen}
              className="absolute inset-0 w-full h-full flex items-center justify-center cursor-pointer z-30"
              style={{ background: 'rgba(0,0,0,0.7)' }}
            >
              <div className="text-center">
                <div 
                  className="text-6xl mb-4"
                  style={{ animation: 'twinkle 2s ease-in-out infinite' }}
                >
                  🎭
                </div>
                <p 
                  className="text-xl text-yellow-500 tracking-widest"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  Click to Open
                </p>
                <p 
                  className="text-sm text-gray-400 mt-2"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  The curtain awaits...
                </p>
              </div>
            </button>
          )}
        </div>

        {/* Stage floor reflection */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-24"
          style={{
            background: 'linear-gradient(0deg, rgba(212,175,55,0.1) 0%, transparent 100%)',
          }}
        />

        {/* Decorative corner ornaments */}
        <div className="absolute top-4 left-4 text-yellow-700 opacity-30 text-2xl">❧</div>
        <div className="absolute top-4 right-4 text-yellow-700 opacity-30 text-2xl" style={{ transform: 'scaleX(-1)' }}>❧</div>
        <div className="absolute bottom-4 left-4 text-yellow-700 opacity-30 text-2xl" style={{ transform: 'scaleY(-1)' }}>❧</div>
        <div className="absolute bottom-4 right-4 text-yellow-700 opacity-30 text-2xl" style={{ transform: 'scale(-1)' }}>❧</div>
      </div>

      {/* Footer */}
      <div 
        className="absolute bottom-4 text-center text-gray-600 text-xs tracking-wider"
        style={{ fontFamily: 'Georgia, serif' }}
      >
        meissnermanagement.com.au
      </div>
    </div>
  );
}