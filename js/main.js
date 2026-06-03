/* ARCHIVO PRINCIPAL DE JAVASCRIPT */
// localStorage.removeItem("cnomIntroLastSeen")
// location.reload()

import { loadIncludes } from "./includes.js";


//Scroll restoration
if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
}

window.addEventListener("beforeunload", () => {
    window.scrollTo(0, 0);
});

// FAQS - VER MÁS

function initFaqsMore() {
    const moreButton = document.querySelector(".btn-more");
    const extraFaqs = document.querySelector(".faqs_more");

    if (!moreButton || !extraFaqs) return;

    moreButton.addEventListener("click", () => {
        extraFaqs.hidden = false;
        moreButton.hidden = true;
    });
}

function initFaqsAccordion() {
    const faqItems = document.querySelectorAll(".dropdown_faqs details");

    if (!faqItems.length) return;

    faqItems.forEach((item) => {
        const summary = item.querySelector("summary");
        const answer = item.querySelector(".dropdown_faqs_answer");
        const iconVertical = item.querySelector(".faq-icon__line--vertical");

        if (!summary || !answer) return;

        item.open = true;
        item.dataset.open = "false";

        gsap.set(answer, {
            height: 0,
            autoAlpha: 1,
            overflow: "hidden"
        });

        if (iconVertical) {
            gsap.set(iconVertical, {
                rotation: 0,
                transformOrigin: "50% 50%",
                transformBox: "view-box",
                scale: 1
            });
        }

        summary.addEventListener("click", (event) => {
            event.preventDefault();

            const isOpen = item.dataset.open === "true";

            faqItems.forEach((otherItem) => {
                if (otherItem === item) return;
                if (otherItem.dataset.open !== "true") return;

                const otherAnswer = otherItem.querySelector(".dropdown_faqs_answer");
                const otherIconVertical = otherItem.querySelector(".faq-icon__line--vertical");

                if (!otherAnswer) return;

                otherItem.dataset.open = "false";

                gsap.killTweensOf(otherAnswer);

                gsap.to(otherAnswer, {
                    height: 0,
                    autoAlpha: 1,
                    duration: 0.5,
                    ease: "power2.inOut"
                });

                if (otherIconVertical) {
                    gsap.killTweensOf(otherIconVertical);

                    gsap.to(otherIconVertical, {
                        rotation: 0,
                        scale: 1,
                        duration: 0.45,
                        ease: "power3.inOut"
                    });
                }
            });

            if (isOpen) {
                item.dataset.open = "false";

                gsap.killTweensOf(answer);

                gsap.to(answer, {
                    height: 0,
                    autoAlpha: 1,
                    duration: 0.5,
                    ease: "power2.inOut"
                });

                if (iconVertical) {
                    gsap.killTweensOf(iconVertical);

                    gsap.to(iconVertical, {
                        rotation: 0,
                        scale: 1,
                        duration: 0.45,
                        ease: "power3.inOut"
                    });
                }

                return;
            }

            item.dataset.open = "true";

            gsap.killTweensOf(answer);

            const answerHeight = answer.scrollHeight;

            gsap.to(answer, {
                height: answerHeight,
                autoAlpha: 1,
                duration: 1.2,
                ease: "power3.out"
            });

            if (iconVertical) {
                gsap.killTweensOf(iconVertical);

                gsap.to(iconVertical, {
                    rotation: 90,
                    scale: 1,
                    duration: 0.55,
                    ease: "power3.inOut"
                });
            }
        });
    });
}





// SHUFFLE ARRAY

function shuffleArray(array) {
    const arr = [...array];

    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    return arr;
}



// GSAP

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);



// HERO — LOAD INICIAL 30' MIN ESPERA

function shouldShowFullIntro() {
    const introLastSeen = localStorage.getItem("cnomIntroLastSeen");
    const now = Date.now();
    const thirtyMinutes = 30 * 60 * 1000;

    if (!introLastSeen) return true;

    return now - Number(introLastSeen) > thirtyMinutes;
}

function saveIntroSeenTime() {
    localStorage.setItem("cnomIntroLastSeen", Date.now());
}



// HERO — LOAD INICIAL

