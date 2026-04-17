function scrollToSection() {
  document.getElementById("services").scrollIntoView({
    behavior: "smooth"
  });
}

window.addEventListener("load", () => {
  const preloader = document.getElementById("preloader");

  const minTime = 1200;

  setTimeout(() => {
    preloader.classList.add("fade-out");

    setTimeout(() => {
      preloader.style.display = "none";
    }, 600);

  }, minTime);
});

const reveals = document.querySelectorAll(".reveal");

function revealOnScroll() {
  reveals.forEach(el => {
    const top = el.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    if (top < windowHeight - 80) {
      el.classList.add("active");
    }
  });
}

window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);

const canvasBg = document.getElementById("bgCanvas");

if (canvasBg) {
  const ctxBg = canvasBg.getContext("2d");

  canvasBg.width = window.innerWidth;
  canvasBg.height = window.innerHeight;

  let particles = [];
  const mouse = { x: null, y: null };

  window.addEventListener("mousemove", (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  });

  window.addEventListener("resize", () => {
    canvasBg.width = window.innerWidth;
    canvasBg.height = window.innerHeight;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * canvasBg.width;
      this.y = Math.random() * canvasBg.height;
      this.size = Math.random() * 2 + 1;
      this.speedX = (Math.random() - 0.5) * 1;
      this.speedY = (Math.random() - 0.5) * 1;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 120) {
        this.x -= dx * 0.02;
        this.y -= dy * 0.02;
      }

      if (this.x < 0 || this.x > canvasBg.width) this.speedX *= -1;
      if (this.y < 0 || this.y > canvasBg.height) this.speedY *= -1;
    }

    draw() {
      ctxBg.fillStyle = "#a855f7";
      ctxBg.beginPath();
      ctxBg.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctxBg.fill();
    }
  }

  function initParticles() {
    particles = [];
    for (let i = 0; i < 100; i++) {
      particles.push(new Particle());
    }
  }

  function connectParticles() {
    for (let a = 0; a < particles.length; a++) {
      for (let b = a; b < particles.length; b++) {
        let dx = particles[a].x - particles[b].x;
        let dy = particles[a].y - particles[b].y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 100) {
          ctxBg.strokeStyle = "rgba(168, 85, 247, 0.2)";
          ctxBg.lineWidth = 1;
          ctxBg.beginPath();
          ctxBg.moveTo(particles[a].x, particles[a].y);
          ctxBg.lineTo(particles[b].x, particles[b].y);
          ctxBg.stroke();
        }
      }
    }
  }

  function animateParticles() {
    ctxBg.clearRect(0, 0, canvasBg.width, canvasBg.height);

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    connectParticles();
    requestAnimationFrame(animateParticles);
  }

  const isMobile = window.innerWidth < 768;

  if (!isMobile) {
    initParticles();
    animateParticles();
  }
}

const videos = document.querySelectorAll(".project-card video");

videos.forEach(video => {
  video.addEventListener("mouseenter", () => {
    video.play();
  });

  video.addEventListener("mouseleave", () => {
    video.pause();
    video.currentTime = 0;
  });
});

function openModal(src) {
  const modal = document.getElementById("modal");
  const video = document.getElementById("modalVideo");

  modal.style.display = "flex";

  video.src = src;
  video.load(); 
  video.play(); 
}
function closeModal() {
  const modal = document.getElementById("modal");
  const video = document.getElementById("modalVideo");

  modal.style.display = "none";
  video.pause();
  video.currentTime = 0; 
}