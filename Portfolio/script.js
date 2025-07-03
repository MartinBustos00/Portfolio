// DOM Elements
const loadingScreen = document.getElementById("loadingScreen")
const musicControl = document.getElementById("musicControl")
let bgMusic = document.getElementById("bgMusic")
const hamburger = document.getElementById("hamburger")
const navMenu = document.getElementById("navMenu")
const navLinks = document.querySelectorAll(".nav-link")
const sections = document.querySelectorAll(".section")
const homeButtons = document.querySelectorAll("[data-target]")
const contactForm = document.getElementById("contactForm")

// State
let currentSection = "home"
let musicPlaying = false

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  // Hide loading screen after 2.5 seconds
  setTimeout(() => {
    loadingScreen.style.opacity = "0"
    setTimeout(() => {
      loadingScreen.style.display = "none"
    }, 500)
  }, 2000)

  // Initialize music
  bgMusic.volume = 0.1

  // Set initial active states
  updateActiveStates()

  // Add scroll animations
  addScrollAnimations()
})

// Music Control con mejor manejo de errores
musicControl.addEventListener("click", () => {
  if (musicPlaying) {
    bgMusic.pause()
    musicControl.classList.add("paused")
    musicControl.innerHTML = '<span class="music-icon">🔇</span>'
    musicPlaying = false
  } else {
    // Intenta reproducir la música
    const playPromise = bgMusic.play()

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          musicControl.classList.remove("paused")
          musicControl.innerHTML = '<span class="music-icon">🎵</span>'
          musicPlaying = true
        })
        .catch((error) => {
          console.log("Error al reproducir audio:", error)
          // Fallback: usar un audio alternativo
          loadFallbackAudio()
        })
    }
  }
})

// Función para cargar audio alternativo
function loadFallbackAudio() {
  // Crear un audio alternativo con un sonido simple
  const fallbackAudio = new Audio()
  fallbackAudio.src =
    "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT"
  fallbackAudio.loop = true
  fallbackAudio.volume = 0.1

  fallbackAudio
    .play()
    .then(() => {
      bgMusic = fallbackAudio
      musicControl.classList.remove("paused")
      musicControl.innerHTML = '<span class="music-icon">🎵</span>'
      musicPlaying = true
      showMusicMessage("Reproduciendo audio alternativo")
    })
    .catch(() => {
      showMusicMessage("No se pudo reproducir audio")
    })
}

// Detectar errores de carga del audio
bgMusic.addEventListener("error", (e) => {
  console.log("Error cargando audio:", e)
  showMusicMessage("Error cargando música, intentando alternativa...")
  loadFallbackAudio()
})

// Detectar cuando el audio se puede reproducir
bgMusic.addEventListener("canplaythrough", () => {
  console.log("Audio listo para reproducir")
})

// Auto-play cuando el usuario interactúa por primera vez
let userInteracted = false
document.addEventListener(
  "click",
  () => {
    if (!userInteracted && !musicPlaying) {
      userInteracted = true
      bgMusic
        .play()
        .then(() => {
          musicControl.classList.remove("paused")
          musicControl.innerHTML = '<span class="music-icon">🎵</span>'
          musicPlaying = true
        })
        .catch(() => {
          // Silenciosamente falla si no se puede reproducir
        })
    }
  },
  { once: true },
)

// Función para mostrar mensajes de música
function showMusicMessage(message) {
  const messageDiv = document.createElement("div")
  messageDiv.textContent = message
  messageDiv.style.cssText = `
    position: fixed;
    top: 80px;
    right: 20px;
    background: var(--primary-red);
    color: white;
    padding: 10px 15px;
    border-radius: 5px;
    font-size: 0.9rem;
    z-index: 1001;
    animation: fadeInOut 3s ease forwards;
  `
  document.body.appendChild(messageDiv)

  setTimeout(() => {
    messageDiv.remove()
  }, 3000)
}

// Mobile Navigation
hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active")
  navMenu.classList.toggle("active")
})

// Navigation
navLinks.forEach((link) => {
  link.addEventListener("click", function (e) {
    e.preventDefault()
    const targetSection = this.getAttribute("data-section")
    navigateToSection(targetSection)

    // Close mobile menu
    hamburger.classList.remove("active")
    navMenu.classList.remove("active")
  })
})

// Home buttons navigation
homeButtons.forEach((button) => {
  button.addEventListener("click", function () {
    const targetSection = this.getAttribute("data-target")
    navigateToSection(targetSection)
  })
})

// Navigation function
function navigateToSection(sectionId) {
  // Hide all sections
  sections.forEach((section) => {
    section.classList.remove("active")
  })

  // Show target section
  const targetSection = document.getElementById(sectionId)
  if (targetSection) {
    targetSection.classList.add("active")
    currentSection = sectionId
    updateActiveStates()

    // Add entrance animation
    setTimeout(() => {
      const elements = targetSection.querySelectorAll(".animate-on-enter")
      elements.forEach((el, index) => {
        setTimeout(() => {
          el.classList.add("animate-fade-in-up")
        }, index * 100)
      })
    }, 100)
  }
}