function initHeroIntroMessages() {
    const introMessages = document.querySelector(".hero-intro-messages");
    const introMessage01 = document.querySelector(".hero-intro-message--01");
    const introMessage02 = document.querySelector(".hero-intro-message--02");
    const introSource = document.querySelector(".hero-intro-source");
    const introProgress = document.querySelector(".hero-intro-progress");

    const headerLogo = document.querySelector(".logo");
    const headerCenter = document.querySelector(".nav-center");
    const headerRight = document.querySelector(".nav-right");

    const heroH1 = document.querySelector(".hero-state--one h1");
    const heroIntro = document.querySelector(".hero-state--one .intro");
    const heroPct = document.querySelectorAll(".hero-pct");
    const heroGradient = document.querySelector(".hero-gradient");
    const heroStateOne = document.querySelector(".hero-state--one");

    if (!introMessages || !introMessage01 || !introMessage02 || !introSource || !introProgress || !heroH1) return;

    const showFullIntro = shouldShowFullIntro();

    const heroH1Split = new SplitText(heroH1, {
        type: "chars",
        charsClass: "char"
    });

    const introMessage01Split = new SplitText(".hero-intro-message--01 p", {
        type: "lines",
        linesClass: "intro-line"
    });

    const introMessage02MainSplit = new SplitText(".intro-message-02__main", {
        type: "words",
        wordsClass: "intro-word"
    });

    const introMessage02SecondarySplit = new SplitText(".intro-message-02__secondary", {
        type: "words",
        wordsClass: "intro-word"
    });

    const introMessage02Words = [
        ...introMessage02MainSplit.words,
        ...introMessage02SecondarySplit.words
    ];

    const introSourceSplit = new SplitText(introSource, {
        type: "lines",
        linesClass: "intro-source-line"
    });

    // Estado inicial general
    gsap.set(introMessages, {
        autoAlpha: 1
    });

    gsap.set([introMessage01, introMessage02, introSource], {
        autoAlpha: 1,
        filter: "none"
    });

    // Mensaje 1 entra animado desde el inicio
    gsap.set(introMessage01Split.lines, {
        autoAlpha: 0,
        y: 18,
        filter: "blur(10px)"
    });

    // Mensaje 2 queda preparado, pero oculto
    gsap.set(introMessage02Words, {
        autoAlpha: 0,
        y: 18,
        filter: "blur(10px)"
    });

    // Fuente también entra animada
    gsap.set(introSourceSplit.lines, {
        autoAlpha: 0,
        y: 10,
        filter: "blur(7px)"
    });

    gsap.set(introProgress, {
        autoAlpha: 0,
        y: 8,
        filter: "blur(6px)"
    });

    // Ocultamos hero real al inicio
    gsap.set(heroStateOne, {
        autoAlpha: 1,
        visibility: "visible"
    });

    gsap.set(heroH1, {
        autoAlpha: 1,
        filter: "none"
    });

    gsap.set(heroH1Split.chars, {
        autoAlpha: 0,
        y: 18,
        filter: "blur(12px)",
        willChange: "transform, opacity, filter"
    });

    gsap.set(heroIntro, {
        autoAlpha: 0,
        filter: "blur(8px)"
    });

    gsap.set(heroGradient, {
        autoAlpha: 0,
        filter: "none"
    });

    gsap.set(heroPct, {
        autoAlpha: 0
    });

    gsap.set([headerLogo, headerCenter, headerRight], {
        autoAlpha: 0
    });

    const progressCounter = {
        value: 0
    };

    introProgress.textContent = "0%";

    const tl = gsap.timeline();

    if (showFullIntro) {
        saveIntroSeenTime();

        // Pausa inicial antes de que aparezca el primer texto
        tl.to({}, {
            duration: 0.4
        });

        // Entra mensaje 1 por líneas
        tl.to(introMessage01Split.lines, {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 1.15,
            ease: "power3.out",
            stagger: {
                each: 0.08,
                from: "start"
            }
        });

        // Entra fuente
        tl.to(introSourceSplit.lines, {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.9,
            ease: "power3.out",
            stagger: {
                each: 0.05,
                from: "start"
            }
        }, "<+=0.35");

        // Entra porcentaje visualmente
        tl.to(introProgress, {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.8,
            ease: "power3.out"
        }, "<+=0.15");

        // Anima porcentaje 0 → 50
        tl.to(progressCounter, {
            value: 50,
            duration: 1.8,
            ease: "slow(0.7,0.7,false)",
            onUpdate: () => {
                introProgress.textContent = `${Math.round(progressCounter.value)}%`;
            }
        }, "<");

        // Pausa mensaje 1
        tl.to({}, {
            duration: 0.2
        });

        // Sale mensaje 1 por líneas
        tl.to(introMessage01Split.lines, {
            autoAlpha: 0,
            y: 18,
            filter: "blur(10px)",
            duration: 1,
            ease: "power3.out",
            stagger: {
                each: 0.08,
                from: "start"
            }
        });

        // Entra mensaje 2 por líneas
        tl.to(introMessage02Words, {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 1.1,
            ease: "power3.out",
            stagger: {
                each: 0.035,
                from: "start"
            }
        }, "<+=0.2");

        // Anima porcentaje 50 → 100
        tl.to(progressCounter, {
            value: 100,
            duration: 1.8,
            ease: "slow(0.7,0.7,false)",
            onUpdate: () => {
                introProgress.textContent = `${Math.round(progressCounter.value)}%`;
            }
        }, "<");

        // Pausa mensaje 2
        tl.to({}, {
            duration: 2.5
        });

        // Primero desaparece la parte social / silenciada
        tl.to(introMessage02SecondarySplit.words, {
            autoAlpha: 0,
            y: 18,
            filter: "blur(10px)",
            duration: 1,
            ease: "power3.out",
            stagger: {
                each: 0.08,
                from: "start"
            }
        });

        // Sale fuente y porcentaje
        tl.to([introSourceSplit.lines, introProgress], {
            autoAlpha: 0,
            y: 10,
            filter: "blur(8px)",
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.04
        }, "<+=0.2");

        tl.to({}, {
            duration: 0.1
        });

        tl.to({}, {
            duration: 0.1
        });

        // Después desaparece la idea principal
        tl.to(introMessage02MainSplit.words, {
            autoAlpha: 0,
            y: 18,
            filter: "blur(10px)",
            duration: 2,
            ease: "power3.out",
            stagger: {
                each: 0.08,
                from: "start"
            }
        }, "<=");
    }

    else {
        tl.set([
            introMessage01Split.lines,
            introMessage02Words,
            introSourceSplit.lines,
            introProgress
        ], {
            autoAlpha: 0
        });

        tl.to({}, {
            duration: 0.35
        });
    }

    tl.set(introMessages, {
        autoAlpha: 0,
        pointerEvents: "none"
    });

    // Dejamos todo preparado antes de quitar la clase del body
    tl.set(heroH1, {
        autoAlpha: 1,
        filter: "none"
    });

    tl.set(heroH1Split.chars, {
        autoAlpha: 0,
        y: 18,
        filter: "blur(12px)"
    });

    tl.set([headerLogo, headerCenter, headerRight], {
        autoAlpha: 0,
        y: -8
    });

    tl.set(heroIntro, {
        autoAlpha: 0,
        y: 12,
        filter: "blur(8px)"
    });

    tl.set(heroGradient, {
        autoAlpha: 0,
        filter: "none"
    });

    tl.set(heroPct, {
        autoAlpha: 0
    });

    // Quitamos la clase para que el CSS deje de bloquear el hero/header
    tl.call(() => {
        document.body.classList.remove("is-intro-active");
    });

    // 1. Aparece H1 por caracteres, como la salida pero al revés
    tl.to(heroH1Split.chars, {
        autoAlpha: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 3,
        ease: "power3.out",
        stagger: {
            each: 0.018,
            from: "start"
        }
    });

    // 2. Aparece menú
    tl.to([headerLogo, headerCenter, headerRight], {
        autoAlpha: 1,
        y: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: {
            each: 0.16,
            from: "start"
        }
    }, "<+=0.45");

    // 3. Aparece texto inferior derecho
    tl.to(heroIntro, {
        autoAlpha: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 1.1,
        ease: "power3.out"
    }, "<+=0.55");

    // 4. Aparecen degradados inferiores y chica por opacidad
    tl.to([heroGradient, heroPct], {
        autoAlpha: 1,
        duration: 3,
        ease: "sine.out"
    }, "<+=0.45");

    tl.call(() => {
        document.body.classList.remove("is-scroll-locked");
    });
}



