const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

const loader = $("#loader");
const wipe = $("#pageWipe");
const cursor = $("#cursor");
const follower = $("#cursorFollower");

window.addEventListener("load", () => {
  setTimeout(() => {
    loader.classList.add("hide");
    introAnimation();
  }, 900);
});

function introAnimation() {
  const titleLines = $$(".split-title span");
  titleLines.forEach((line, index) => {
    line.animate(
      [
        { transform: "translateY(110%) rotate(4deg)", opacity: 0 },
        { transform: "translateY(0) rotate(0)", opacity: 1 }
      ],
      {
        duration: 900,
        delay: index * 90,
        easing: "cubic-bezier(.16,1,.3,1)",
        fill: "both"
      }
    );
  });
}

let mouseX = 0;
let mouseY = 0;
let followerX = 0;
let followerY = 0;

window.addEventListener("mousemove", (event) => {
  mouseX = event.clientX;
  mouseY = event.clientY;

  cursor.style.left = `${mouseX}px`;
  cursor.style.top = `${mouseY}px`;
});

function renderCursor() {
  followerX += (mouseX - followerX) * 0.12;
  followerY += (mouseY - followerY) * 0.12;

  follower.style.left = `${followerX}px`;
  follower.style.top = `${followerY}px`;

  requestAnimationFrame(renderCursor);
}
renderCursor();

$$("a, button, .tilt, .magnetic").forEach((element) => {
  element.addEventListener("mouseenter", () => follower.classList.add("hover"));
  element.addEventListener("mouseleave", () => follower.classList.remove("hover"));
});

$$(".magnetic").forEach((element) => {
  element.addEventListener("mousemove", (event) => {
    const rect = element.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    element.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px)`;
  });

  element.addEventListener("mouseleave", () => {
    element.style.transform = "translate(0,0)";
  });
});

const menuBtn = $("#menuBtn");
const mobilePanel = $("#mobilePanel");

menuBtn.addEventListener("click", () => {
  mobilePanel.classList.toggle("open");
  
});

$$(".mobile-panel a").forEach((link) => {
  link.addEventListener("click", () => {
    mobilePanel.classList.remove("open");
   
  });
});

function smoothTo(target) {
  const element = document.querySelector(target);
  if (!element) return;

  wipe.animate(
    [
      { transform: "scaleY(0)", transformOrigin: "bottom" },
      { transform: "scaleY(1)", transformOrigin: "bottom" }
    ],
    {
      duration: 420,
      easing: "cubic-bezier(.77,0,.18,1)",
      fill: "forwards"
    }
  ).onfinish = () => {
    element.scrollIntoView({ behavior: "smooth", block: "start" });

    setTimeout(() => {
      wipe.animate(
        [
          { transform: "scaleY(1)", transformOrigin: "top" },
          { transform: "scaleY(0)", transformOrigin: "top" }
        ],
        {
          duration: 520,
          easing: "cubic-bezier(.77,0,.18,1)",
          fill: "forwards"
        }
      );
    }, 260);
  };
}

$$('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const href = link.getAttribute("href");
    if (href.length > 1) {
      event.preventDefault();
      smoothTo(href);
    }
  });
});

const reveals = $$(".reveal");

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.animate(
        [
          { opacity: 0, transform: "translateY(80px) rotate(.6deg)", filter: "blur(8px)" },
          { opacity: 1, transform: "translateY(0) rotate(0)", filter: "blur(0)" }
        ],
        {
          duration: 850,
          easing: "cubic-bezier(.16,1,.3,1)",
          fill: "forwards"
        }
      );
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: .18 });

reveals.forEach((element) => revealObserver.observe(element));

$$(".tilt").forEach((card) => {
  card.addEventListener("mousemove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - .5;
    const y = (event.clientY - rect.top) / rect.height - .5;

    card.style.transform = `rotateX(${y * -8}deg) rotateY(${x * 8}deg) scale(1.015)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "rotateX(0) rotateY(0) scale(1)";
  });
});

const pathFill = $("#motionPathFill");
const path = $("#motionPath");
const orb = $("#pathOrb");

