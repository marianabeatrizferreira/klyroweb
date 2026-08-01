const body = document.body
const header = document.querySelector(".site-header")
const progressBar = document.querySelector(".page-progress span")
const menuToggle = document.querySelector(".menu-toggle")
const mobileMenu = document.querySelector(".mobile-menu")
const mobileMenuLinks = document.querySelectorAll(".mobile-menu a")
const heroWords = document.querySelectorAll(".hero-word")
const questionPanels = document.querySelectorAll(".question-panel")
const projectSections = document.querySelectorAll(".project")
const processItems = document.querySelectorAll(".process-item")
const revealTargets = document.querySelectorAll(
  ".work-intro-top, .work-intro-copy, .project-heading, .project-main-image, .project-details, .process-head, .closing-statement > *, .contact-top, .contact-copy, .contact-footer"
)
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

const updateHeader = () => {
  header.classList.toggle("scrolled", window.scrollY > 24)
}

const updateProgress = () => {
  const documentHeight =
    document.documentElement.scrollHeight - window.innerHeight

  const progress =
    documentHeight > 0 ? window.scrollY / documentHeight : 0

  progressBar.style.width = `${progress * 100}%`
}

const openMenu = () => {
  body.classList.add("menu-open")
  menuToggle.classList.add("active")
  mobileMenu.classList.add("active")
  menuToggle.setAttribute("aria-expanded", "true")
  menuToggle.setAttribute("aria-label", "Fechar menu")
  mobileMenu.setAttribute("aria-hidden", "false")
}

const closeMenu = () => {
  body.classList.remove("menu-open")
  menuToggle.classList.remove("active")
  mobileMenu.classList.remove("active")
  menuToggle.setAttribute("aria-expanded", "false")
  menuToggle.setAttribute("aria-label", "Abrir menu")
  mobileMenu.setAttribute("aria-hidden", "true")
}

menuToggle.addEventListener("click", () => {
  mobileMenu.classList.contains("active") ? closeMenu() : openMenu()
})

mobileMenuLinks.forEach((link) => {
  link.addEventListener("click", closeMenu)
})

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu()
  }
})

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return

      entry.target.classList.add("is-visible")
      revealObserver.unobserve(entry.target)
    })
  },
  {
    threshold: 0.14,
    rootMargin: "0px 0px -8% 0px"
  }
)

revealTargets.forEach((target) => {
  target.classList.add("reveal")
  revealObserver.observe(target)
})

const showHero = () => {
  heroWords.forEach((word, index) => {
    window.setTimeout(() => {
      word.classList.add("is-visible")
    }, 140 + index * 130)
  })
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", showHero)
} else {
  showHero()
}

const animateQuestionPanels = () => {
  if (prefersReducedMotion) return

  questionPanels.forEach((panel) => {
    const rect = panel.getBoundingClientRect()
    const viewportCenter = window.innerHeight / 2
    const panelCenter = rect.top + rect.height / 2
    const distance = panelCenter - viewportCenter
    const opacity = clamp(
      1 - Math.abs(distance) / window.innerHeight,
      0.35,
      1
    )
    const shift = clamp(distance * 0.035, -34, 34)

    panel.style.opacity = opacity
    panel.style.transform = `translateY(${shift}px)`
  })
}

const animateProjects = () => {
  if (prefersReducedMotion) return

  projectSections.forEach((project, index) => {
    const image = project.querySelector(".project-main-image")
    const heading = project.querySelector(".project-heading")
    const details = project.querySelector(".project-details")
    const rect = project.getBoundingClientRect()
    const viewportCenter = window.innerHeight / 2
    const projectCenter = rect.top + rect.height / 2
    const distance = projectCenter - viewportCenter
    const direction = index % 2 === 0 ? 1 : -1
    const imageShift = clamp(distance * -0.018, -26, 26)
    const textShift = clamp(distance * 0.014 * direction, -18, 18)

    if (image) {
      image.style.translate = `0 ${imageShift}px`
    }

    if (heading) {
      heading.style.translate = `${textShift}px 0`
    }

    if (details) {
      details.style.translate = `${textShift * -0.6}px 0`
    }
  })
}

const addProcessFocus = () => {
  processItems.forEach((item) => {
    item.addEventListener("pointerenter", () => {
      processItems.forEach((otherItem) => {
        if (otherItem !== item) {
          otherItem.style.opacity = "0.38"
        }
      })
    })

    item.addEventListener("pointerleave", () => {
      processItems.forEach((otherItem) => {
        otherItem.style.opacity = ""
      })
    })
  })
}