// HERO - ANIMACIÓN PRINCIPAL

function initHeroAnimation(heroButtonLoop) {
    const hero = document.querySelector(".hero");

    if (!hero) return;

    const heroH2Element = document.querySelector(".hero-state--two .hf-l");

    if (!heroH2Element) return;

    const heroH2 = new SplitText(heroH2Element, {
        type: "lines",
        linesClass: "line"
    });

    const heroTxt = document.querySelector(".hero-state--two .txt-block");
    const heroTxtParagraphs = document.querySelectorAll(".hero-state--two .txt-block p");
    const heroIntro = document.querySelector(".hero-state--one .intro");
    const heroH1Chars = gsap.utils.toArray(".hero-state--one h1 .char");

    if (!heroTxt || !heroIntro) return;

    const mm = gsap.matchMedia();

    mm.add({
        isMobile: "(max-width:1279px)",
        isDesktop: "(min-width:1280px)"
    }, (context) => {
        const { isDesktop } = context.conditions;

        const heroPct = document.querySelectorAll(".hero-pct");
        const heroPctMain = document.querySelector(".hero-pct");
        const heroBrownGradient = document.querySelector(".hero-brown-transition__gradient");

        const heroBrownSolid = document.querySelector(".hero-brown-transition__color");

        let girlYToCenter = "-18vh";
        let desktopGradientScale = 3;

        // SET
        gsap.set(heroH1Chars, {
            willChange: "transform, opacity, filter"
        });

        gsap.set(heroH2.lines, {
            autoAlpha: 0,
            y: 18,
            filter: "blur(10px)",
            willChange: "transform, opacity, filter"
        });

        gsap.set(heroTxt, {
            autoAlpha: 1,
            visibility: "visible"
        });

        gsap.set(heroTxtParagraphs, {
            autoAlpha: 0,
            y: 20,
            filter: "blur(7px)"
        });

        gsap.set(heroIntro, {
            autoAlpha: 0,
            filter: "blur(7px)"
        });

        gsap.set(heroBrownSolid, {
            autoAlpha: 1,
            yPercent: 100,
        });

        // Estado inicial del degradado brown de salida del hero.
        if (heroBrownGradient) {
            gsap.set(heroBrownGradient, {
                yPercent: 100,
                autoAlpha: 1,
                scaleX: 1.1,
                scaleY: 1,
                filter: "blur(0px)"
            });
        }

        if (isDesktop && heroPctMain) {
            const heroPctRect = heroPctMain.getBoundingClientRect();

            const viewportCenter = window.innerHeight / 2;
            const girlCenter = heroPctRect.top + heroPctRect.height / 2;

            const girlOffset = -150;

            girlYToCenter = viewportCenter - girlCenter + girlOffset;

            const desktopWidthProgress = gsap.utils.clamp(
                0,
                1,
                (window.innerWidth - 1440) / (1920 - 1440)
            );

            desktopGradientScale = gsap.utils.interpolate(
                2.55,
                3.3,
                desktopWidthProgress
            );
        }

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: ".hero",
                start: "top top",
                end: "bottom bottom",
                scrub: 1.2,
                markers: true,

                onUpdate: (self) => {
                    if (self.progress >= 0.75 && self.direction === 1 && !self._hasSnapped) {
                        self._hasSnapped = true;
                        const narrativeTarget = document.querySelector('#narrative-step__1');

                        if (narrativeTarget) {
                            const targetY = narrativeTarget.offsetTop + window.innerHeight * 0.35;//

                            gsap.to(window, {
                                scrollTo: {
                                    y: targetY
                                },
                                duration: 2.5,
                                ease: "power2.inOut"
                            });
                        }
                    }
                    if (self.progress < 0.75) {
                        self._hasSnapped = false;  // reset si el usuario vuelve hacia arriba
                    }
                },
            }
        });

        tl.to(heroH1Chars, {
            autoAlpha: 0,
            filter: "blur(12px)",
            y: 18,
            duration: 3,
            ease: "power3.out",
            stagger: {
                each: 0.018,
                from: "end"
            }
        });

        tl.to(".hero-pct", {
            scale: 0.65,
            y: isDesktop ? girlYToCenter : "-18vh",
            duration: 3
        }, "<-=0.1");

        // Control de degradado inferior del hero
        tl.fromTo(".hero-gradient__strong",
            {
                scaleY: isDesktop ? 0.25 : 0.35,
                yPercent: isDesktop ? 10 : 65
            },
            {
                scaleY: isDesktop ? desktopGradientScale : 2,
                yPercent: isDesktop ? 8 : 0,
                duration: 3
            },
            "<"
        );

        tl.to(heroIntro, {
            autoAlpha: 0,
            filter: "blur(7px)",
            duration: 3
        }, "<");

        tl.to(".hero-state--two", {
            autoAlpha: 1,
            visibility: "visible",
            duration: 0.1
        }, "<=");

        tl.to(heroH2.lines, {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 2,
            ease: "power3.out",
            stagger: {
                each: 0.18,
                from: "start"
            }
        }, "<+=0.9");


        tl.to(heroTxtParagraphs, {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 1.4,
            ease: "power3.out",
            stagger: {
                each: 0.15,
                from: "start"
            }
        }, "<+=0.6");


        let heroButtonDelayCall = null;

        tl.to(".btn-hero", {
            autoAlpha: 1,
            duration: 0.9,
            onStart: () => {
                if (!heroButtonLoop) return;

                heroButtonLoop.pause(0);

                if (heroButtonDelayCall) {
                    heroButtonDelayCall.kill();
                }

                heroButtonDelayCall = gsap.delayedCall(0.9, () => {
                    heroButtonLoop.restart();
                });
            },
            onReverseComplete: () => {
                if (heroButtonDelayCall) {
                    heroButtonDelayCall.kill();
                    heroButtonDelayCall = null;
                }

                if (heroButtonLoop) {
                    heroButtonLoop.pause(0);

                    gsap.set(".btn-hero", {
                        "--btn-border-scale": 1
                    });
                }
            }
        }, "<+=0.5");

        tl.to({}, {
            duration: 2
        });

        tl.to(heroBrownSolid, {
            yPercent: 0,
            duration: 2,
        }, "<=0.3");



        // Degradado brown de salida del hero hacia la narrativa.
        if (heroBrownGradient) {

            tl.to(heroBrownGradient, {
                yPercent: 0,
                duration: 3,
                ease: "none",
                filter: "blur(20px)",
                // scaleY: 1.1,
            });

        }
    });
}