function updatePath() {
  if (!pathFill || !path || !orb) return;

  const projects = document.querySelector(".projects");
  const pathWrap = document.querySelector(".project-path");
  const svg = path.closest("svg");

  const length = path.getTotalLength();
  pathFill.style.strokeDasharray = length;

  const sectionRect = projects.getBoundingClientRect();
  const pathRect = pathWrap.getBoundingClientRect();
  const svgRect = svg.getBoundingClientRect();

  const viewportMiddle = window.innerHeight * 0.5;

  let progress = (viewportMiddle - sectionRect.top) / sectionRect.height;
  progress = Math.min(Math.max(progress, 0), 1);

  pathFill.style.strokeDashoffset = length * (1 - progress);

  const point = path.getPointAtLength(length * progress);

  const x = (point.x / 1200) * svgRect.width;
  const y = (point.y / 2200) * svgRect.height;

  orb.style.left = `${x + svgRect.left - pathRect.left}px`;
  orb.style.top = `${y + svgRect.top - pathRect.top}px`;
}

window.addEventListener("scroll", updatePath);
window.addEventListener("resize", updatePath);
updatePath();

window.addEventListener("scroll", () => {
  const scroll = window.scrollY;

  $$(".sticker").forEach((sticker, index) => {
    const speed = (index + 1) * .035;
    sticker.style.transform += ` translateY(${Math.sin(scroll * speed) * 0}px)`;
  });

  const heroWord = $(".hero-noise-word");
  if (heroWord) {
    heroWord.style.transform = `translateY(${scroll * .16}px)`;
  }
});

$("#briefingForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const msg = `
Olá, Klyro! Quero conversar sobre um projeto.

Nome: ${$("#nome").value}
Área do negócio: ${$("#negocio").value}
Tipo de projeto: ${$("#tipo").value}
Prazo: ${$("#prazo").value}

Detalhes:
${$("#detalhes").value || "Ainda não descrevi."}
`.trim();

  window.open(`https://wa.me/5531986990770?text=${encodeURIComponent(msg)}`, "_blank");
});

function initThree() {
  const canvas = $("#threeScene");
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(42, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
  camera.position.z = 7.4;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true
  });

  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const group = new THREE.Group();
  scene.add(group);

  const purpleMat = new THREE.MeshPhysicalMaterial({
    color: 0x9b42ff,
    metalness: .88,
    roughness: .14,
    clearcoat: 1,
    clearcoatRoughness: .04
  });

  const acidMat = new THREE.MeshPhysicalMaterial({
    color: 0xff3df2,
    metalness: .45,
    roughness: .22,
    clearcoat: 1
  });

  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: .22,
    metalness: .1,
    roughness: .05,
    transmission: .35,
    thickness: 1
  });

  const objects = [];

  function add(mesh, x, y, z, scale) {
    mesh.position.set(x, y, z);
    mesh.scale.setScalar(scale);
    group.add(mesh);
    objects.push(mesh);
    return mesh;
  }

 add(new THREE.Mesh(new THREE.BoxGeometry(1.4,1.4,1.4), purpleMat), -1.95,1.2,0,1.35);

add(new THREE.Mesh(new THREE.IcosahedronGeometry(1.1,1), acidMat), 1.5,.8,-.3,1.28);

add(new THREE.Mesh(new THREE.TorusKnotGeometry(.78,.22,180,24), purpleMat), .1,-1.4,.1,1.45);

add(new THREE.Mesh(new THREE.OctahedronGeometry(1.1), glassMat), 2.2,-1.45,-.8,1.02);

add(new THREE.Mesh(new THREE.BoxGeometry(.9,.9,.9), glassMat), -2.7,-1.55,-.5,.92);

const ring = new THREE.Mesh(
 new THREE.TorusGeometry(3.05,.032,16,190),
 acidMat
);
  ring.rotation.x = Math.PI / 2.25;
  group.add(ring);

  const ambient = new THREE.AmbientLight(0xffffff, 1.1);
  scene.add(ambient);

  const light1 = new THREE.PointLight(0x9b42ff, 4.5, 30);
  light1.position.set(4, 5, 5);
  scene.add(light1);

  const light2 = new THREE.PointLight(0xb8ff00, 3.4, 30);
  light2.position.set(-4, -3, 3);
  scene.add(light2);

  let mx = 0;
  let my = 0;

  window.addEventListener("mousemove", (event) => {
    mx = (event.clientX / window.innerWidth - .5) * 2;
    my = (event.clientY / window.innerHeight - .5) * 2;
  });

  const clock = new THREE.Clock();

  function animate() {
    const elapsed = clock.getElapsedTime();

    group.rotation.y = elapsed * .18 + mx * .28;
    group.rotation.x = Math.sin(elapsed * .42) * .18 - my * .18;
    group.position.y = Math.sin(elapsed * .8) * .16;

    objects.forEach((object, index) => {
      object.rotation.x += .006 + index * .001;
      object.rotation.y += .009 + index * .001;
    });

    ring.rotation.z += .006;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  animate();

  window.addEventListener("resize", () => {
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });
}

initThree();
