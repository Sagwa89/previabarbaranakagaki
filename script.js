document.addEventListener("DOMContentLoaded", () => {
  const config = window.BARBARA || {};
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".main-nav");
  document.querySelector("#year").textContent = new Date().getFullYear();

  menuButton.addEventListener("click", () => {
    const open = menuButton.getAttribute("aria-expanded") !== "true";
    menuButton.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("is-open", open);
  });
  nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
    nav.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
  }));

  document.querySelectorAll(".whatsapp-link").forEach(link => {
    if (config.whatsapp) {
      link.href = `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(config.mensagem || "Olá, gostaria de agendar uma avaliação.")}`;
      link.target = "_blank";
      link.rel = "noreferrer";
    } else {
      link.addEventListener("click", event => {
        event.preventDefault();
        document.querySelector("#agendar").scrollIntoView({ behavior: "smooth" });
      });
    }
  });
  document.querySelectorAll(".instagram-link").forEach(link => {
    if (config.instagram) {
      link.href = config.instagram.startsWith("http") ? config.instagram : `https://instagram.com/${config.instagram.replace(/^@/, "")}`;
    } else {
      link.href = link.classList.contains("social-handle") ? "#tratamentos" : "#destaques";
      link.removeAttribute("target");
      if (link.classList.contains("social-handle")) link.querySelector("span:nth-child(2)").textContent = "Explorar tratamentos";
      else if (link.classList.contains("text-link")) link.firstChild.textContent = "Ver destaques ";
      else link.textContent = "Destaques ↗";
    }
  });

  const lightbox = document.querySelector(".photo-lightbox");
  const lightboxImage = lightbox.querySelector("img");
  const lightboxCaption = lightbox.querySelector("p");
  document.querySelectorAll(".result-frame img").forEach(image => {
    image.tabIndex = 0;
    image.setAttribute("role", "button");
    image.setAttribute("aria-label", `Ampliar imagem: ${image.alt}`);
    const openImage = () => {
      lightboxImage.src = image.src;
      lightboxImage.alt = image.alt;
      lightboxCaption.textContent = image.closest("figure").querySelector("figcaption").textContent;
      lightbox.showModal();
    };
    image.addEventListener("click", openImage);
    image.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openImage();
      }
    });
  });
  lightbox.querySelector(".lightbox-close").addEventListener("click", () => lightbox.close());
  lightbox.addEventListener("click", event => {
    if (event.target === lightbox) lightbox.close();
  });

  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  }), { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach(item => observer.observe(item));

  const progress = document.querySelector(".scroll-progress span");
  let progressPending = false;
  const updateScrollEffects = () => {
    const available = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${available > 0 ? window.scrollY / available : 0})`;
    document.querySelector(".site-header").classList.toggle("is-scrolled", window.scrollY > 8);
    progressPending = false;
  };
  window.addEventListener("scroll", () => {
    if (!progressPending) {
      progressPending = true;
      requestAnimationFrame(updateScrollEffects);
    }
  }, { passive: true });
  updateScrollEffects();
});