// HERO — BOTÓN

function initHeroButtonAnimation() {
    const heroButton = document.querySelector(".btn-hero");

    if (!heroButton) return null;

    gsap.set(heroButton, {
        "--btn-border-scale": 1
    });

    const borderLoopTl = gsap.timeline({
        paused: true,
        repeat: -1,
        yoyo: true
    });

    borderLoopTl.to(heroButton, {
        "--btn-border-scale": 1.12,
        duration: 2,
        ease: "sine.inOut"
    });

    let returnTween = null;

    heroButton.addEventListener("mouseenter", () => {
        borderLoopTl.pause();

        if (returnTween) returnTween.kill();

        returnTween = gsap.to(heroButton, {
            "--btn-border-scale": 1,
            duration: 0.6,
            ease: "sine.out"
        });
    });

    heroButton.addEventListener("mouseleave", () => {
        if (returnTween) returnTween.kill();

        returnTween = gsap.to(heroButton, {
            "--btn-border-scale": 1,
            duration: 0.4,
            ease: "sine.out",
            onComplete: () => {
                borderLoopTl.pause(0);
                borderLoopTl.restart();
            }
        });
    });

    return borderLoopTl;
}

// Botón hero → scroll suave a narrativa
const btnHero = document.querySelector('.btn-hero');
if (btnHero) {
    btnHero.addEventListener('click', (e) => {
        e.preventDefault();
        const narrativeTarget = document.querySelector('#narrative-step__1');
        if (narrativeTarget) {
            narrativeTarget.scrollIntoView({ behavior: 'smooth' });
        }
    });
}


// HEADER — THEME
function setHeaderTheme(theme = "grey") {
    const allowedThemes = ["grey", "brown"];
    const safeTheme = allowedThemes.includes(theme) ? theme : "grey";

    const isBrown = safeTheme === "brown";

    document.body.classList.toggle("header-is-brown", isBrown);
    document.body.classList.toggle("header-is-grey", !isBrown);

    updateHeaderLogoTheme(safeTheme);
}

