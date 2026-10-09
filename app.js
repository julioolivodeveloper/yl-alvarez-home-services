const BUSINESS_CONTACT = {
  phone: "+1 813 298 7166",
  whatsapp: "+1 813 298 7166",
  email: ""
};

const dialog = document.querySelector("#contact-dialog");
const dialogActions = document.querySelector("[data-dialog-actions]");
const dialogCopy = document.querySelector("[data-dialog-copy]");
const form = document.querySelector("[data-project-form]");
const formStatus = document.querySelector("[data-form-status]");
const contactNote = document.querySelector("[data-contact-note]");
const photoDialog = document.querySelector("[data-photo-dialog]");
const photoDialogImage = document.querySelector("[data-photo-dialog-image]");
const photoDialogCaption = document.querySelector("[data-photo-dialog-caption]");

const heroSlides = [
  { src: "assets/ay/outdoor-kitchen.jpg", alt: "Paver patio and covered outdoor kitchen" },
  { src: "assets/ay/landscape-border.jpg", alt: "Landscaped garden border with pavers and greenery" },
  { src: "assets/ay/poolside-planting.jpg", alt: "Poolside planting and finished outdoor living area" },
  { src: "assets/ay/paver-installation.jpg", alt: "Paver installation in progress on a residential walkway" }
];
const heroLayers = [...document.querySelectorAll("[data-hero-image]")];
const heroCount = document.querySelector("[data-hero-count]");

if (heroLayers.length === 2 && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const preloadedSlides = heroSlides.map(({ src }) => {
    const image = new Image();
    image.src = src;
    return image;
  });
  let currentSlide = 0;
  let activeLayer = 0;

  window.setInterval(async () => {
    const nextSlide = (currentSlide + 1) % heroSlides.length;
    const nextLayer = 1 - activeLayer;
    try {
      await preloadedSlides[nextSlide].decode();
    } catch {
      // Keep the current project photo visible if a slide fails to load.
      return;
    }
    const incoming = heroLayers[nextLayer];
    const outgoing = heroLayers[activeLayer];
    incoming.src = heroSlides[nextSlide].src;
    incoming.alt = heroSlides[nextSlide].alt;
    incoming.removeAttribute("aria-hidden");
    outgoing.setAttribute("aria-hidden", "true");
    incoming.classList.add("is-active");
    outgoing.classList.remove("is-active");
    if (heroCount) heroCount.textContent = `PROJECT ${String(nextSlide + 1).padStart(2, "0")} / ${String(heroSlides.length).padStart(2, "0")}`;
    currentSlide = nextSlide;
    activeLayer = nextLayer;
  }, 6000);
}

function cleanPhone(value) {
  return value.replace(/\D/g, "");
}

function makeContactActions() {
  const options = [];
  if (BUSINESS_CONTACT.phone) {
    options.push({ label: "Send a text", detail: BUSINESS_CONTACT.phone, href: `sms:${cleanPhone(BUSINESS_CONTACT.phone)}`, icon: "✉" });
  }
  if (BUSINESS_CONTACT.whatsapp) {
    options.push({ label: "WhatsApp", detail: BUSINESS_CONTACT.whatsapp, href: `https://wa.me/${cleanPhone(BUSINESS_CONTACT.whatsapp)}`, icon: "↗" });
  }
  if (BUSINESS_CONTACT.phone) {
    options.push({ label: "Call YL Alvarez", detail: BUSINESS_CONTACT.phone, href: `tel:${cleanPhone(BUSINESS_CONTACT.phone)}`, icon: "☎" });
  }
  if (BUSINESS_CONTACT.email) {
    options.push({ label: "Send an email", detail: BUSINESS_CONTACT.email, href: `mailto:${BUSINESS_CONTACT.email}`, icon: "@" });
  }
  dialogActions.replaceChildren(...options.map((option) => {
    const link = document.createElement("a");
    link.className = "dialog-action";
    link.href = option.href;
    link.innerHTML = `<span aria-hidden="true">${option.icon}</span><span>${option.label}<small>${option.detail}</small></span>`;
    if (option.href.startsWith("https:")) {
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    }
    return link;
  }));

  const hasContact = options.length > 0;
  dialogCopy.textContent = hasContact
    ? "Choose how you would like to reach YL Alvarez, or share your project details below."
    : "Share your project details below and we will follow up.";
  if (contactNote) contactNote.hidden = hasContact;
}

makeContactActions();

const menuButton = document.querySelector("[data-menu-toggle]");
const mobileNav = document.querySelector("#mobile-nav");
menuButton?.addEventListener("click", () => {
  const expanded = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!expanded));
  menuButton.setAttribute("aria-label", expanded ? "Open navigation" : "Close navigation");
  mobileNav.hidden = expanded;
});
mobileNav?.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
  mobileNav.hidden = true;
  menuButton?.setAttribute("aria-expanded", "false");
  menuButton?.setAttribute("aria-label", "Open navigation");
}));