const addMagneticLinks = () => {
  if (prefersReducedMotion) return

  const links = document.querySelectorAll(
    ".header-contact, .scroll-link, .contact-copy a"
  )

  links.forEach((link) => {
    link.addEventListener("pointermove", (event) => {
      const rect = link.getBoundingClientRect()
      const x = event.clientX - rect.left - rect.width / 2
      const y = event.clientY - rect.top - rect.height / 2

      link.style.transform = `translate(${x * 0.08}px, ${y * 0.08}px)`
    })

    link.addEventListener("pointerleave", () => {
      link.style.transform = ""
    })
  })
}

let ticking = false

const updateScrollEffects = () => {
  if (ticking) return

  ticking = true

  window.requestAnimationFrame(() => {
    updateHeader()
    updateProgress()
    animateQuestionPanels()
    animateProjects()
    ticking = false
  })
}

window.addEventListener("scroll", updateScrollEffects, {
  passive: true
})

window.addEventListener("resize", () => {
  if (window.innerWidth > 1080) {
    closeMenu()
  }

  updateScrollEffects()
})

window.addEventListener("load", updateScrollEffects)

addProcessFocus()
addMagneticLinks()
updateHeader()
updateProgress()

const projectVideos = document.querySelectorAll(".project-video")

projectVideos.forEach((video) => {
  video.muted = true

  const playVideo = () => {
    const playPromise = video.play()

    if (playPromise !== undefined) {
      playPromise.catch(() => {})
    }
  }

  if (video.readyState >= 2) {
    playVideo()
  } else {
    video.addEventListener("loadeddata", playVideo, {
      once: true
    })
  }

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      video.pause()
    } else {
      playVideo()
    }
  })
})

const customSelects = document.querySelectorAll("[data-select]")

customSelects.forEach((select) => {
  const trigger = select.querySelector(".custom-select-trigger")
  const triggerText = trigger.querySelector("span")
  const options = select.querySelectorAll(
    ".custom-select-options button"
  )
  const hiddenInput = select.querySelector('input[type="hidden"]')

  const closeSelect = () => {
    select.classList.remove("open")
    trigger.setAttribute("aria-expanded", "false")
  }

  trigger.addEventListener("click", () => {
    const isOpen = select.classList.contains("open")

    customSelects.forEach((otherSelect) => {
      otherSelect.classList.remove("open")

      const otherTrigger = otherSelect.querySelector(
        ".custom-select-trigger"
      )

      if (otherTrigger) {
        otherTrigger.setAttribute("aria-expanded", "false")
      }
    })

    if (!isOpen) {
      select.classList.add("open")
      trigger.setAttribute("aria-expanded", "true")
    }
  })

  options.forEach((option) => {
    option.addEventListener("click", () => {
      options.forEach((item) => {
        item.classList.remove("selected")
      })

      option.classList.add("selected")
      triggerText.textContent =
        option.querySelector("span").textContent

      trigger.classList.add("has-value")
      hiddenInput.value = option.dataset.value

      hiddenInput.dispatchEvent(
        new Event("change", {
          bubbles: true
        })
      )

      closeSelect()
    })
  })

  document.addEventListener("click", (event) => {
    if (!select.contains(event.target)) {
      closeSelect()
    }
  })

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeSelect()
    }
  })
})

const contactForm = document.querySelector(".contact-form")

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault()

    const name = contactForm.querySelector("#name").value.trim()
    const email = contactForm.querySelector("#email").value.trim()
    const company = contactForm.querySelector("#company").value.trim()
    const service = contactForm.querySelector("#service").value.trim()
    const message = contactForm.querySelector("#message").value.trim()
    const submitButton = contactForm.querySelector('button[type="submit"]')
    const buttonText = submitButton.querySelector("span")
    const selectTrigger = contactForm.querySelector(".custom-select-trigger")
    const whatsappNumber = 31994430084
    if (!service) {
      selectTrigger.focus()
      selectTrigger.style.borderColor = "#ff7c9b"

      window.setTimeout(() => {
        selectTrigger.style.borderColor = ""
      }, 1800)

      return
    }

    const whatsappMessage = [
  "Olá! Vim pelo site da Klyro.web.",
  "",
  `Nome: ${name}`,
  `E-mail: ${email}`,
  `Empresa ou projeto: ${company || "Não informado"}`,
  `Serviço: ${service}`,
  "",
  "Mensagem:",
  message
].join("\n")
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`

    submitButton.disabled = true
    buttonText.textContent = "Preparando conversa..."

    window.setTimeout(() => {
      buttonText.textContent = "Abrindo WhatsApp..."

      window.open(whatsappURL, "_blank", "noopener,noreferrer")

      window.setTimeout(() => {
        buttonText.textContent = "Enviar projeto"
        submitButton.disabled = false
      }, 1600)
    }, 700)
  })
}