function updateHeaderLogoTheme(theme) {
    const logoImages = document.querySelectorAll(".logo-img");

    if (!logoImages.length) return;

    logoImages.forEach((img) => {
        const nextSrc = img.dataset[theme];

        if (!nextSrc) return;
        if (img.getAttribute("src") === nextSrc) return;

        img.setAttribute("src", nextSrc);
    });
}

// HEADER — THEME SECTIONS
function initHeaderThemeSections() {
    const themeSections = document.querySelectorAll("[data-header-theme]");

    if (!themeSections.length) return;

    themeSections.forEach((section) => {
        const theme = section.dataset.headerTheme;

        ScrollTrigger.create({
            trigger: section,
            start: "top top+=80",
            end: "bottom top+=80",

            onEnter: () => setHeaderTheme(theme),
            onEnterBack: () => setHeaderTheme(theme),

            onLeave: () => setHeaderTheme("grey"),
            onLeaveBack: () => setHeaderTheme("grey")
        });
    });
}

// NARRATIVA - SECUENCIA COMPLETA

function initNarrativeSequence() {
    const sequence = document.querySelector(".narrative-sequence--all");

    if (!sequence) return;

    // Layers
    const nacerLayer = sequence.querySelector(".narrative-layer--01");
    const guionLayer = sequence.querySelector(".narrative-layer--02");
    const layer03 = sequence.querySelector(".narrative-layer--03");
    const layer04 = sequence.querySelector(".narrative-layer--04");
    const layer05 = sequence.querySelector(".narrative-layer--05");
    const layer06 = sequence.querySelector(".narrative-layer--06");


    // Indicadores narrativa
    const indicator = document.querySelector(".indicator");
    const indicatorCurrent = document.querySelector(".indicator__current");
    const indicatorTitle = document.querySelector(".indicator__title");
    const indicatorTotal = document.querySelector(".indicator__total");

    const narrativeSteps = gsap.utils.toArray(sequence.querySelectorAll(".narrative-step"));

    let activeIndicatorIndex = -1;

    const indicatorBrownSteps = [1, 4, 5];

    function showNarrativeIndicator() {
        if (!indicator) return;

        gsap.to(indicator, {
            autoAlpha: 1,
            duration: 0.45,
            ease: "power2.out",
            overwrite: true
        });
    }

    function hideNarrativeIndicator() {
        if (!indicator) return;

        gsap.to(indicator, {
            autoAlpha: 0,
            duration: 0.35,
            ease: "power2.out",
            overwrite: true
        });
    }

    function updateNarrativeIndicator(index, animate = true) {
        if (!indicatorCurrent || !indicatorTitle || !indicatorTotal) return;
        if (!narrativeSteps[index]) return;
        if (activeIndicatorIndex === index) return;

        activeIndicatorIndex = index;

        updateNarrativeIndicatorColor(index);

        const step = narrativeSteps[index];

        const nextCurrent = step.dataset.chapter || String(index + 1).padStart(2, "0");
        const nextTitle = step.dataset.chapterTitle || "";
        const nextTotal = String(narrativeSteps.length).padStart(2, "0");

        // El total no cambia, queda fijo.
        indicatorTotal.textContent = nextTotal;

        const changingItems = [indicatorCurrent, indicatorTitle];

        // Primera carga: sin animación.
        if (!animate) {
            indicatorCurrent.textContent = nextCurrent;
            indicatorTitle.textContent = nextTitle;

            gsap.set(changingItems, {
                autoAlpha: 1,
                y: 0,
                filter: "blur(0px)"
            });

            return;
        }

        gsap.killTweensOf(changingItems);

        const tl = gsap.timeline();

        tl.to(changingItems, {
            autoAlpha: 0,
            y: -10,
            filter: "blur(4px)",
            duration: 0.5,
            ease: "power2.in",
            stagger: {
                each: 0.035,
                from: "start"
            }
        });

        tl.call(() => {
            updateNarrativeIndicatorColor(index);

            indicatorCurrent.textContent = nextCurrent;
            indicatorTitle.textContent = nextTitle;

            gsap.set(changingItems, {
                y: 7,
                filter: "blur(4px)"
            });
        });

        tl.to(changingItems, {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.42,
            ease: "power3.out",
            stagger: {
                each: 0.045,
                from: "start"
            }
        });
    }

    //función indicador color narrativa
    function updateNarrativeIndicatorColor(index) {
        if (!indicator) return;

        const shouldBeBrown = indicatorBrownSteps.includes(index);

        indicator.classList.toggle("is-brown", shouldBeBrown);
    }


    function syncNarrativeIndicator(timeline) {
        if (!timeline) return;

        const time = timeline.time();

        const labels = [
            { index: 0, time: timeline.labels.chapter01 },
            { index: 1, time: timeline.labels.chapter02 },
            { index: 2, time: timeline.labels.chapter03 },
            { index: 3, time: timeline.labels.chapter04 },
            { index: 4, time: timeline.labels.chapter05 },
            { index: 5, time: timeline.labels.chapter06 }
        ];

        let currentIndex = 0;

        labels.forEach((label) => {
            if (typeof label.time === "number" && time >= label.time) {
                currentIndex = label.index;
            }
        });

        updateNarrativeIndicator(currentIndex);
    }

    // Snan Points
    function getSnapPointsFromLabels(timeline, labels) {
        if (!timeline || !labels.length) return [];

        const duration = timeline.duration();

        if (!duration) return [];

        return labels
            .map((label) => timeline.labels[label] / duration)
            .filter((point) => Number.isFinite(point));
    }


    //flores salen de la pantalla
    function getXToExitRight(element, margin = 80) {
        if (!element) return 0;

        const rect = element.getBoundingClientRect();
        const currentX = gsap.getProperty(element, "x");

        const distanceToExit = window.innerWidth - rect.left + margin;

        return currentX + distanceToExit;
    }

    function getXToExitLeft(element, margin = 80) {
        if (!element) return 0;

        const rect = element.getBoundingClientRect();
        const currentX = gsap.getProperty(element, "x");

        const distanceToExit = -rect.right - margin;

        return currentX + distanceToExit;
    }


    // Estado inicial del indicador
    if (indicator) {
        gsap.set(indicator, {
            autoAlpha: 0
        });
    }

    updateNarrativeIndicator(0, false);
    gsap.set([indicatorCurrent, indicatorTitle], {
        willChange: "transform, opacity, filter"
    });

    // Step 01
    const nacerGraphics = sequence.querySelectorAll(".narrative-layer--01 .step--01__graphics");
    const nacerTxt = sequence.querySelector(".narrative-layer--01 .step--01__content .txt-block");
    const nacerBgWhite = sequence.querySelector(".narrative-layer--01 .white-sphere")

    // Step 02
    const guionGraphics = sequence.querySelector(".narrative-layer--02 .step--02__graphics");
    const guionContent = sequence.querySelector(".narrative-layer--02 .step--02__content");
    const guionImage = sequence.querySelector(".narrative-layer--02 .step--02__img");
    const guionBgTransition = sequence.querySelector(".step--02__bg-transition");
    const pixelSvg = sequence.querySelector(".step--02__pixel-svg");
    const pixelParts = gsap.utils.toArray(".step--02__pixel-svg rect, .step--02__pixel-svg path");
    const shuffledPixelParts = shuffleArray(pixelParts);

    // Step 03
    const apagaContent = sequence.querySelector(".narrative-layer--03 .txt-block__center");

    // Step 04
    const juicioPurpleSphere = sequence.querySelector(".narrative-layer--04 .purple-sphere");
    const juicioBrownSphere = sequence.querySelector(".narrative-layer--04 .brown-sphere");
    const juicioContent = sequence.querySelector(".narrative-layer--04 .step--04__content");

    // Step 05
    const nombreGradientBg = sequence.querySelector(".narrative-layer--05 .step--5_grandient__bg");
    const nombreGradientBtm = sequence.querySelector(".narrative-layer--05 .step--5_grandient__btm");
    const nombreContent = sequence.querySelector(".narrative-layer--05 .step--05__content");

    const nombreFlorGrupo = sequence.querySelector(".narrative-layer--05 .step--05_flor_grupo");
    const nombreFlorHblur = sequence.querySelector(".narrative-layer--05 .step--05_flor-hblur");
    const nombreFlorMblur = sequence.querySelector(".narrative-layer--05 .step--05_flor-mblur");
    const nombreFlorLblur = sequence.querySelector(".narrative-layer--05 .step--05_flor-lblur");

    // Step 06
    const pasoFlor1 = sequence.querySelector(".narrative-layer--06 .step--06-flor-1");
    const pasoFlor2 = sequence.querySelector(".narrative-layer--06 .step--06-flor-2");
    const pasoFlor3 = sequence.querySelector(".narrative-layer--06 .step--06-flor-3");
    const pasoFlor4 = sequence.querySelector(".narrative-layer--06 .step--06-flor-4");
    const pasoFlor5 = sequence.querySelector(".narrative-layer--06 .step--06-flor-5");

    const pasoContent = sequence.querySelector(".narrative-layer--06 .step--06__content");
    const pasoBtn = sequence.querySelector(".narrative-layer--06 .btn");


    // Snap to
    const narrativeSnapLabels = [
        "rest01",
        "rest02",
        "rest03",
        "rest04",
        "rest05",
        "rest06",
        "rest07",
        "rest08",
        "rest09"

    ];

    if (!nacerLayer || !guionLayer || !nacerGraphics.length || !nacerTxt || !guionGraphics || !guionContent) return;



    // Estado inicial STEP 1
    gsap.set(nacerTxt, {
        autoAlpha: 0,
        filter: "blur(10px)"
    });

    gsap.set(nacerGraphics, {
        transformOrigin: "50% 50%",
        scale: 1,
        force3D: false
    });

    gsap.set(nacerBgWhite, {
        autoAlpha: 0,
        filter: "blur(2px)"
    });

    // Estado inicial layers
    gsap.set(guionLayer, {
        autoAlpha: 0
    });

    gsap.set([layer03, layer04, layer05, layer06], {
        autoAlpha: 0
    });

    // Estado inicial STEP 2
    gsap.set(guionGraphics, {
        y: "100vh",
        scale: 1.8
    });

    gsap.set(guionContent, {
        autoAlpha: 0
    });

    gsap.set(guionBgTransition, {
        autoAlpha: 0
    });

    // Estado inicial STEP 3
    gsap.set(apagaContent, {
        autoAlpha: 0,
        filter: "blur(25px)"
    });

    // Estado inicial STEP 4
    gsap.set(juicioBrownSphere, {
        autoAlpha: 0,
        filter: "blur(0px)",
        scale: 0
    });

    // Importante:
    if (pixelSvg) {
        gsap.set(pixelSvg, {
            autoAlpha: 1
        });
    }

    // Estado inicial STEP 5
    gsap.set([nombreGradientBtm, nombreGradientBg], {
        scaleY: 0
    });

    gsap.set(nombreContent, {
        autoAlpha: 0,
        filter: "blur(20px)"
    });

    gsap.set(nombreFlorGrupo, {
        yPercent: 60
    });

    // Estado inicial STEP 6
    gsap.set([pasoFlor1, pasoFlor2, pasoFlor3, pasoFlor4, pasoFlor5], {
        yPercent: 95
    });

    gsap.set(pasoContent, {
        autoAlpha: 0,
        filter: "blur(20px)"
    });

    gsap.set(pasoBtn, {
        autoAlpha: 0,
        filter: "blur(20px)"
    });

    gsap.set(pixelParts, {
        autoAlpha: 0
    });

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: sequence,
            start: "top top",
            end: "bottom bottom",
            scrub: 1.2,
            //markers: true,
            invalidateOnRefresh: true,

            snap: {
                snapTo: (progress) => {
                    const duration = tl.duration();

                    if (!duration) return progress;

                    const snapPoints = getSnapPointsFromLabels(tl, narrativeSnapLabels);

                    if (!snapPoints.length) return progress;

                    const closestPoint = gsap.utils.snap(snapPoints, progress);
                    const distance = Math.abs(closestPoint - progress);

                    const maxSnapDistance = 0.08;

                    if (distance > maxSnapDistance) {
                        return progress;
                    }

                    return closestPoint;
                },
                duration: {
                    min: 0.2, //0.45,
                    max: 1.1 //1.1
                },
                delay: 0.15,
                ease: "power4.inOut",
            },

            onEnter: () => {
                setHeaderTheme("grey");
                updateNarrativeIndicator(0, false);
                showNarrativeIndicator();
            },
            onEnterBack: () => {
                setHeaderTheme("brown");
                syncNarrativeIndicator(tl);
                showNarrativeIndicator();
            },
            onLeave: () => {
                hideNarrativeIndicator();
                setHeaderTheme("grey");
            },
            onLeaveBack: () => {
                hideNarrativeIndicator();
                setHeaderTheme("grey");
            }
        }
    });

    // STEP 1 — ANIMACIÓN
    tl.addLabel("chapter01");
    tl.call(() => setHeaderTheme("grey"), null, "chapter01");

    // tl.to(nacerGraphics, {
    //     scale: 10,
    //     duration: 2
    // });

    tl.to(nacerTxt, {
        autoAlpha: 1,
        filter: "blur(0px)",
        duration: 3
    }, "<+=0.3");

    tl.to(nacerBgWhite, {
        autoAlpha: 1,
        duration: 0.1
    }, "<=");

    tl.to({}, {
        duration: 2
    });

    //tl.addLabel("rest01");

    tl.to(nacerBgWhite, {
        scale: 30,
        duration: 4,
        ease: "sine.out"
    });

    tl.to(nacerTxt, {
        autoAlpha: 0,
        filter: "blur(20px)",
        duration: 1
    }, "<+=0.1");

    // STEP 2 — ANIMACIÓN

    tl.addLabel("chapter02", "<+=3.2");
    tl.call(() => setHeaderTheme("brown"), null, "chapter02");

    tl.to(guionLayer, {
        autoAlpha: 1,
        duration: 0.7,
        ease: "sine.out"
    }, "<-=1");
    // }, "chapter02");



    tl.to(guionGraphics, {
        y: "25vh",
        duration: 4,
    }, "<-=0.1");

    tl.addLabel("rest01");

    tl.to(guionContent, {
        autoAlpha: 1,
        duration: 4,
        filter: "blur(0px)"
    }, "<+=0.1");



    // tl.addLabel("rest01");
    // tl.addLabel("rest02");

    // tl.to({}, {
    //     duration: 1
    // });

    tl.to(guionGraphics, {
        y: 0,
        duration: 2,
        scale: 1
    });

    // tl.to({}, {
    //     duration: 2
    // });

    tl.to(shuffledPixelParts, {
        autoAlpha: 1,
        duration: 0.05,
        stagger: 0.035,
        ease: "steps(1)"
    });

    tl.addLabel("rest02");
    //tl.addLabel("rest03");

    tl.to({}, {
        duration: 4
    });


    tl.to(pixelSvg, {
        x: 300,
        duration: 4,
        ease: "sine.inOut"
    });


    tl.to(guionImage, {
        x: -470,
        duration: 4,
        ease: "sine.inOut"
    }, "<=");

    tl.addLabel("rest03");

    tl.to(nacerLayer, {
        autoAlpha: 0,
        duration: 0.1,
    }, "<=");


    // STEP 3 — ANIMACIÓN
    tl.addLabel("chapter03", "<");
    tl.call(() => setHeaderTheme("grey"), null, "chapter03");


    tl.to(guionBgTransition, {
        autoAlpha: 1,
        duration: 1.5,
        ease: "sine.out"
    }, "<");

    tl.to(layer03, {
        autoAlpha: 1,
        duration: 1,
        ease: "sine.out"
    }, "<");

    tl.to(guionContent, {
        autoAlpha: 0,
        duration: 1,
        filter: "blur(50px)"
    }, "<");

    // Aparece texto step 3
    tl.to(apagaContent, {
        autoAlpha: 1,
        duration: 2,
        filter: "blur(0px)"
    }, "<+=0.1");

    // tl.addLabel("rest04");

    tl.to({}, {
        duration: 3
    });


    // Flor pixel sale de pantalla derecha
    tl.to(pixelSvg, {
        x: () => getXToExitRight(pixelSvg),
        // x: 760,
        duration: 3.5,
        ease: "power1.in",
    });

    // Flor desenfocada sale de pantalla izquierda
    tl.to(guionImage, {
        x: () => getXToExitLeft(guionImage),
        // x: -920,
        duration: 3.5,
        ease: "power1.in",
    }, "<=");


    // STEP 4 — ANIMACIÓN

    // Desaparece texto step 3
    tl.to(apagaContent, {
        autoAlpha: 0,
        duration: 2,
        filter: "blur(50px)"
    }, "<+=0.1");

    // Aparece fondo morado + texto
    tl.addLabel("chapter04");
    tl.call(() => setHeaderTheme("grey"), null, "chapter04");

    tl.to(layer04, {
        autoAlpha: 1,
        duration: 3.3,
        ease: "sine.out"
    }, "<-=1.2");

    tl.addLabel("rest04");

    //tl.addLabel("rest05");

    // Pausa
    tl.to({}, {
        duration: 3
    });

    // Aparece esfera marrón
    tl.to(juicioBrownSphere, {
        autoAlpha: 1,
        scale: 5,
        duration: 3,
        filter: "blur(1px)",
        ease: "sine.out"
    });

    //tl.addLabel("rest06");
    // Pausa
    tl.to({}, {
        duration: 3
    });

    // Esfera marrón ocupa toda la pantalla
    tl.to(juicioBrownSphere, {
        autoAlpha: 1,
        scale: 65,
        duration: 4,
        filter: "blur(2px)",
        ease: "sine.out"
    });

    // Desaparece texto step 4
    tl.to(juicioContent, {
        autoAlpha: 0,
        duration: 1,
        filter: "blur(15px)"
    }, "<+=0.1");


    // STEP 5 — ANIMACIÓN
    tl.addLabel("chapter05");
    tl.call(() => setHeaderTheme("grey"), null, "chapter05");

    tl.to(layer05, {
        autoAlpha: 1,
        duration: 0.5
    }, "<-=1.7");

    tl.to(nombreGradientBtm, {
        scaleY: 1,
        duration: 2
    }, "<-=0.1");

    tl.to(nombreFlorGrupo, {
        yPercent: 0,
        duration: 5,
        ease: "sine.out"
    }, "<=+0.1");

    tl.addLabel("rest05");

    tl.to(layer04, {
        autoAlpha: 0,
        duration: 0.1
    }, "<=");

    tl.to(nombreContent, {
        autoAlpha: 1,
        duration: 3,
        filter: "blur(0px)"
    }, "<-=0.2");

    // tl.addLabel("rest03");
    // tl.addLabel("rest07");
    // Pausa
    tl.to({}, {
        duration: 3
    });

    tl.to(nombreGradientBg, {
        scaleY: 3,
        duration: 8,
        ease: "power4.in",
    });

    tl.to([nombreFlorHblur, nombreFlorMblur], {
        autoAlpha: 0,
        duration: 8,
        ease: "power4.in",
    }, "<=");

    //tl.addLabel("rest08");
    // Pausa

    tl.to(nombreContent, {
        autoAlpha: 0,
        duration: 3,
        filter: "blur(15px)"
    }, "<+=6.5");


    // STEP 6 — ANIMACIÓN
    tl.addLabel("chapter06");
    tl.call(() => setHeaderTheme("grey"), null, "chapter06");

    tl.to(layer06, {
        autoAlpha: 1,
        duration: 0.1
    }, "<=");

    tl.to(pasoContent, {
        autoAlpha: 1,
        filter: "blur(0px)",
        duration: 3
    }, "<-=0.4");

    tl.to(pasoFlor2, {
        yPercent: 0,
        duration: 5,
        ease: "power3.out",
    });

    tl.to(pasoFlor3, {
        yPercent: 0,
        duration: 5,
        ease: "power3.out",
    }, "<+=0.5");

    tl.to(pasoFlor4, {
        yPercent: 0,
        duration: 5,
        ease: "power3.out",
    }, "<+=0.7");

    tl.to(pasoFlor1, {
        yPercent: 0,
        duration: 5,
        ease: "power3.out",
    }, "<+=0.7");


    tl.to(pasoFlor5, {
        yPercent: 0,
        duration: 6,
        ease: "power3.out",
    }, "<+=0.5");

    tl.to(pasoBtn, {
        autoAlpha: 1,
        filter: "blur(0px)",
        duration: 3
    }, "<+=0.5");

    // Pausa
    //tl.addLabel("rest09");
    tl.to({}, {
        duration: 4
    });

    tl.eventCallback("onUpdate", () => {
        syncNarrativeIndicator(tl);
    });
}



// INIT

async function initApp() {
    await loadIncludes();

    const heroButtonLoop = initHeroButtonAnimation();

    initFaqsMore();
    initFaqsAccordion();

    initHeroIntroMessages();
    initHeroAnimation(heroButtonLoop);
    initNarrativeSequence();
    initHeaderThemeSections();

    requestAnimationFrame(() => {
        ScrollTrigger.refresh();
    });
}

initApp();