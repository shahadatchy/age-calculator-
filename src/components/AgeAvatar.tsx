import { motion } from 'motion/react';
import { AgeCategory, Gender } from '../types';

interface AgeAvatarProps {
  category: AgeCategory;
  gender: Gender;
}

export default function AgeAvatar({ category, gender }: AgeAvatarProps) {
  // Select color palettes based on category & gender
  const getPalette = () => {
    switch (category) {
      case 'child':
        return {
          primary: '#38BDF8', // Sky
          secondary: '#F472B6', // Pink
          accent: '#FB7185', // Rose
          bgGlow: 'from-sky-500/20 to-pink-500/20'
        };
      case 'boy':
        return {
          primary: '#4ADE80', // Green
          secondary: '#60A5FA', // Blue
          accent: '#FBBF24', // Yellow
          bgGlow: 'from-emerald-500/20 to-blue-500/20'
        };
      case 'teenage':
        return {
          primary: '#A78BFA', // Violet
          secondary: '#EC4899', // Pink
          accent: '#22D3EE', // Cyan
          bgGlow: 'from-violet-500/20 to-pink-500/20'
        };
      case 'adult':
        return {
          primary: '#F43F5E', // Rose
          secondary: '#3B82F6', // Blue
          accent: '#10B981', // Emerald
          bgGlow: 'from-indigo-500/20 to-rose-500/20'
        };
      case 'senior':
        return {
          primary: '#94A3B8', // Slate
          secondary: '#F59E0B', // Amber
          accent: '#14B8A6', // Teal
          bgGlow: 'from-slate-500/20 to-amber-500/20'
        };
    }
  };

  const palette = getPalette();

  // Eye blinking animation
  const eyeVariants = {
    blink: {
      scaleY: [1, 1, 0.1, 1, 1],
      transition: {
        duration: 3,
        repeat: Infinity,
        repeatDelay: 2
      }
    }
  };

  // Idle animation for avatars
  const avatarFloating = {
    y: [-4, 4, -4],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  const ringRotation = {
    rotate: [0, 360],
    transition: {
      duration: 15,
      repeat: Infinity,
      ease: "linear"
    }
  };

  const renderVector = () => {
    switch (category) {
      case 'child':
        return (
          <g>
            {/* Cute Child / Baby Face */}
            <circle cx="100" cy="100" r="45" fill="#FED7AA" /> {/* Skin */}
            <path d="M 85 105 Q 100 120 115 105" stroke="#E11D48" strokeWidth="3" fill="none" strokeLinecap="round" /> {/* Mouth */}
            
            {/* Dynamic Eyes with blink */}
            <motion.ellipse cx="85" cy="90" rx="4" ry="5" fill="#1E293B" animate="blink" variants={eyeVariants} />
            <motion.ellipse cx="115" cy="90" rx="4" ry="5" fill="#1E293B" animate="blink" variants={eyeVariants} />
            
            {/* Cute Cheeks */}
            <circle cx="75" cy="98" r="6" fill="#FDA4AF" opacity="0.6" />
            <circle cx="125" cy="98" r="6" fill="#FDA4AF" opacity="0.6" />

            {/* Child hairstyle/gender highlights */}
            {gender === 'female' ? (
              <>
                <circle cx="100" cy="55" r="8" fill="#F472B6" /> {/* Pink Bow */}
                <ellipse cx="100" cy="55" rx="14" ry="4" fill="#F472B6" />
                <path d="M 75 70 Q 100 60 125 70" stroke="#F43F5E" strokeWidth="4" fill="none" />
              </>
            ) : gender === 'male' ? (
              <>
                {/* Cute little backward blue cap */}
                <path d="M 75 68 Q 100 48 125 68" fill="#38BDF8" />
                <rect x="62" y="58" width="20" height="6" rx="2" fill="#0284C7" transform="rotate(-15, 62, 58)" />
              </>
            ) : (
              <>
                {/* Single curl hair strand */}
                <path d="M 100 55 Q 92 40 108 30" stroke="#B45309" strokeWidth="4" fill="none" strokeLinecap="round" />
              </>
            )}
            {/* Pacifier for Neutral baby */}
            {gender === 'neutral' && (
              <g transform="translate(100, 108)">
                <circle cx="0" cy="0" r="8" fill="#F43F5E" />
                <circle cx="0" cy="0" r="14" fill="none" stroke="#F43F5E" strokeWidth="3" />
              </g>
            )}
          </g>
        );

      case 'boy':
        return (
          <g>
            {/* Boy/Girl Young Youth Face */}
            <circle cx="100" cy="100" r="45" fill="#FFEDD5" />
            <path d="M 82 108 Q 100 125 118 108" stroke="#EA580C" strokeWidth="3.5" fill="none" strokeLinecap="round" /> {/* Big Smile */}
            
            {/* Active Eyes */}
            <motion.circle cx="82" cy="88" r="4.5" fill="#1E293B" animate="blink" variants={eyeVariants} />
            <motion.circle cx="118" cy="88" r="4.5" fill="#1E293B" animate="blink" variants={eyeVariants} />
            
            {/* Hair and Hats */}
            {gender === 'female' ? (
              <>
                {/* High Ponytail with Bow */}
                <path d="M 130 75 Q 160 55 155 100" stroke="#78350F" strokeWidth="16" strokeLinecap="round" fill="none" />
                <circle cx="132" cy="73" r="8" fill="#F87171" /> {/* Hair Tie */}
                {/* Stylish Bangs */}
                <path d="M 60 75 Q 100 50 140 75" fill="#9A3412" />
                <path d="M 58 75 Q 52 100 52 110" stroke="#9A3412" strokeWidth="8" strokeLinecap="round" />
                <path d="M 142 75 Q 148 100 148 110" stroke="#9A3412" strokeWidth="8" strokeLinecap="round" />
              </>
            ) : gender === 'male' ? (
              <>
                {/* Cool Green cap worn sideways */}
                <path d="M 65 72 Q 100 52 135 72" fill="#4ADE80" />
                <rect x="118" y="55" width="28" height="7" rx="3" fill="#15803D" transform="rotate(20, 118, 55)" />
                {/* Spiky brown tufts */}
                <path d="M 68 76 L 62 65 L 75 70" fill="#78350F" />
                <path d="M 78 72 L 80 58 L 88 68" fill="#78350F" />
              </>
            ) : (
              <>
                {/* Cute bright orange cap facing straight */}
                <path d="M 65 72 Q 100 48 135 72" fill="#F59E0B" />
                <ellipse cx="100" cy="52" rx="6" ry="6" fill="#D97706" />
                <rect x="80" y="66" width="40" height="7" rx="3" fill="#D97706" />
                {/* Wavy ginger locks */}
                <path d="M 58 82 Q 50 95 56 105" stroke="#78350F" strokeWidth="6" strokeLinecap="round" fill="none" />
                <path d="M 142 82 Q 150 95 144 105" stroke="#78350F" strokeWidth="6" strokeLinecap="round" fill="none" />
              </>
            )}
          </g>
        );

      case 'teenage':
        return (
          <g>
            {/* Teenage Face */}
            <circle cx="100" cy="100" r="45" fill="#FFE4E6" />
            
            {/* Cool half-closed eyes or playful wink */}
            <motion.circle cx="80" cy="90" r="5" fill="#1E293B" animate="blink" variants={eyeVariants} />
            <motion.circle cx="120" cy="90" r="5" fill="#1E293B" animate="blink" variants={eyeVariants} />
            
            {/* Confident smirk */}
            <path d="M 90 110 Q 102 114 110 108" stroke="#BE123C" strokeWidth="3" fill="none" strokeLinecap="round" />

            {/* Over-Ear Gaming/Music Headphones */}
            {gender === 'female' ? (
              <>
                {/* Double magenta space buns hair */}
                <circle cx="62" cy="58" r="16" fill="#EC4899" />
                <circle cx="138" cy="58" r="16" fill="#EC4899" />
                {/* Hair bangs */}
                <path d="M 60 76 Q 100 58 140 76" fill="#EC4899" />
                <path d="M 58 80 L 50 110" stroke="#EC4899" strokeWidth="6" strokeLinecap="round" />
                <path d="M 142 80 L 150 110" stroke="#EC4899" strokeWidth="6" strokeLinecap="round" />
                {/* Headphone arc over hair */}
                <path d="M 66 68 A 45 45 0 0 1 134 68" fill="none" stroke="#22D3EE" strokeWidth="6" />
                {/* Headphones earcups */}
                <rect x="44" y="78" width="16" height="28" rx="8" fill="#22D3EE" />
                <rect x="140" y="78" width="16" height="28" rx="8" fill="#22D3EE" />
              </>
            ) : gender === 'male' ? (
              <>
                {/* Messy purple dyed hair */}
                <path d="M 52 82 Q 50 48 100 48 Q 150 48 148 82" fill="#8B5CF6" />
                <path d="M 70 54 L 62 40 L 80 50" fill="#6D28D9" />
                <path d="M 100 48 L 102 32 L 115 48" fill="#6D28D9" />
                {/* Headphone arc */}
                <path d="M 64 74 A 42 42 0 0 1 136 74" fill="none" stroke="#EC4899" strokeWidth="6" />
                {/* Neon Magenta Earcups */}
                <rect x="46" y="80" width="14" height="26" rx="7" fill="#EC4899" />
                <rect x="140" y="80" width="14" height="26" rx="7" fill="#EC4899" />
              </>
            ) : (
              <>
                {/* Neutral Shaggy Emerald hairstyle */}
                <path d="M 52 82 Q 44 54 100 50 Q 156 54 148 82" fill="#10B981" />
                <path d="M 85 54 L 88 40 L 98 52" fill="#047857" />
                {/* Glowing cyber headset */}
                <path d="M 64 72 A 44 44 0 0 1 136 72" fill="none" stroke="#FBBF24" strokeWidth="7" />
                <circle cx="50" cy="92" r="11" fill="#FBBF24" />
                <circle cx="150" cy="92" r="11" fill="#FBBF24" />
                {/* Little headset microphone */}
                <path d="M 50 98 Q 65 110 80 110" fill="none" stroke="#FBBF24" strokeWidth="3" strokeLinecap="round" />
              </>
            )}
          </g>
        );

      case 'adult':
        return (
          <g>
            {/* Adult Face */}
            <circle cx="100" cy="100" r="45" fill="#FDBA74" />
            <path d="M 88 112 Q 100 124 112 112" stroke="#C2410C" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            
            {/* Intentional and Smart Eyes with modern Glasses */}
            <motion.ellipse cx="80" cy="88" rx="4" ry="5" fill="#1E293B" animate="blink" variants={eyeVariants} />
            <motion.ellipse cx="120" cy="88" rx="4" ry="5" fill="#1E293B" animate="blink" variants={eyeVariants} />

            {/* Smart Eye Glasses */}
            <rect x="68" y="78" width="24" height="20" rx="4" fill="none" stroke="#1E293B" strokeWidth="3" />
            <rect x="108" y="78" width="24" height="20" rx="4" fill="none" stroke="#1E293B" strokeWidth="3" />
            <line x1="92" y1="88" x2="108" y2="88" stroke="#1E293B" strokeWidth="3.5" />

            {/* Hairstyles & Grooming */}
            {gender === 'female' ? (
              <>
                {/* Sophisticated Brunette High Bun hairstyle */}
                <path d="M 52 82 Q 48 58 100 58 Q 152 58 148 82" fill="#78350F" />
                <circle cx="100" cy="46" r="18" fill="#78350F" />
                {/* Strands framing the face */}
                <path d="M 52 84 Q 44 95 44 110" stroke="#78350F" strokeWidth="6" strokeLinecap="round" fill="none" />
                <path d="M 148 84 Q 156 95 156 110" stroke="#78350F" strokeWidth="6" strokeLinecap="round" fill="none" />
              </>
            ) : gender === 'male' ? (
              <>
                {/* Slicked back classy dark beard */}
                <path d="M 55 80 L 52 70 Q 100 54 148 70 L 145 80" fill="#1E293B" />
                {/* Cultivated stubble beard */}
                <path d="M 58 104 C 58 135 142 135 142 104 C 142 120 58 120 58 104" fill="#334155" opacity="0.8" />
              </>
            ) : (
              <>
                {/* Modern Teal Shorthair asymmetrical cut */}
                <path d="M 52 80 C 42 42 125 40 148 75 C 148 75 142 98 130 92 C 112 85 90 98 52 80" fill="#0F766E" />
              </>
            )}
          </g>
        );

      case 'senior':
        return (
          <g>
            {/* Senior Face */}
            <circle cx="100" cy="100" r="45" fill="#FFD8A8" />
            <path d="M 88 112 Q 100 120 112 112" stroke="#E65100" strokeWidth="3" fill="none" strokeLinecap="round" />
            
            {/* Cozy, peaceful reading eyes */}
            <motion.ellipse cx="80" cy="90" rx="3.5" ry="4.5" fill="#1E293B" animate="blink" variants={eyeVariants} />
            <motion.ellipse cx="120" cy="90" rx="3.5" ry="4.5" fill="#1E293B" animate="blink" variants={eyeVariants} />
            
            {/* Cute forehead lines indicating wisdom */}
            <path d="M 85 64 Q 100 60 115 64" stroke="#9A3412" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.5" />
            <path d="M 88 70 Q 100 66 112 70" stroke="#9A3412" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.5" />

            {/* Gold Wire-framed spectacles */}
            <circle cx="80" cy="90" r="13" fill="none" stroke="#D97706" strokeWidth="2.5" />
            <circle cx="120" cy="90" r="13" fill="none" stroke="#D97706" strokeWidth="2.5" />
            <line x1="93" y1="90" x2="107" y2="90" stroke="#D97706" strokeWidth="2.5" />

            {/* Grandparent gray hair */}
            {gender === 'female' ? (
              <>
                {/* Grey bun */}
                <circle cx="100" cy="45" r="15" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="2" />
                <path d="M 52 84 Q 46 64 100 64 Q 154 64 148 84" fill="#E2E8F0" />
                {/* Strands */}
                <path d="M 52 86 C 48 95 48 105 48 105" stroke="#CBD5E1" strokeWidth="5" strokeLinecap="round" fill="none" />
                <path d="M 148 86 C 152 95 152 105 152 105" stroke="#CBD5E1" strokeWidth="5" strokeLinecap="round" fill="none" />
              </>
            ) : gender === 'male' ? (
              <>
                {/* Grey fringe, bald on top option or neat hair style */}
                <path d="M 52 88 Q 44 65 65 65 Q 80 85 100 85 Q 120 85 135 65 Q 156 65 148 88" fill="#F1F5F9" stroke="#E2E8F0" strokeWidth="2" />
                {/* silver-grey Grandpa Mustache */}
                <path d="M 82 104 Q 100 100 118 104 Q 100 108 82 104" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="1" />
              </>
            ) : (
              <>
                {/* Wise fluffy silver waves */}
                <path d="M 50 82 C 35 68 50 48 70 54 C 80 44 120 44 130 54 C 150 48 165 68 150 82" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="2" />
              </>
            )}
          </g>
        );
    }
  };

  return (
    <div className="relative flex items-center justify-center w-full max-w-[210px] aspect-square mx-auto">
      {/* Background Orbiting Glowing Rings */}
      <motion.div
        className={`absolute inset-4 rounded-full bg-gradient-to-tr ${palette.bgGlow} filter blur-xl opacity-80`}
        animate={{ scale: [0.94, 1.06, 0.94] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
      
      {/* Interactive Rotating Aura Ring */}
      <motion.svg
        className="absolute w-full h-full text-white/5"
        viewBox="0 0 200 200"
        animate={ringRotation}
      >
        <circle
          cx="100"
          cy="100"
          r="86"
          fill="none"
          stroke="url(#aura-gradient)"
          strokeWidth="1.5"
          strokeDasharray="14 10 4 10"
        />
        <defs>
          <linearGradient id="aura-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={palette.primary} stopOpacity="0.6" />
            <stop offset="100%" stopColor={palette.secondary} stopOpacity="0.1" />
          </linearGradient>
        </defs>
      </motion.svg>

      {/* Main Avatar Canvas Container */}
      <motion.div
        className="relative z-10 w-full h-full flex items-center justify-center p-3 rounded-2xl glass-card border border-white/10"
        animate={avatarFloating}
        whileHover={{ scale: 1.05 }}
      >
        <svg
          id="avatar-svg-canvas"
          viewBox="0 0 200 200"
          className="w-full h-full drop-shadow-[0_10px_15px_rgba(0,0,0,0.35)]"
        >
          {/* Avatar Base Ring Background */}
          <circle cx="100" cy="100" r="70" fill="rgba(15, 23, 42, 0.4)" stroke="rgba(255,255,255,0.06)" strokeWidth="2" />
          
          {/* Render Customized SVG Vector elements */}
          {renderVector()}

          {/* Accent lighting reflections on glass border */}
          <path
            d="M 52 52 A 68 68 0 0 1 148 52"
            fill="none"
            stroke="rgba(255, 255, 255, 0.25)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </svg>
      </motion.div>
    </div>
  );
}
