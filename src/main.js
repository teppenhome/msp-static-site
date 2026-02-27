import "./styles/main.scss";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ===============================
   DOMContentLoaded
=============================== */
document.addEventListener("DOMContentLoaded", () => {
  /* ===============================
     セクションタイトル アニメーション
  =============================== */
  const fadeEls = document.querySelectorAll(".js-fade");

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

  /* ===============================
     ドロワーメニュー（スマホ用）
  =============================== */
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

  // ドロワー内リンククリックで閉じる（SPでのスムーズな遷移）
  drawer?.querySelectorAll(".c-drawer__link").forEach((link) => {
    link.addEventListener("click", () => {
      if (isDrawerOpen()) closeDrawer();
    });
  });

  /* ===============================
     ギャラリー ScrollTrigger
  =============================== */
 gsap.utils.toArray(".p-front__gallery-img").forEach((img) => {
   const wrap = img.closest(".p-front__gallery-img-wrap");
   if (!wrap) return;

   const getY = () => {
     const ih = img.getBoundingClientRect().height;
     const wh = wrap.getBoundingClientRect().height;
     return -Math.max(0, ih - wh);
   };

   const setup = () => {
     gsap.killTweensOf(img);
     gsap.set(img, { y: 0 });

     gsap.to(img, {
       y: getY, // ← 関数で渡す（refresh時に再計算される）
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
 });
});

/* ===============================
   window load（表示後に実行したい処理）
=============================== */
window.addEventListener("load", () => {
  /* ===============================
     ヒーローテキスト フェードイン
  =============================== */
  const hero = document.querySelector(".p-front__hero-inner");

  if (hero) {
    hero.classList.add("is-animate");

    setTimeout(() => {
      hero.classList.remove("is-animate");
      hero.classList.add("is-visible");
    }, 100);
  }

  // ✅ 画像やフォント読み込み後にトリガー再計算
  ScrollTrigger.refresh();
});
