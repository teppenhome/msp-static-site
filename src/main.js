import "./styles/main.scss";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function isRealestatePage() {
  return document.body.classList.contains("p-realestate");
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/* ===============================
   Section title animation (top / consulting / real-estate 共通)
=============================== */
function initFadeInView() {
  const fadeEls = document.querySelectorAll(".js-fade");
  if (!fadeEls.length) return;

  const io = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-inview");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.2,
      rootMargin: "0px 0px -10% 0px",
    },
  );

  fadeEls.forEach((el) => io.observe(el));
}

/* ===============================
   Drawer menu
=============================== */
function initDrawer() {
  const DRAWER_BREAKPOINT = 768;
  const drawer = document.getElementById("c-drawer");
  const drawerPanel = document.getElementById("c-drawer__panel");
  const drawerBackdrop = document.getElementById("c-drawer-backdrop");
  const drawerClose = document.getElementById("c-drawer-close");
  const hamburgerTrigger = document.getElementById("c-hamburger-trigger");

  function isDrawerOpen() {
    return drawer?.classList.contains("is-open") ?? false;
  }

  function isSpViewport() {
    return window.matchMedia(`(max-width: ${DRAWER_BREAKPOINT}px)`).matches;
  }

  function lockBodyScroll(lock) {
    document.body.style.overflow = lock ? "hidden" : "";
    document.body.style.touchAction = lock ? "none" : "";
  }

  function openDrawer() {
    if (!drawer || !hamburgerTrigger || !drawerPanel) return;
    drawer.classList.add("is-open");
    hamburgerTrigger.classList.add("is-open");
    hamburgerTrigger.setAttribute("aria-expanded", "true");
    hamburgerTrigger.setAttribute("aria-label", "メニューを閉じる");
    drawer.setAttribute("aria-hidden", "false");
    lockBodyScroll(true);
    drawerPanel.focus({ preventScroll: true });
  }

  function closeDrawer() {
    if (!drawer || !hamburgerTrigger) return;
    drawer.classList.remove("is-open");
    hamburgerTrigger.classList.remove("is-open");
    hamburgerTrigger.setAttribute("aria-expanded", "false");
    hamburgerTrigger.setAttribute("aria-label", "メニューを開く");
    drawer.setAttribute("aria-hidden", "true");
    lockBodyScroll(false);
    hamburgerTrigger.focus({ preventScroll: true });
  }

  function toggleDrawer() {
    if (!isSpViewport()) return;
    if (isDrawerOpen()) closeDrawer();
    else openDrawer();
  }

  if (hamburgerTrigger) {
    hamburgerTrigger.addEventListener("click", toggleDrawer);
  }

  if (drawerBackdrop) {
    drawerBackdrop.addEventListener("click", () => {
      if (isDrawerOpen()) closeDrawer();
    });
  }

  if (drawerClose) {
    drawerClose.addEventListener("click", () => {
      if (isDrawerOpen()) closeDrawer();
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isDrawerOpen()) {
      closeDrawer();
    }
  });

  window.addEventListener("resize", () => {
    if (!isSpViewport() && isDrawerOpen()) closeDrawer();
  });

  drawer?.querySelectorAll(".c-drawer__link").forEach((link) => {
    link.addEventListener("click", () => {
      if (isDrawerOpen()) closeDrawer();
    });
  });
}

/* ===============================
   画像パララックス（top ギャラリー）
=============================== */
function bindImageParallax(img, wrap) {
  if (!img || !wrap) return;

  const getY = () => {
    const ih = img.getBoundingClientRect().height;
    const wh = wrap.getBoundingClientRect().height;
    return -Math.max(0, ih - wh);
  };

  const setup = () => {
    gsap.killTweensOf(img);
    gsap.set(img, { y: 0 });

    gsap.to(img, {
      y: getY,
      ease: "none",
      scrollTrigger: {
        trigger: wrap,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
        invalidateOnRefresh: true,
      },
    });
  };

  if (img.complete) {
    setup();
  } else {
    img.addEventListener("load", () => {
      setup();
      ScrollTrigger.refresh();
    });
  }

  ScrollTrigger.addEventListener("refreshInit", setup);
}

function initGalleryScroll() {
  if (prefersReducedMotion()) return;

  gsap.utils.toArray(".p-front__gallery-img").forEach((img) => {
    const wrap = img.closest(".p-front__gallery-img-wrap");
    bindImageParallax(img, wrap);
  });
}

/* ===============================
   不動産ページ：セクション間区切り画像のみパララックス（3枚・img の y のみ）
=============================== */
function initRealestateParallax() {
  if (!isRealestatePage() || prefersReducedMotion()) return;

  gsap.utils.toArray(".p-realestate__section-image-img").forEach((img) => {
    const wrap = img.closest(".p-realestate__section-image-wrap");
    if (!wrap) return;

    const run = () => {
      gsap.killTweensOf(img);
      gsap.set(img, { y: 0 });

      const getY = () => {
        const ih = img.getBoundingClientRect().height;
        const wh = wrap.getBoundingClientRect().height;
        return -Math.max(0, ih - wh);
      };

      gsap.to(img, {
        y: getY,
        ease: "none",
        scrollTrigger: {
          trigger: wrap,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
          invalidateOnRefresh: true,
        },
      });
    };

    if (img.complete) {
      run();
    } else {
      img.addEventListener(
        "load",
        () => {
          run();
          ScrollTrigger.refresh();
        },
        { once: true },
      );
    }
  });
}

/* ===============================
   FAQ accordion（real-estate）
=============================== */
function initRealestateSellFaq() {
  const items = document.querySelectorAll(".c-section__faq-item");
  if (!items.length) return;

  items.forEach((item) => {
    const button = item.querySelector(".c-section__faq-question");
    if (!button) return;

    button.setAttribute(
      "aria-expanded",
      String(item.classList.contains("is-open")),
    );

    button.addEventListener("click", () => {
      const wasOpen = item.classList.contains("is-open");
      item.classList.toggle("is-open");
      button.setAttribute("aria-expanded", String(!wasOpen));
    });
  });
}

/* ===============================
   On DOMContentLoaded
=============================== */
document.addEventListener("DOMContentLoaded", () => {
  initFadeInView();
  initDrawer();
  initGalleryScroll();
  initRealestateParallax();
  initRealestateSellFaq();
});

/* ===============================
   On window load
=============================== */
window.addEventListener("load", () => {
  const heroes = document.querySelectorAll(".js-hero-reveal");
  heroes.forEach((hero) => {
    hero.classList.add("is-visible");
  });

  const loader = document.querySelector(".c-loading");

  if (loader) {
    loader.style.transition = "opacity 0.6s ease";
    loader.style.opacity = "0";

    setTimeout(() => {
      loader.remove();

      const heroBg = document.querySelector(".p-front__hero-bg");
      if (heroBg) {
        heroBg.classList.remove("is-play");
        void heroBg.offsetWidth;
        heroBg.classList.add("is-play");
      }

      ScrollTrigger.refresh();
    }, 600);
  } else {
    ScrollTrigger.refresh();
  }
});