// Update active states
function updateActiveStates() {
  navLinks.forEach((link) => {
    link.classList.remove("active")
    if (link.getAttribute("data-section") === currentSection) {
      link.classList.add("active")
    }
  })
}

// Scroll animations
function addScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-fade-in-up")
      }
    })
  }, observerOptions)

  // Observe elements for animation
  const animateElements = document.querySelectorAll(".skill-card, .project-card, .text-block, .stat-item")
  animateElements.forEach((el) => {
    observer.observe(el)
  })
}

// Contact form
contactForm.addEventListener("submit", function (e) {
  e.preventDefault()

  // Get form data
  const formData = new FormData(this)
  const name = formData.get("name")
  const email = formData.get("email")
  const message = formData.get("message")

  // Simulate form submission
  const submitBtn = this.querySelector('button[type="submit"]')
  const originalText = submitBtn.textContent

  submitBtn.textContent = "SENDING..."
  submitBtn.disabled = true

  setTimeout(() => {
    submitBtn.textContent = "MESSAGE SENT!"
    submitBtn.style.background = "#00ff00"

    setTimeout(() => {
      submitBtn.textContent = originalText
      submitBtn.style.background = ""
      submitBtn.disabled = false
      this.reset()
    }, 2000)
  }, 1500)
})

// Skill level animations
function animateSkillLevels() {
  const skillCards = document.querySelectorAll(".skill-card")

  skillCards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      const levelFill = this.querySelector(".level-fill")
      const currentWidth = levelFill.style.width
      levelFill.style.width = "0%"

      setTimeout(() => {
        levelFill.style.width = currentWidth
      }, 100)
    })
  })
}

// Initialize skill animations
animateSkillLevels()

// Keyboard navigation
document.addEventListener("keydown", (e) => {
  const sectionIds = ["home", "about", "skills", "projects", "contact"]
  const currentIndex = sectionIds.indexOf(currentSection)

  if (e.key === "ArrowRight" || e.key === "ArrowDown") {
    e.preventDefault()
    const nextIndex = (currentIndex + 1) % sectionIds.length
    navigateToSection(sectionIds[nextIndex])
  } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
    e.preventDefault()
    const prevIndex = (currentIndex - 1 + sectionIds.length) % sectionIds.length
    navigateToSection(sectionIds[prevIndex])
  } else if (e.key === "Escape") {
    navigateToSection("home")
  }
})

// Project card interactions
document.querySelectorAll(".project-card").forEach((card) => {
  card.addEventListener("click", function () {
    this.style.transform = "scale(0.95)"
    setTimeout(() => {
      this.style.transform = ""
    }, 150)
  })
})

// Persona card rotation on scroll
window.addEventListener("scroll", () => {
  const personaCard = document.querySelector(".persona-card")
  if (personaCard) {
    const scrolled = window.pageYOffset
    const rate = scrolled * -0.5
    personaCard.style.transform = `rotateY(${rate}deg)`
  }
})

// Dynamic background particles (optional enhancement)
function createParticles() {
  const particleContainer = document.createElement("div")
  particleContainer.className = "particles"
  particleContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -1;
    `

  document.body.appendChild(particleContainer)

  for (let i = 0; i < 50; i++) {
    const particle = document.createElement("div")
    particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: var(--primary-red);
            border-radius: 50%;
            opacity: 0.3;
            animation: float ${Math.random() * 10 + 5}s infinite linear;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
        `
    particleContainer.appendChild(particle)
  }
}

// Add particle animation CSS
const particleStyle = document.createElement("style")
particleStyle.textContent = `
    @keyframes float {
        0% { transform: translateY(0px) rotate(0deg); opacity: 0; }
        10% { opacity: 0.3; }
        90% { opacity: 0.3; }
        100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
    }
`
document.head.appendChild(particleStyle)

// Initialize particles
createParticles()

// Console easter egg
console.log(
  `
%c
██████╗ ███████╗██████╗ ███████╗ ██████╗ ███╗   ██╗ █████╗     ███████╗
██╔══██╗██╔════╝██╔══██╗██╔════╝██╔═══██╗████╗  ██║██╔══██╗    ██╔════╝
██████╔╝█████╗  ██████╔╝███████╗██║   ██║██╔██╗ ██║███████║    ███████╗
██╔═══╝ ██╔══╝  ██╔══██╗╚════██║██║   ██║██║╚██╗██║██╔══██║    ╚════██║
██║     ███████╗██║  ██║███████║╚██████╔╝██║ ╚████║██║  ██║    ███████║
╚═╝     ╚══════╝╚═╝  ╚═╝╚══════╝ ╚═════╝ ╚═╝  ╚═══╝╚═╝  ╚═╝    ╚══════╝

Welcome to my Persona 5 inspired portfolio!
Looking for the source code? Check out the developer tools!
`,
  "color: #ff0040; font-family: monospace;",
)
