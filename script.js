const year = document.querySelector("#year");
if (year) {
  year.textContent = String(new Date().getFullYear());
}

const marqueeTrack = document.querySelector("[data-marquee]");
if (marqueeTrack) {
  const originals = Array.from(marqueeTrack.children);
  for (const original of originals) {
    const clone = original.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    marqueeTrack.append(clone);
  }
}

const tiltItems = Array.from(document.querySelectorAll("[data-tilt]"));
for (const item of tiltItems) {
  item.addEventListener("pointermove", (event) => {
    const rect = item.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    item.style.setProperty("--tilt-x", `${(x * 5).toFixed(2)}deg`);
    item.style.setProperty("--tilt-y", `${(-y * 4).toFixed(2)}deg`);
  });

  item.addEventListener("pointerleave", () => {
    item.style.setProperty("--tilt-x", "0deg");
    item.style.setProperty("--tilt-y", "0deg");
  });
}

let ticking = false;
function updateGalleryShift() {
  const shift = Math.round(Math.min(window.scrollY * 0.08, 54));
  marqueeTrack?.style.setProperty("--scroll-shift", `${shift}px`);
  ticking = false;
}

window.addEventListener(
  "scroll",
  () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(updateGalleryShift);
  },
  { passive: true },
);

const navLinks = Array.from(document.querySelectorAll(".nav-links a"));
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const observer = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const activeLink = navLinks.find(
        (link) => link.getAttribute("href") === `#${entry.target.id}`,
      );
      navLinks.forEach((link) => link.classList.toggle("is-active", link === activeLink));
    }
  },
  { rootMargin: "-35% 0px -55% 0px", threshold: 0 },
);

sections.forEach((section) => observer.observe(section));

const revealItems = Array.from(document.querySelectorAll("[data-reveal]"));
const revealObserver = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  },
  { rootMargin: "0px 0px -12% 0px", threshold: 0.18 },
);

revealItems.forEach((item, index) => {
  item.style.transitionDelay = `${Math.min(index * 45, 360)}ms`;
  revealObserver.observe(item);
});
