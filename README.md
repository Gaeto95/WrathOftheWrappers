# ⚔️ Wrath of the Wrappers
Complete Survival Action RPG - Built for Web

⚡ Bolt, please don't take this the wrong way. I love Bolt.
This project was built entirely with it — any resemblance to real platforms, judges, or AI entities is purely coincidental. 😉

**🎮 [Try the Live Demo](https://wrathofthewrappers.netlify.app)**

![Game Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Tech Stack](https://img.shields.io/badge/Tech-React%20%7C%20TypeScript%20%7C%20Canvas-blue)
![License](https://img.shields.io/badge/License-MIT-green)
![Open Source](https://img.shields.io/badge/Open%20Source-❤️-red)

## 🎮 Game Overview

**Wrath of the Wrappers** is a fast-paced survival action RPG where players control a skilled Bolter to survive endless waves of enemies while collecting gold and upgrading their abilities. Built entirely in the browser using bolt.new, with beautiful sprite animations and a polished upgrade system.

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
- **Multi-Shot System** - Cone-shaped projectile spread for area coverage
- **Progressive Difficulty** - Dynamic enemy spawning and health scaling over time
- **Persistent Progression** - Gold and upgrades carry over between runs
- **Multiple Enemy Types** - Grunts, Runners, and Tanks with unique behaviors
- **Visual Feedback** - Screen shake, particle effects, and damage flashing
- **Animated Bolter Sprites** - 9 different animations with 8 frames each
- **Background Texture Selection** - Choose from multiple tiled environments during gameplay

### 🏹 Bolter Character System
- **Professional Sprite Animations** - High-quality 64x64 pixel art sprites
- **9 Animation States**: Idle, Running, Jumping, Normal Attack, Low Attack, High Attack, Crouch, Dash, Death
- **Dynamic Animation Speed** - Attack animations scale with fire rate upgrades
- **Direction-Based Sprites** - Character flips based on movement direction
- **Smooth Frame Cycling** - 8 frames per animation for fluid movement

### 🛡️ Player Systems
- **Health Management** - Take damage from enemy contact with invincibility frames
- **Upgrade Tree** - Five distinct upgrade paths for different playstyles
- **Gold Economy** - Earn currency from enemy kills with bonus multipliers
- **High Score Tracking** - Local storage system with best survival times
- **Skill System** - Random skill drops with passive abilities

### 👾 Enemy Variety
| Enemy Type | Health | Speed | Damage | Behavior | Gold Drop |
|------------|--------|-------|--------|----------|-----------|
| **Grunt** | 25 HP | Medium | 15 DMG | Balanced approach | 15-25 Gold |
| **Runner** | 12 HP | Fast | 8 DMG | Quick, aggressive | 8-18 Gold |
| **Tank** | 60 HP | Slow | 25 DMG | High damage, tanky | 30-45 Gold |
| **Heavy Tank** | 120 HP | Fast | 35 DMG | Elite tank variant | 60-90 Gold |
| **Boss** | 300 HP | Very Slow | 40 DMG | Massive threat | 150-225 Gold |

### 💰 Upgrade System
| Upgrade | Effect | Base Cost | Scaling |
|---------|--------|-----------|---------|
| **Damage** | +15% damage per level | 100 Gold | Exponential |
| **Speed** | +8% movement speed | 80 Gold | Exponential |
| **Health** | +25% max HP | 120 Gold | Exponential |
| **Fire Rate** | -8% attack cooldown | 150 Gold | Exponential |
| **Gold Bonus** | +25% gold drops | 200 Gold | Exponential |

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

### 🎯 Passive Skills System
Random skill drops enhance gameplay:
- **Critical Strike** - Chance to deal double damage
- **Gold Magnet** - Increased pickup radius for items
- **Explosive Impact** - Projectiles explode on impact
- **Multi Shot** - Fire additional projectiles in a cone pattern
- **Battle Frenzy** - Flat fire rate reduction (0.5% per level)

## 🎨 Visual Design

### 🌍 Environment System
- **Multiple Backgrounds** - Desert, Grassland, Stone, and Grid patterns
- **Infinite Tiling** - 64x64 seamless texture tiles that work at any zoom level
- **Real-time Switching** - Change backgrounds during gameplay
- **Phase-Compatible** - Textures remain consistent during screen scaling phases

### 🎭 Art Style
- **Professional Pixel Art** - High-quality 64x64 sprite animations
- **Neon Cyberpunk Aesthetic** - Glowing effects and vibrant colors
- **Dynamic Background Textures** - Multiple tileable environments (Desert, Grassland, Stone)
- **Minimalist Geometry** - Clean shapes with strategic visual complexity
- **Dynamic Lighting** - Radial gradients and glow effects for all game objects
- **Particle Systems** - Impact feedback and collection animations
- **Monster Sprites** - Custom sprites for different enemy types with directional facing

### 🎨 Color Palette
```css
Player: #4dabf7 (Bright Blue)
Enemies: #ff6b6b, #ff8787, #ff5252, #cc0000, #800080 (Red to Purple Variants)
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
│   ├── BolterMenu.tsx  # Main menu with beautiful animations
│   ├── LoadingScreen.tsx # Animated loading screen
│   └── EnhancedUpgradeScreen.tsx # Upgrade interface
├── hooks/              # Custom React Hooks
│   ├── useGameLoop.ts  # Main game loop logic
│   ├── useInput.ts     # Keyboard input handling
│   └── useBolterSystem.ts # Bolter data persistence
├── utils/              # Core Game Logic
│   ├── gameLogic.ts    # Game state and mechanics
│   ├── collision.ts    # Collision detection
│   ├── skillSystem.ts  # Passive skill management
│   └── constants.ts    # Game configuration
├── types/              # TypeScript Definitions
│   ├── classes.ts      # Bolter class definitions
│   └── bolter.ts       # Bolter system types
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
# Clone the repository
git clone https://github.com/yourusername/wrath-of-the-wrappers.git
cd wrath-of-the-wrappers

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
| **C** | Accept Skill Drop |
| **V** | Reject Skill Drop |
| **Auto** | Attack (Automatic) |

### 🎵 Adding Assets
Place these files in the `public/` folder:

#### Required Sprite Files:
- `Idle.png` - Idle animation (8 frames horizontally)
- `Running.png` - Running animation (8 frames horizontally)
- `Jumping.png` - Jumping animation (8 frames horizontally)
- `Normal Attack.png` - Normal attack animation (8 frames in top row)
- `Low attack.png` - Low attack animation (8 frames horizontally)
- `High Attack.png` - High attack animation (8 frames horizontally)
- `crouch.png` - Crouch animation (8 frames horizontally)
- `Dash.png` - Dash animation (8 frames horizontally)
- `death.png` - Death animation (8 frames horizontally)

#### Optional Assets:
- `coin.png` - Gold coin sprite
- `potion.png` - Health potion sprite
- `big-monster.png` - Large enemy sprite (for Tank enemies)
- `small-monster.png` - Small enemy sprite (for Grunt and Runner enemies)
- `heavy-tank-monster.png` - Elite heavy tank sprite
- `boss-monster.png` - Boss enemy sprite
- `background-music.mp3` - Background music

## 🎯 Game Balance

### 📈 Difficulty Scaling
- **Spawn Rate Increase** - 35% faster enemy spawning every 15 seconds
- **Health Scaling** - 40% more enemy HP every 60 seconds
- **Elite Enemies** - Heavy Tanks spawn 5% of the time with double health and speed
- **Boss Encounters** - Massive bosses spawn every 60 seconds
- **Progressive Challenge** - Maintains engagement without overwhelming players

### ⚖️ Economy Balance
- **Gold Drop Rates** - 80% chance from enemies, 10% health potion chance
- **Upgrade Costs** - Exponential scaling prevents overpowered builds
- **Risk/Reward** - Higher difficulty enemies drop more valuable rewards
- **Elite Rewards** - Heavy Tanks and Bosses provide significantly more gold
- **Spawn Distribution** - 95% normal enemies, 5% Heavy Tanks for balanced challenge

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
- **Layout** - 8 frames horizontally for most animations
- **Total Frames** - 8 frames per animation
- **File Format** - PNG with transparency

### ⚡ Animation Features
- **Dynamic Speed** - Attack animations scale with fire rate
- **Direction Flipping** - Sprites flip horizontally for left movement
- **Smooth Cycling** - Seamless frame transitions
- **Fallback System** - Colored rectangles if sprites fail to load

## 🎮 Skill System

### 🎯 Passive Skills
- **Random Drops** - Skills drop with 8% base chance after enemy kills (increased for better progression)
- **Level Progression** - Skills can be upgraded up to level 10
- **Inventory Management** - Up to 5 skills can be equipped
- **Keyboard Shortcuts** - C to accept, V to reject skill drops

### 💫 Available Skills
- **Critical Strike** (Epic) - Chance to deal double damage
- **Gold Magnet** (Common) - Increased item pickup radius
- **Explosive Impact** (Legendary) - Projectiles explode on impact
- **Multi Shot** (Rare) - Fire additional projectiles in a cone pattern
- **Battle Frenzy** (Rare) - Flat fire rate reduction

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### 🐛 Bug Reports
- Use the [Issues](https://github.com/gaeto95/wrath-of-the-wrappers/issues) tab
- Include browser version, OS, and steps to reproduce
- Screenshots or videos are helpful

### 💡 Feature Requests
- Check existing issues first
- Describe the feature and its benefits
- Consider implementation complexity

### 🔧 Development Setup
```bash
# Fork the repository
# Clone your fork
git clone https://github.com/yourusername/wrath-of-the-wrappers.git

# Create a feature branch
git checkout -b feature/amazing-feature

# Make your changes
# Test thoroughly
npm run dev

# Commit and push
git commit -m "Add amazing feature"
git push origin feature/amazing-feature

# Create a Pull Request
```

### 📝 Code Style
- Use TypeScript for type safety
- Follow existing naming conventions
- Add comments for complex logic
- Test your changes thoroughly

### 🧪 Testing
- Ensure the game runs smoothly at 60fps
- Test on multiple browsers
- Verify all animations work correctly
- Check for memory leaks during long sessions

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### MIT License Summary
- ✅ Commercial use
- ✅ Modification
- ✅ Distribution
- ✅ Private use
- ❌ Liability
- ❌ Warranty

## 🙏 Acknowledgments

- **Bolt AI** - For making this development process incredibly smooth
- **React Team** - For the amazing framework
- **Vite** - For lightning-fast development
- **Tailwind CSS** - For beautiful styling
- **TypeScript** - For type safety and better DX

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/gaeto95/wrath-of-the-wrappers/issues)
- **Discussions**: [GitHub Discussions](https://github.com/gaeto95/wrath-of-the-wrappers/discussions)
- **Email**: gaeto1992@gmail.com

## 🌟 Star History

If you find this project helpful, please consider giving it a star! ⭐

---

**Built with ❤️ for Bolt**