// Three.js background animation for the portfolio
// Creates an immersive 3D background with particles and effects

class ThreeJSBackground {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.particles = null;
        this.mouseX = 0;
        this.mouseY = 0;
        
        this.init();
    }
    
    init() {
        // Create scene
        this.scene = new THREE.Scene();
        
        // Create camera
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = 5;
        
        // Create renderer
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: document.getElementById('threejs-bg'),
            alpha: true,
            antialias: true 
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        // Create particles
        this.createParticles();
        
        // Add lights
        this.addLights();
        
        // Handle window resize
        this.handleResize();
        
        // Handle mouse movement
        this.handleMouseMove();
        
        // Start animation
        this.animate();
    }
    
    createParticles() {
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 5000;
        
        const posArray = new Float32Array(particlesCount * 3);
        const colorArray = new Float32Array(particlesCount * 3);
        
        // Color palette
        const colors = [
            new THREE.Color(0x00ffff), // Cyan
            new THREE.Color(0x9b5cff), // Violet
            new THREE.Color(0xffffff)  // White
        ];
        
        for (let i = 0; i < particlesCount * 3; i++) {
            // Position
            posArray[i] = (Math.random() - 0.5) * 20;
            
            // Color - alternate between colors
            const colorIndex = Math.floor(i / particlesCount) % colors.length;
            const color = colors[colorIndex];
            colorArray[i * 3] = color.r;
            colorArray[i * 3 + 1] = color.g;
            colorArray[i * 3 + 2] = color.b;
        }
        
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
        
        // Particle material
        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.02,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });
        
        // Create particles system
        this.particles = new THREE.Points(particlesGeometry, particlesMaterial);
        this.scene.add(this.particles);
    }
    
    addLights() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x00ffff, 0.1);
        this.scene.add(ambientLight);
        
        // Point lights for glow effects
        const pointLight1 = new THREE.PointLight(0x00ffff, 0.5, 10);
        pointLight1.position.set(2, 2, 2);
        this.scene.add(pointLight1);
        
        const pointLight2 = new THREE.PointLight(0x9b5cff, 0.3, 10);
        pointLight2.position.set(-2, -1, 3);
        this.scene.add(pointLight2);
    }
    
    handleResize() {
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }
    
    handleMouseMove() {
        document.addEventListener('mousemove', (event) => {
            this.mouseX = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
        });
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        // Rotate particles
        if (this.particles) {
            this.particles.rotation.x += 0.0005;
            this.particles.rotation.y += 0.001;
            
            // Mouse interaction
            this.particles.rotation.y += this.mouseX * 0.0005;
            this.particles.rotation.x += this.mouseY * 0.0005;
            
            // Pulsing effect
            const time = Date.now() * 0.001;
            this.particles.scale.setScalar(1 + Math.sin(time) * 0.1);
        }
        
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize Three.js background when the page loads
document.addEventListener('DOMContentLoaded', () => {
    try {
        new ThreeJSBackground();
    } catch (error) {
        console.log('Three.js background failed to load:', error);
        // Fallback to CSS animations
        document.getElementById('threejs-bg').style.display = 'none';
    }
});