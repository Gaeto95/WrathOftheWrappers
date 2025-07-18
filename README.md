# ⚔️ Wrath of the Wrappers
Complete Survival Action RPG - Built for Web

⚡ Bolt, please don't take this the wrong way. I love Bolt.
This project was built entirely with it — any resemblance to real platforms, judges, or AI entities is purely coincidental. 😉

**🎮 [Try the Live Demo](https://wrathofthewrappers.netlify.app)**

![Game Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Tech Stack](https://img.shields.io/badge/Tech-React%20%7C%20TypeScript%20%7C%20Canvas-blue)

## 🎮 Game Overview

**Wrath of the Wrappers** is a fast-paced survival action RPG where players control a skilled bolter to survive endless waves of enemies while collecting gold and upgrading their abilities. Built entirely in the browser using modern web technologies with beautiful sprite animations.

### 🎯 Core Gameplay Loop
1. **Survive** - Navigate through endless enemy waves using WASD controls
2. **Combat** - Auto-targeting projectile system with piercing bolts
3. **Collect** - Gather gold and health potions from defeated enemies
4. **Upgrade** - Spend gold on permanent character improvements
5. **Progress** - Face increasingly challenging enemies and survive longer

## ✨ Key Features

### 🎮 Gameplay Mechanics
- **Fluid Movement System** - Smooth WASD controls with diagonal movement normalization
- **Auto-Combat System** - Intelligent targeting that automatically shoots at nearest enemies
- **Progressive Difficulty** - Dynamic enemy spawning and health scaling over time
- **Persistent Progression** - Gold and upgrades carry over between runs
- **Multiple Enemy Types** - Grunts, Runners, and Tanks with unique behaviors
- **Visual Feedback** - Screen shake, particle effects, and damage flashing
- **Animated Bolter Sprites** - 9 different animations with 10 frames each

### 🏹 Bolter Character System
- **Professional Sprite Animations** - High-quality 64x64 pixel art sprites
- **9 Animation States**: Idle, Running, Jumping, Normal Attack, Low Attack, High Attack, Crouch, Dash, Death
- **Dynamic Animation Speed** - Attack animations scale with fire rate upgrades
- **Direction-Based Sprites** - Character flips based on movement direction
- **Smooth Frame Cycling** - 10 frames per animation for fluid movement

### 🛡️ Player Systems
- **Health Management** - Take damage from enemy contact with invincibility frames
- **Upgrade Tree** - Five distinct upgrade paths for different playstyles
- **Gold Economy** - Earn currency from enemy kills with bonus multipliers
- **High Score Tracking** - Local leaderboard system with best survival times
- **Profile System** - Multiple character profiles with individual progress

### 👾 Enemy Variety
| Enemy Type | Health | Speed | Damage | Behavior | Gold Drop |
|------------|--------|-------|--------|----------|-----------|
| **Grunt** | 20 HP | Medium | 10 DMG | Balanced approach | 10-20 Gold |
| **Runner** | 10 HP | Fast | 5 DMG | Quick, aggressive | 5-15 Gold |
| **Tank** | 50 HP | Slow | 20 DMG | High damage, tanky | 20-30 Gold |

### 💰 Upgrade System
| Upgrade | Effect | Base Cost | Scaling |
|---------|--------|-----------|---------|
| **Damage** | +10 damage per level | 50 Gold | Exponential |
| **Speed** | +5% movement speed | 30 Gold | Exponential |
| **Health** | +20 max HP | 40 Gold | Exponential |
| **Fire Rate** | -0.05s attack cooldown | 60 Gold | Exponential |
| **Gold Bonus** | +20% gold drops | 100 Gold | Exponential |

## 🏹 Bolter Class Features

### 🎯 Combat Abilities
- **Piercing Bolts** - Projectiles pass through multiple enemies
- **High Mobility** - 20% increased movement speed
- **Rapid Fire** - 40% faster attack rate than base
- **Eagle Eye** - Increased projectile speed and range

### 📊 Base Stats
- **Health**: 80 HP (20% less than base for balance)
- **Speed**: 240 pixels/second (20% faster than base)
- **Damage**: 25 base damage (normal damage)
- **Fire Rate**: 0.3 seconds (40% faster than base)

## 🎨 Visual Design

### 🎭 Art Style
- **Professional Pixel Art** - High-quality 64x64 sprite animations
- **Neon Cyberpunk Aesthetic** - Glowing effects and vibrant colors
- **Minimalist Geometry** - Clean shapes with strategic visual complexity
- **Dynamic Lighting** - Radial gradients and glow effects for all game objects
- **Particle Systems** - Impact feedback and collection animations

### 🎨 Color Palette
```css
Player: #4dabf7 (Bright Blue)
Enemies: #ff6b6b, #ff8787, #ff5252 (Red Variants)
Projectiles: #22c55e (Green Bolts)
Gold: #ffd93d (Golden Yellow)
Health: #51cf66 (Vibrant Green)
UI: #ffffff on rgba(0,0,0,0.7) (High Contrast)
```

## 🛠️ Technical Implementation

### 🏗️ Architecture
```
src/
├── components/          # React UI Components
│   ├── Canvas.tsx      # Main game rendering with sprite animation
│   ├── Game.tsx        # Game state management
│   ├── UI.tsx          # HUD and interface
│   └── ProfileSelector.tsx # Character profile management
├── hooks/              # Custom React Hooks
│   ├── useGameLoop.ts  # Main game loop logic
│   ├── useInput.ts     # Keyboard input handling
│   └── useProfileSystem.ts # Profile persistence
├── utils/              # Core Game Logic
│   ├── gameLogic.ts    # Game state and mechanics
│   ├── collision.ts    # Collision detection
│   └── constants.ts    # Game configuration
├── types/              # TypeScript Definitions
│   ├── classes.ts      # Character class definitions
│   └── profile.ts      # Profile system types
└── App.tsx            # Application Entry Point
```

### ⚡ Performance Features
- **60fps Game Loop** - Smooth requestAnimationFrame rendering
- **Object Pooling** - Efficient particle and projectile management
- **Collision Optimization** - Spatial partitioning for large enemy counts
- **Canvas Rendering** - Hardware-accelerated 2D graphics
- **Sprite Caching** - Efficient image loading and reuse

## 🚀 Getting Started

### 📋 Prerequisites
- Node.js 18+ and npm
- Modern web browser with Canvas support
- Keyboard for input (WASD + ESC)

### 🔧 Installation
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### 🎮 Controls
| Key | Action |
|-----|--------|
| **W/↑** | Move Up |
| **A/←** | Move Left |
| **S/↓** | Move Down |
| **D/→** | Move Right |
| **ESC** | Pause/Resume |
| **Auto** | Attack (Automatic) |

### 🎵 Adding Assets
Place these files in the `public/` folder:

#### Required Sprite Files:
- `Idle.png` - Idle animation (10 frames in 2x5 grid)
- `Running.png` - Running animation (10 frames in 2x5 grid)
- `Jumping.png` - Jumping animation (10 frames in 2x5 grid)
- `Normal Attack.png` - Normal attack animation (10 frames in 2x5 grid)
- `Low attack.png` - Low attack animation (10 frames in 2x5 grid)
- `High Attack.png` - High attack animation (10 frames in 2x5 grid)
- `crouch.png` - Crouch animation (10 frames in 2x5 grid)
- `Dash.png` - Dash animation (10 frames in 2x5 grid)
- `death.png` - Death animation (10 frames in 2x5 grid)

#### Optional Assets:
- `coin.png` - Gold coin sprite
- `potion.png` - Health potion sprite
- `big-monster.png` - Large enemy sprite (for Tank enemies)
- `small-monster.png` - Small enemy sprite (for Grunt and Runner enemies)
- `background-music.mp3` - Background music

## 🎯 Game Balance

### 📈 Difficulty Scaling
- **Spawn Rate Increase** - 30% faster enemy spawning every 15 seconds
- **Health Scaling** - 50% more enemy HP every 45 seconds
- **Progressive Challenge** - Maintains engagement without overwhelming players

### ⚖️ Economy Balance
- **Gold Drop Rates** - 80% chance from enemies, 10% health potion chance
- **Upgrade Costs** - Exponential scaling prevents overpowered builds
- **Risk/Reward** - Higher difficulty enemies drop more valuable rewards

## 🏆 Achievements & Milestones

### 🎯 Survival Milestones
- **Novice Survivor** - Survive 30 seconds
- **Veteran Fighter** - Survive 60 seconds  
- **Elite Warrior** - Survive 120 seconds
- **Legendary Hero** - Survive 300 seconds
- **Wrapper Master** - Survive 600 seconds

### 💰 Economic Goals
- **First Fortune** - Earn 1,000 total gold
- **Wealthy Warrior** - Earn 10,000 total gold
- **Gold Magnate** - Earn 100,000 total gold

## 🔮 Future Enhancements

### 🎮 Gameplay Features
- **Additional Character Classes** - Wizard, Warrior, Rogue with unique sprites
- **Boss Battles** - Epic encounters with unique mechanics
- **Power-ups** - Temporary abilities and weapon modifications
- **Multiple Arenas** - Different environments with unique challenges
- **Weapon Variety** - Unlockable weapon types with distinct behaviors

### 🌐 Social Features
- **Global Leaderboards** - Compete with players worldwide
- **Achievement System** - Unlock badges and titles
- **Replay System** - Share and analyze best runs
- **Daily Challenges** - Special game modes with unique rewards

## 📊 Technical Specifications

### 🎯 Performance Targets
- **Frame Rate** - Consistent 60fps on modern browsers
- **Memory Usage** - <100MB RAM consumption
- **Load Time** - <3 seconds initial load
- **Responsiveness** - <16ms input latency

### 🌐 Browser Compatibility
- **Chrome** - 90+ (Recommended)
- **Firefox** - 88+
- **Safari** - 14+
- **Edge** - 90+

## 🎨 Sprite Animation System

### 📐 Sprite Specifications
- **Frame Size** - 64x64 pixels per frame
- **Layout** - 2x5 grid (2 rows, 5 frames per row)
- **Total Frames** - 10 frames per animation
- **File Format** - PNG with transparency

### ⚡ Animation Features
- **Dynamic Speed** - Attack animations scale with fire rate
- **Direction Flipping** - Sprites flip horizontally for left movement
- **Smooth Cycling** - Seamless frame transitions
- **Fallback System** - Colored rectangles if sprites fail to load

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines for:
- Code style and conventions
- Testing requirements
- Pull request process
- Issue reporting

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ for Bolt**
