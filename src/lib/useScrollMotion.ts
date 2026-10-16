import { useEffect } from "react";

// Scroll choreography: elements marked data-reveal play once as they enter.
// A thin brand-gradient bar tracks progress down the page; the hero board
// drifts against the scroll. Skipped entirely under reduced motion.
export function useScrollMotion(deps: unknown[] = []) {
  useEffect(() => {
    const bar = document.getElementById("scroll-progress");
    const board = document.getElementById("hero-board");
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let io: IntersectionObserver | undefined;
    if (!still) {
      document.documentElement.classList.add("reveal-on");
      io = new IntersectionObserver(
        (entries) => {
          let n = 0; // things entering together play one after another
          for (const e of entries) {
            if (!e.isIntersecting) continue;
            (e.target as HTMLElement).style.setProperty("--stagger", `${n++ * 110}ms`);
            e.target.classList.add("is-in");
            io?.unobserve(e.target);
          }
        },
        { rootMargin: "0px 0px -10% 0px", threshold: 0.12 },
      );
      document.querySelectorAll("[data-reveal]").forEach((el) => io!.observe(el));
    }
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        if (bar) bar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
        if (board && !still) board.style.transform = `translate3d(0, ${Math.min(y, 900) * -0.14}px, 0)`;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io?.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      document.documentElement.classList.remove("reveal-on");
    };
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps
}

