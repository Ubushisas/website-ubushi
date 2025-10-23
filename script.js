import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(SplitText, ScrollTrigger);

// Initialize Lenis smooth scrolling
const lenis = new Lenis();
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

document.fonts.ready.then(() => {
  function createSplitTexts(elements) {
    const splits = {};

    elements.forEach(({ key, selector, type, useMask = true }) => {
      const config = { type };

      if (useMask) {
        config.mask = type;
      }

      if (type === "chars") config.charsClass = "char";
      if (type === "lines") config.linesClass = "line";
      splits[key] = SplitText.create(selector, config);
    });

    return splits;
  }

  const splitElements = [
    { key: "logoChars", selector: ".preloader-logo h1", type: "chars" },
    { key: "footerLines", selector: ".preloader-footer p", type: "lines" },
    { key: "headerChars", selector: ".header h1", type: "chars" },
    { key: "siteLogoChars", selector: ".site-logo h2", type: "chars" },
    { key: "heroFooterP", selector: ".hero-footer p", type: "lines" },
    { key: "btnLabels", selector: ".btn-label span", type: "lines" },
    { key: "introSectionChars", selector: ".intro-section h1", type: "chars", useMask: false },
  ];

  const splits = createSplitTexts(splitElements);

  gsap.set([splits.logoChars.chars], { x: "100%" });
  gsap.set(
    [
      splits.footerLines.lines,
      splits.headerChars.chars,
      splits.siteLogoChars.chars,
      splits.heroFooterP.lines,
      splits.btnLabels.lines,
    ],
    { y: "100%" }
  );
  gsap.set(splits.introSectionChars.chars, { y: "100%", opacity: 0 });
  gsap.set(".btn-icon", { clipPath: "circle(0% at 50% 50%)" });
  gsap.set(".btn", { scale: 0 });
  gsap.set(".site-logo", { opacity: 0 });

  function animateProgress(duration = 4) {
    const tl = gsap.timeline();
    const counterSteps = 5;
    let currentProgress = 0;

    for (let i = 0; i < counterSteps; i++) {
      const finalStep = i === counterSteps - 1;
      const targetProgress = finalStep
        ? 1
        : Math.min(currentProgress + Math.random() * 0.3 + 0.1, 0.9);
      currentProgress = targetProgress;

      tl.to(".preloader-progress-bar", {
        scaleX: targetProgress,
        duration: duration / counterSteps,
        ease: "power2.out",
      });
    }

    return tl;
  }

  const tl = gsap.timeline({ delay: 0.5 });

  tl.to(splits.logoChars.chars, {
    x: "0%",
    stagger: 0.05,
    duration: 1,
    ease: "power4.inOut",
  })
    .to(
      splits.footerLines.lines,
      {
        y: "0%",
        stagger: 0.1,
        duration: 1,
        ease: "power4.inOut",
      },
      "0.25"
    )
    .add(animateProgress(), "<")
    .set(".preloader-progress", { backgroundColor: "#fff" })
    .to(
      splits.logoChars.chars,
      {
        x: "-100%",
        stagger: 0.05,
        duration: 1,
        ease: "power4.inOut",
      },
      "-=0.5"
    )
    .to(
      splits.footerLines.lines,
      {
        y: "-100%",
        stagger: 0.1,
        duration: 1,
        ease: "power4.inOut",
      },
      "<"
    )
    .to(
      ".preloader-progress",
      {
        opacity: 0,
        duration: 0.5,
        ease: "power3.out",
      },
      "-=0.25"
    )
    .to(
      ".preloader-mask",
      {
        scale: 6,
        duration: 2.5,
        ease: "power3.out",
      },
      "<"
    )
    .to(
      ".hero-img",
      {
        scale: 1,
        duration: 1.5,
        ease: "power3.out",
      },
      "<"
    )
    .to(splits.headerChars.chars, {
      y: 0,
      stagger: 0.05,
      duration: 1,
      ease: "power4.out",
      delay: -2,
    })
    .to(".site-logo", {
      opacity: 1,
      duration: 0.01,
    }, "-=2")
    .to(splits.siteLogoChars.chars, {
      y: 0,
      stagger: 0.05,
      duration: 1,
      ease: "power4.out",
    }, "-=2")
    .to(
      [splits.heroFooterP.lines],
      {
        y: 0,
        stagger: 0.1,
        duration: 1,
        ease: "power4.out",
      },
      "-=1.5"
    )
    .to(
      ".btn",
      {
        scale: 1,
        duration: 1,
        ease: "power4.out",
        onStart: () => {
          tl.to(".btn-icon", {
            clipPath: "circle(100% at 50% 50%)",
            duration: 1,
            ease: "power2.out",
            delay: -1.25,
          }).to(splits.btnLabels.lines, {
            y: 0,
            duration: 1,
            ease: "power4.out",
            delay: -1.25,
          });
        },
      },
      "<"
    );

  // Scroll-triggered reveal for second section
  gsap.to(".reveal-text", {
    scrollTrigger: {
      trigger: ".second-section",
      start: "top 80%",
      end: "top 30%",
      scrub: 1,
      toggleActions: "play none none reverse"
    },
    opacity: 1,
    y: 0,
    duration: 1.5,
    ease: "power3.out"
  });

  // Sticky Cards Animation
  const stickyCards = document.querySelectorAll(".sticky-card");

  stickyCards.forEach((card, index) => {
    // Pin all cards except the last one
    if (index < stickyCards.length - 1) {
      ScrollTrigger.create({
        trigger: card,
        start: "top top",
        endTrigger: stickyCards[stickyCards.length - 1],
        end: "top top",
        pin: true,
        pinSpacing: false,
      });
    }

    // Animate scale and rotation for all cards except the last
    if (index < stickyCards.length - 1) {
      ScrollTrigger.create({
        trigger: stickyCards[index + 1],
        start: "top bottom",
        end: "top top",
        onUpdate: (self) => {
          const progress = self.progress;
          const scale = 1 - progress * 0.25;
          const rotation = (index % 2 === 0 ? 5 : -5) * progress;
          const afterOpacity = progress;

          gsap.set(card, {
            scale: scale,
            rotation: rotation,
            "--after-opacity": afterOpacity,
          });
        },
      });
    }
  });

  // Fade in logo and Contact button at gallery section
  gsap.to([".site-logo", ".contact-btn"], {
    scrollTrigger: {
      trigger: ".gallery-spotlight",
      start: "top 80%",
      end: "top 50%",
      scrub: 1,
    },
    opacity: 1,
    ease: "power2.out"
  });

  // Fade out Contact button in cards section
  gsap.to(".contact-btn", {
    scrollTrigger: {
      trigger: ".cards-section",
      start: "top 50%",
      end: "top 20%",
      scrub: 1,
    },
    opacity: 0,
    ease: "power2.out"
  });

  // 3D Gallery Spotlight Animation
  initGallerySpotlight();

  // Sticky Cards Animation
  initStickyCards();

  // Intro section character-by-character scroll animation
  gsap.to(splits.introSectionChars.chars, {
    scrollTrigger: {
      trigger: ".intro-section",
      start: "top 70%",
      end: "top 30%",
      scrub: 1,
    },
    y: 0,
    opacity: 1,
    stagger: 0.02,
    ease: "power4.out"
  });
});