document.querySelectorAll("[data-open-contact]").forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();
    if (mobileNav?.contains(button)) {
      mobileNav.hidden = true;
      menuButton?.setAttribute("aria-expanded", "false");
      menuButton?.setAttribute("aria-label", "Open navigation");
    }
    const service = button.dataset.service;
  if (service) {
      const select = form?.elements.namedItem("service");
      if (select) {
        const serviceChoice = {
          "Painting & property refresh": "Painting & property refresh",
          "Pavers & hardscape": "Pavers & hardscape",
          "Landscaping or cleanup": "Landscaping or cleanup",
          "Outdoor living or hardscape": "Outdoor living or pool areas",
          "New home or efficiency unit": "New home or efficiency unit"
        }[service];
        const match = [...select.options].find((option) => option.textContent === serviceChoice);
        if (match) select.value = match.value || match.textContent;
      }
    }
    makeContactActions();
    dialog.showModal();
    document.body.classList.add("dialog-open");
  });
});

function closeDialog() {
  dialog.close();
  document.body.classList.remove("dialog-open");
}
document.querySelectorAll("[data-close-dialog]").forEach((button) => button.addEventListener("click", closeDialog));
dialog?.addEventListener("click", (event) => {
  if (event.target === dialog) closeDialog();
});
dialog?.addEventListener("close", () => document.body.classList.remove("dialog-open"));
document.querySelector("[data-dialog-form]")?.addEventListener("click", closeDialog);

document.querySelectorAll("[data-lightbox]").forEach((button) => {
  button.addEventListener("click", () => {
    const image = button.querySelector("img");
    photoDialogImage.src = button.dataset.lightbox;
    photoDialogImage.alt = image?.alt || button.dataset.caption || "Project photo";
    photoDialogCaption.textContent = button.dataset.caption || "YL Alvarez project photo";
    photoDialog.showModal();
  });
});
document.querySelector("[data-close-photo]")?.addEventListener("click", () => photoDialog.close());
photoDialog?.addEventListener("click", (event) => {
  if (event.target === photoDialog) photoDialog.close();
});

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const message = [
    "Project inquiry for YL Alvarez Home & Property Services",
    `Name: ${data.get("name")}`,
    `Reply to: ${data.get("reply")}`,
    `Service: ${data.get("service")}`,
    `Details: ${data.get("details")}`
  ].join("\n");

  if (BUSINESS_CONTACT.whatsapp) {
    const number = cleanPhone(BUSINESS_CONTACT.whatsapp);
    window.open(`https://wa.me/${number}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
    formStatus.textContent = "Your message is ready in WhatsApp. Review it there before sending.";
    formStatus.classList.add("is-success");
  } else if (BUSINESS_CONTACT.email) {
    window.location.href = `mailto:${BUSINESS_CONTACT.email}?subject=${encodeURIComponent("Property project inquiry")}&body=${encodeURIComponent(message)}`;
    formStatus.textContent = "Your email draft is ready. Review it in your email app before sending.";
    formStatus.classList.add("is-success");
  } else if (BUSINESS_CONTACT.phone) {
    window.location.href = `sms:${cleanPhone(BUSINESS_CONTACT.phone)}?&body=${encodeURIComponent(message)}`;
    formStatus.textContent = "Your text message is ready. Review it in your messaging app before sending.";
    formStatus.classList.add("is-success");
  } else {
    formStatus.textContent = "Your details are filled in, but this local preview has no delivery destination yet. Add the business phone, WhatsApp or email in app.js to send inquiries.";
    formStatus.classList.remove("is-success");
  }
});

document.querySelectorAll("[data-year]").forEach((node) => node.textContent = new Date().getFullYear());

const revealTargets = document.querySelectorAll(".principle-grid article,.service-card,.service-note,.before-after-card,.work-tile,.approach-photo,.approach-copy,.area-grid > div,.contact-copy,.project-form");
revealTargets.forEach((element, index) => {
  element.dataset.reveal = "";
  if (index % 4) element.dataset.revealDelay = String(index % 4);
});
if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  document.documentElement.classList.add("reveal-ready");
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealTargets.forEach((element) => observer.observe(element));
}

const header = document.querySelector("[data-header]");
const updateHeader = () => header?.classList.toggle("is-scrolled", window.scrollY > 8);
window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

document.querySelectorAll("[data-comparison]").forEach((stage) => {
  const control = stage.querySelector(".compare-control");
  if (!control) return;
  const min = Number(control.min) || 0;
  const max = Number(control.max) || 100;
  const update = (value) => {
    const next = Math.max(min, Math.min(max, Math.round(Number(value))));
    control.value = String(next);
    control.setAttribute("aria-valuetext", `${next}% of the finished view visible`);
    stage.style.setProperty("--split", `${next}%`);
  };
  control.addEventListener("input", () => update(control.value));
  stage.addEventListener("pointermove", (event) => {
    if (event.pointerType !== "mouse" || event.buttons !== 0) return;
    const bounds = stage.getBoundingClientRect();
    const progress = (event.clientX - bounds.left) / bounds.width;
    update(min + Math.max(0, Math.min(1, progress)) * (max - min));
  });
});

const floatingContact = document.querySelector(".floating-contact");
const contactSection = document.querySelector("#contact");
if (floatingContact && contactSection && "IntersectionObserver" in window) {
  const contactObserver = new IntersectionObserver(([entry]) => {
    floatingContact.classList.toggle("is-obscured", entry.isIntersecting);
  }, { threshold: 0.12 });
  contactObserver.observe(contactSection);
}