function initGallerySpotlight() {
  const images = document.querySelectorAll(".gallery-spotlight .img");
  const coverImg = document.querySelector(".spotlight-cover-img");
  const introHeader = document.querySelector(".spotlight-intro-header h1");
  const outroHeader = document.querySelector(".spotlight-outro-header h1");

  if (!images.length || !coverImg || !introHeader || !outroHeader) return;

  let introHeaderSplit = SplitText.create(introHeader, { type: "words" });
  gsap.set(introHeaderSplit.words, { opacity: 1 });

  let outroHeaderSplit = SplitText.create(outroHeader, { type: "words" });
  gsap.set(outroHeaderSplit.words, { opacity: 0 });
  gsap.set(outroHeader, { opacity: 1 });

  const scatterDirections = [
    { x: 1.3, y: 0.7 }, { x: -1.5, y: 1.0 }, { x: 1.1, y: -1.3 }, { x: -1.7, y: -0.8 },
    { x: 0.8, y: 1.5 }, { x: -1.0, y: -1.4 }, { x: 1.6, y: 0.3 }, { x: -0.7, y: 1.7 },
    { x: 1.2, y: -1.6 }, { x: -1.4, y: 0.9 }, { x: 1.8, y: -0.5 }, { x: -1.1, y: -1.8 },
    { x: 0.9, y: 1.8 }, { x: -1.9, y: 0.4 }, { x: 1.0, y: -1.9 }, { x: -0.8, y: 1.9 },
    { x: 1.7, y: -1.0 }, { x: -1.3, y: -1.2 }, { x: 0.7, y: 2.0 }, { x: 1.25, y: -0.2 }
  ];

  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const isMobile = window.innerWidth < 1000;
  const scatterMultiplier = isMobile ? 2.5 : 0.5;

  const startPositions = Array.from(images).map(() => ({
    x: 0, y: 0, z: -1000, scale: 0
  }));

  const endPositions = scatterDirections.map((dir) => ({
    x: dir.x * screenWidth * scatterMultiplier,
    y: dir.y * screenHeight * scatterMultiplier,
    z: 2000,
    scale: 1
  }));

  images.forEach((img, index) => {
    gsap.set(img, startPositions[index]);
  });

  gsap.set(coverImg, { z: -1000, scale: 0, x: 0, y: 0 });

  ScrollTrigger.create({
    trigger: ".gallery-spotlight",
    start: "top top",
    end: `+=${window.innerHeight * 6}px`,
    pin: true,
    pinSpacing: true,
    scrub: 1,
    onUpdate: (self) => {
      const progress = self.progress;

      images.forEach((img, index) => {
        const staggerDelay = index * 0.03;
        const scaleMultiplier = isMobile ? 4 : 2;
        let imageProgress = Math.max(0, (progress - staggerDelay) * 4);

        const start = startPositions[index];
        const end = endPositions[index];

        const zValue = gsap.utils.interpolate(start.z, end.z, imageProgress);
        const scaleValue = gsap.utils.interpolate(start.scale, end.scale, imageProgress * scaleMultiplier);
        const xValue = gsap.utils.interpolate(start.x, end.x, imageProgress);
        const yValue = gsap.utils.interpolate(start.y, end.y, imageProgress);

        gsap.set(img, { z: zValue, scale: scaleValue, x: xValue, y: yValue });
      });

      const coverProgress = Math.max(0, (progress - 0.7) * 4);
      const coverZValue = -1000 + 1000 * coverProgress;
      const coverScaleValue = Math.min(1, coverProgress * 2);

      gsap.set(coverImg, { z: coverZValue, scale: coverScaleValue, x: 0, y: 0 });

      // Intro header fade out
      if (introHeaderSplit && introHeaderSplit.words.length > 0) {
        if (progress >= 0.38 && progress <= 0.47) {
          const introFadeProgress = (progress - 0.38) / 0.09;
          const totalWords = introHeaderSplit.words.length;

          introHeaderSplit.words.forEach((word, index) => {
            const wordFadeProgress = index / totalWords;
            const fadeRange = 0.1;

            if (introFadeProgress >= wordFadeProgress + fadeRange) {
              gsap.set(word, { opacity: 0 });
            } else if (introFadeProgress <= wordFadeProgress) {
              gsap.set(word, { opacity: 1 });
            } else {
              const wordOpacity = 1 - (introFadeProgress - wordFadeProgress) / fadeRange;
              gsap.set(word, { opacity: wordOpacity });
            }
          });
        } else if (progress < 0.38) {
          gsap.set(introHeaderSplit.words, { opacity: 1 });
        } else if (progress > 0.47) {
          gsap.set(introHeaderSplit.words, { opacity: 0 });
        }
      }

      // Outro header fade in word-by-word with pauses (50% - 58%)
      // Background color transition to white
      const gallerySpotlight = document.querySelector(".gallery-spotlight");

      if (outroHeaderSplit && outroHeaderSplit.words.length > 0) {
        const totalWords = outroHeaderSplit.words.length;
        const wordDuration = 0.02; // Time for each word to fade in
        const pauseDuration = 0.025; // Pause between each word
        const totalDurationPerWord = wordDuration + pauseDuration;
        const outroStartProgress = 0.50;
        const outroEndProgress = 0.58;
        const totalOutroDuration = outroEndProgress - outroStartProgress;

        if (progress >= outroStartProgress && progress <= outroEndProgress) {
          const outroProgress = (progress - outroStartProgress) / totalOutroDuration;

          // Transition background to white
          const bgProgress = Math.min(1, outroProgress * 2);
          const bgColor = {
            r: Math.round(bgProgress * 255),
            g: Math.round(bgProgress * 255),
            b: Math.round(bgProgress * 255)
          };
          gsap.set(gallerySpotlight, {
            backgroundColor: `rgb(${bgColor.r}, ${bgColor.g}, ${bgColor.b})`
          });

          outroHeaderSplit.words.forEach((word, index) => {
            const wordStartProgress = (index * totalDurationPerWord) / (totalWords * totalDurationPerWord);
            const wordEndProgress = wordStartProgress + (wordDuration / (totalWords * totalDurationPerWord));

            if (outroProgress >= wordEndProgress) {
              gsap.set(word, { opacity: 1, color: '#000000' });
            } else if (outroProgress <= wordStartProgress) {
              gsap.set(word, { opacity: 0 });
            } else {
              const wordFadeProgress = (outroProgress - wordStartProgress) / (wordDuration / (totalWords * totalDurationPerWord));
              gsap.set(word, { opacity: wordFadeProgress, color: '#000000' });
            }
          });
        } else if (progress < outroStartProgress) {
          gsap.set(outroHeaderSplit.words, { opacity: 0 });
          gsap.set(gallerySpotlight, { backgroundColor: '#000000' });
        } else if (progress > outroEndProgress) {
          gsap.set(outroHeaderSplit.words, { opacity: 1, color: '#000000' });
          gsap.set(gallerySpotlight, { backgroundColor: '#ffffff' });
        }
      }

      // "Made to be seen..." stays visible until 67%, then fades out 67%-69% (before 20.jpg appears at 70%)
      // Companies section appears AFTER 20.jpg cover image is visible (85% - 88%)
      const companiesSection = document.querySelector(".companies-section");

      // Keep "Made to be seen..." visible (58% - 67%)
      if (progress >= 0.58 && progress < 0.67) {
        if (outroHeaderSplit && outroHeaderSplit.words.length > 0) {
          gsap.set(outroHeader, {
            opacity: 1,
            y: 0,
          });
        }
        gsap.set(companiesSection, { opacity: 0, y: 50, pointerEvents: "none" });
      } else if (progress >= 0.67 && progress <= 0.69) {
        // Fade out "Made to be seen..." (67% - 69%)
        const fadeProgress = (progress - 0.67) / 0.02;
        if (outroHeaderSplit && outroHeaderSplit.words.length > 0) {
          gsap.set(outroHeader, {
            opacity: 1 - fadeProgress,
            y: fadeProgress * -30,
          });
        }
        gsap.set(companiesSection, { opacity: 0, y: 50, pointerEvents: "none" });
      } else if (progress > 0.69 && progress < 0.85) {
        // Empty space while 20.jpg appears
        gsap.set(outroHeader, { opacity: 0, y: -30 });
        gsap.set(companiesSection, { opacity: 0, y: 50, pointerEvents: "none" });
      } else if (progress >= 0.85 && progress <= 0.88) {
        // Reveal companies section (faster transition)
        const stackProgress = (progress - 0.85) / 0.03;
        gsap.set(outroHeader, { opacity: 0, y: -100 });
        gsap.set(companiesSection, {
          opacity: stackProgress,
          y: (1 - stackProgress) * 50,
          pointerEvents: stackProgress > 0.5 ? "all" : "none"
        });
      } else if (progress < 0.58) {
        // Before "Made to be seen..." appears
        gsap.set(outroHeader, { y: 0, scale: 1 });
        gsap.set(companiesSection, { opacity: 0, y: 50, pointerEvents: "none" });
      } else if (progress > 0.88) {
        // Companies section fully visible from 88% to end (more scroll time)
        gsap.set(outroHeader, { y: -100, opacity: 0, scale: 0.9 });
        gsap.set(companiesSection, { opacity: 1, y: 0, pointerEvents: "all" });
      }
    }
  });

}

function initStickyCards() {
  const cards = gsap.utils.toArray(".card");

  if (!cards.length) return;

  // Pin the intro section while cards scroll
  ScrollTrigger.create({
    trigger: cards[0],
    start: "top 35%",
    endTrigger: cards[cards.length - 1],
    end: "top 30%",
    pin: ".intro-section",
    pinSpacing: false,
  });

  // Pin and animate each card
  cards.forEach((card, index) => {
    const isLastCard = index === cards.length - 1;
    const cardInner = card.querySelector(".card-inner");

    if (!isLastCard) {
      // Pin the card
      ScrollTrigger.create({
        trigger: card,
        start: "top 35%",
        endTrigger: ".outro-section",
        end: "top 65%",
        pin: true,
        pinSpacing: false,
      });

      // Animate card sliding up (reduced from 14vh to 8vh to keep titles visible)
      gsap.to(cardInner, {
        y: `-${(cards.length - index) * 8}vh`,
        ease: "none",
        scrollTrigger: {
          trigger: card,
          start: "top 35%",
          endTrigger: ".outro-section",
          end: "top 65%",
          scrub: true,
        },
      });
    }
  });
}
