/* ARCHIVO PRINCIPAL DE JAVASCRIPT */

// Importar función que carga reutilizables (header / footer)
import { loadIncludes } from "./includes.js";

// ░░░░░░░░ SCROLL RESTORATION
// Evita que navegador restaure una posición de scroll anterior
if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
}

// Forzar scroll arriba al recargar / salir
window.addEventListener("beforeunload", () => {
    window.scrollTo(0, 0);
});

// ░░░░░░░░ FAQS — VER MÁS
// Desplegar preguntas frecuentes ocultas y eliminar "+"
// Transición suave
// Refresh ScrollTrigger por cambio de altura de la pág.
function initFaqsMore() {
    const moreButton = document.querySelector(".btn-more");
    const extraFaqs = document.querySelector(".faqs_more");

    if (!moreButton || !extraFaqs) return;

    const extraFaqItems = extraFaqs.querySelectorAll(".dropdown_faqs");

    moreButton.addEventListener("click", () => {
        moreButton.disabled = true;

        const buttonHeight = moreButton.offsetHeight;
        const buttonMarginTop = gsap.getProperty(moreButton, "marginTop");

        // --> GSAP.SET
        // Botón "+"
        gsap.set(moreButton, {
            height: buttonHeight,
            marginTop: buttonMarginTop,
            overflow: "hidden"
        });

        extraFaqs.hidden = false;

        // Bloque FAQs extra
        gsap.set(extraFaqs, {
            height: 0,
            marginTop: 0,
            overflow: "hidden",
            autoAlpha: 1
        });

        // Items FAQs extra
        gsap.set(extraFaqItems, {
            autoAlpha: 0,
            y: 24,
            filter: "blur(10px)"
        });

        const extraFaqsHeight = extraFaqs.scrollHeight;

        /// --> TIMELINE
        const tl = gsap.timeline({
            onComplete: () => {
                moreButton.hidden = true;

                gsap.set(extraFaqs, {
                    height: "auto",
                    overflow: "visible"
                });

                ScrollTrigger.refresh();
            }
        });

        // 1. Desaparece botón
        tl.to(moreButton, {
            autoAlpha: 0,
            y: 18,
            filter: "blur(8px)",
            duration: 0.45,
            ease: "power3.out"
        });

        // 2. Desaparece espacio botón suave
        tl.to(moreButton, {
            height: 0,
            marginTop: 0,
            paddingTop: 0,
            paddingBottom: 0,
            borderWidth: 0,
            duration: 0.45,
            ease: "power2.inOut"
        }, "<+=0.1");

        // 3. Aparece espacio nuevas FAQs
        tl.to(extraFaqs, {
            height: extraFaqsHeight,
            marginTop: "var(--sp-s)",
            duration: 0.75,
            ease: "power2.inOut"
        }, "<");

        // 4. Entran nuevas FAQs
        tl.to(extraFaqItems, {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 1,
            ease: "power3.out",
            stagger: {
                each: 0.08,
                from: "start"
            }
        }, "<+=0.2");
    });
}

// ░░░░░░░░ FAQS — ACCORDION
// Gestiona apertura y cierre de cada pregunta
// 1 FAQ abierta al mismo tiempo
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

        // --> GSAP.SET
        // Respuestas cerradas
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

            // Cierra otra FAQ abierta
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

            // Si FAQ actual estaba abierta, la cerramos
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

            // Abrir FAQ seleccionada 
            gsap.to(answer, {
                height: answerHeight,
                autoAlpha: 1,
                duration: 0.65,
                ease: "power2.inOut"
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

// ░░░░░░░░ SHUFFLE ARRAY
// Piezas SVG pixelado (paso 03. narrativa) aparezcan aleatorias
function shuffleArray(array) {
    const arr = [...array];

    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    return arr;
}

// ░░░░░░░░ GSAP — PLUGINS
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// ░░░░░░░░ LOAD INICIAL — MENSAJE
// Lógica para mostrar load según intervalo definido
// Ojo: valor actual en código = 0.1 min
function shouldShowFullIntro() {
    const introLastSeen = localStorage.getItem("cnomIntroLastSeen");
    const now = Date.now();
    const thirtyMinutes = 0.2 * 60 * 1000;

    if (!introLastSeen) return true;

    return now - Number(introLastSeen) > thirtyMinutes;
}

// Guardar momento en que usuario ha visto intro
function saveIntroSeenTime() {
    localStorage.setItem("cnomIntroLastSeen", Date.now());
}

// ░░░░░░░░ RESIZE 
// Refresh ScrollTrigger x cambio ancho de ventana
// Evitar refresh móvil x cambio de altura
// Al aparecer / desaparecer barra del navegador

function initResizeRefresh() {
    let resizeTimer;
    let lastWidth = window.innerWidth;

    window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);

        resizeTimer = setTimeout(() => {
            const currentWidth = window.innerWidth;

            // Evita refrescar por cambios de altura en móvil
            if (currentWidth === lastWidth) return;

            lastWidth = currentWidth;

            ScrollTrigger.refresh(true);
        }, 250);
    });
}

// ░░░░░░░░ HERO 1 — INTRO INICIAL
// 1. Mensajes iniciales (load)
// 2. Revelar + animación Hero

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
    const shouldAnimateHeader = !isSwupNavigation;

    /// --> SPLIT TEXT
    const heroH1Split = new SplitText(heroH1, {
        type: "words,chars",
        wordsClass: "word",
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


    /// --> GSAP.SET
    gsap.set(introMessages, {
        autoAlpha: 1
    });

    gsap.set([introMessage01, introMessage02, introSource], {
        autoAlpha: 1,
        filter: "none"
    });

    gsap.set(introMessage01Split.lines, {
        autoAlpha: 0,
        y: 18,
        filter: "blur(10px)"
    });

    gsap.set(introMessage02Words, {
        autoAlpha: 0,
        y: 18,
        filter: "blur(10px)"
    });

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

    gsap.set(".hero-state--two", {
        autoAlpha: 0,
        visibility: "hidden"
    });

    gsap.set(heroGradient, {
        autoAlpha: 0,
        filter: "none"
    });

    gsap.set(heroPct, {
        autoAlpha: 0
    });

    gsap.set([headerLogo, headerCenter, headerRight], {
        autoAlpha: shouldAnimateHeader ? 0 : 1,
        y: shouldAnimateHeader ? 0 : 0
    });

    const progressCounter = {
        value: 0
    };

    introProgress.textContent = "0%";

    /// --> TIMELINE HERO V1 (LARGA)
    // Secuencia intro completa
    const tl = gsap.timeline();

    if (showFullIntro) {
        saveIntroSeenTime();

        // Pausa inicial antes 1º mensaje
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

        // Entra porcentaje 
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
            duration: 3
        });

        // Sale mensaje 1 por líneas
        tl.to(introMessage01Split.lines, {
            autoAlpha: 0,
            y: 18,
            filter: "blur(10px)",
            duration: 1.5,
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
            duration: 10.2,
            ease: "slow(0.7,0.7,false)",
            onUpdate: () => {
                introProgress.textContent = `${Math.round(progressCounter.value)}%`;
            }
        }, "<");

        // Desaparece 1º parte mensaje 2
        tl.to(introMessage02SecondarySplit.words, {
            autoAlpha: 0,
            y: 18,
            filter: "blur(15px)",
            duration: 2.3,
            ease: "power3.out",
            stagger: {
                each: 0.015,
                from: "start"
            }
        }, "<+=7");

        // Sale fuente y porcentaje
        tl.to([introSourceSplit.lines, introProgress], {
            autoAlpha: 0,
            y: 10,
            filter: "blur(8px)",
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.04
        }, "<+=2.5");

        // Desaparece 2º parte mensaje 2
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
        // Si intro vista recientemente
        // Carga directa Hero sin mensajes
        tl.set([
            introMessage01Split.lines,
            introMessage02Words,
            introSourceSplit.lines,
            introProgress
        ], {
            autoAlpha: 0
        });

        // Pausa
        tl.to({}, {
            duration: 0.35
        });
    }

    /// --> SET
    // Ocultar capa intro
    tl.set(introMessages, {
        autoAlpha: 0,
        pointerEvents: "none"
    });


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
        autoAlpha: shouldAnimateHeader ? 0 : 1,
        y: shouldAnimateHeader ? -8 : 0
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

    // Quitamos clase para que el CSS deje de bloquear el hero/header
    tl.call(() => {
        document.body.classList.remove("is-intro-active");
    });

    /// --> TIMELINE HERO V2 (CORTA)

    // 1. Aparece H1 por caracteres
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

    // 2. Aparece menú si la carga no viene interna por SWUP
    if (shouldAnimateHeader) {
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
    } else {
        tl.set([headerLogo, headerCenter, headerRight], {
            autoAlpha: 1,
            y: 0
        }, "<+=0.45");
    }
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

    // 5. Desbloquea scroll cuando intro ha terminado
    tl.call(() => {
        document.body.classList.remove("is-scroll-locked");
    });
}

// ░░░░░░░░ HERO 2 — PRINCIPAL
// Estado 1 → Estado 2
function initHeroAnimation() {
    const hero = document.querySelector(".hero");

    if (!hero) return;

    const heroH2Element = document.querySelector(".hero-state--two .hf-l");

    if (!heroH2Element) return;

    /// --> SPLIT TEXT
    const heroH2 = new SplitText(heroH2Element, {
        type: "lines",
        linesClass: "line"
    });

    const heroTxt = document.querySelector(".hero-state--two .txt-block");
    const heroTxtParagraphs = document.querySelectorAll(".hero-state--two .txt-block p");
    const heroIntro = document.querySelector(".hero-state--one .intro");
    const heroH1Chars = gsap.utils.toArray(".hero-state--one h1 .char");

    if (!heroTxt || !heroIntro) return;

    /// --> MATCH MEDIA
    // Animación común con ajustes específicos Desk / Tab / Mob
    const mm = gsap.matchMedia();

    mm.add({
        isMobile: "(max-width:1279px)",
        isDesktop: "(min-width:1280px)"
    }, (context) => {
        const { isDesktop } = context.conditions;

        const heroPct = document.querySelectorAll(".hero-pct");
        const heroPctMain = document.querySelector(".hero-pct");
        const heroBrownGradient = document.querySelector(".hero-brown-transition__gradient");

        const heroBrownSolid = document.querySelector(".hero-brown-transition__solid");

        let girlYToCenter = "-18vh";
        let desktopGradientScale = 3;

        /// --> SET
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

        if (heroBrownGradient) {
            gsap.set(heroBrownGradient, {
                yPercent: 100,
                autoAlpha: 1,
                scaleX: 1.2,
                scaleY: 1,
                filter: "blur(0px)"
            });
        }

        /// --> CÁLCULOS RESPONSIVE
        // Cálculo dinámico en escritorio: imagen principal al centro
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

        /// --> TIMELINE HERO 2
        // ScrollTrigger controla transición Hero 1 → Hero 2
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: ".hero",
                start: "top top",
                end: "bottom bottom",
                scrub: 1.2,

                // Snap solo escritorio entre puntos de descanso del hero
                snap: isDesktop ? {
                    snapTo: (progress, self) => {
                        const duration = tl.duration();

                        if (!duration) return progress;

                        const snapPoints = [
                            tl.labels.heroRest01 / duration,
                            tl.labels.heroRest02 / duration
                        ].filter((point) => Number.isFinite(point));

                        if (!snapPoints.length) return progress;

                        const direction = self.direction;

                        const previousPoint = [...snapPoints]
                            .reverse()
                            .find((point) => point < progress);

                        const nextPoint = snapPoints
                            .find((point) => point > progress);

                        const fallbackPoint = gsap.utils.snap(snapPoints, progress);

                        const targetPoint = direction > 0
                            ? nextPoint ?? fallbackPoint
                            : previousPoint ?? fallbackPoint;

                        const distance = Math.abs(targetPoint - progress);

                        const maxSnapDistanceForward = 0.55;
                        const maxSnapDistanceBackward = 0.35;

                        const maxSnapDistance = direction > 0
                            ? maxSnapDistanceForward
                            : maxSnapDistanceBackward;

                        if (distance > maxSnapDistance) {
                            return progress;
                        }

                        return targetPoint;
                    },
                    duration: {
                        min: 1.4,
                        max: 2.4
                    },
                    delay: 0.04,
                    ease: "sine.inOut"
                } : false,

                // Al avanzar suficiente, empuja scroll hacia inicio narrativa
                onUpdate: isDesktop ? (self) => {

                    if (self.progress >= 0.75 && self.direction === 1 && !self._hasSnapped) {
                        self._hasSnapped = true;

                        const narrativeTarget = document.querySelector("#narrative-step__1");

                        if (narrativeTarget) {
                            const targetY = narrativeTarget.offsetTop + window.innerHeight * 0.35;

                            gsap.to(window, {
                                scrollTo: {
                                    y: targetY,
                                    autoKill: false
                                },
                                duration: 2.5,

                                ease: "power2.inOut",
                                overwrite: true
                            });
                        }
                    }

                    if (self.progress < 0.75) {
                        self._hasSnapped = false;
                    }
                } : null
            }
        });

        tl.addLabel("heroRest01");

        // 1. Sale H1 inicial
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

        // 2. Reposiciona imagen principal
        tl.to(".hero-pct", {
            scale: isDesktop ? 0.65 : 1,
            y: isDesktop ? girlYToCenter : 0,
            duration: 3,
            ease: "sine.inOut"
        }, "<-=0.1");

        // 3. Escala degradado inferior del hero
        tl.fromTo(".hero-gradient__strong",
            {
                scaleY: isDesktop ? 0.25 : 0.35,
                yPercent: isDesktop ? 10 : 65
            },
            {
                scaleY: isDesktop ? desktopGradientScale : 1.45,
                yPercent: isDesktop ? 8 : 28,
                duration: isDesktop ? 3 : 5,
                ease: "sine.inOut"
            },
            "<"
        );
        // 4. Sale texto inferior del primer estado
        tl.to(heroIntro, {
            autoAlpha: 0,
            filter: "blur(7px)",
            duration: 3
        }, "<");

        // 5. Activa segundo estado del hero
        tl.to(".hero-state--two", {
            autoAlpha: 1,
            visibility: "visible",
            duration: 0.1
        }, "<=");

        // 6. Entra H2 por líneas
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
        }, isDesktop ? "<+=0.9" : "<+=2");


        // 7. Entran textos del segundo estado
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
        }, isDesktop ? "<+=0.6" : "<+=1.2");


        let heroButtonDelayCall = null;

        // 8. Entra botón explorar
        tl.to(isDesktop ? ".btn-hero--desktop" : ".btn-hero--mobile", {
            autoAlpha: 1,
            duration: 0.9
        }, "<+=0.5");

        tl.addLabel("heroRest02");

        tl.to({}, {
            duration: 2
        });

        // 9. Entra transición marrón sólida
        tl.to(heroBrownSolid, {
            yPercent: 0,
            duration: 2,
        }, "<=0.3");

        if (heroBrownGradient) {
            // 10. Entra transición marrón degradada
            tl.to(heroBrownGradient, {
                yPercent: isDesktop ? 0 : 49,
                duration: isDesktop ? 3 : 3,
                ease: "sine.inOut",
                filter: isDesktop ? "blur(20px)" : "blur(10px)",
            }, "<=0.3");
        }
    });
}

// ░░░░░░░░ HERO CTA — SCROLL A NARRATIVA
// Click botón explorar → scroll suave a narrativa
function initHeroCtaScroll() {
    const heroButtons = document.querySelectorAll(".btn-hero");

    if (!heroButtons.length) return;

    heroButtons.forEach((btnHero) => {
        if (btnHero.dataset.heroCtaBound === "true") return;

        btnHero.dataset.heroCtaBound = "true";

        btnHero.addEventListener("click", (event) => {
            event.preventDefault();

            const narrativeTarget = document.querySelector("#narrative-step__1");

            if (!narrativeTarget) return;

            const targetY = narrativeTarget.offsetTop + window.innerHeight * 0.90;

            gsap.killTweensOf(window);

            gsap.to(window, {
                scrollTo: {
                    y: targetY,
                    autoKill: false
                },
                duration: 1.8,
                ease: "power2.inOut",
                overwrite: true
            });
        });
    });
}

// ░░░░░░░░ HEADER — THEME
// ░░ Gestiona cambio de color header / logo según sección
function setHeaderTheme(theme = "grey") {
    const allowedThemes = ["grey", "brown"];
    const safeTheme = allowedThemes.includes(theme) ? theme : "grey";

    const isBrown = safeTheme === "brown";

    document.body.classList.toggle("header-is-brown", isBrown);
    document.body.classList.toggle("header-is-grey", !isBrown);

    updateHeaderLogoTheme(safeTheme);
}

// ░░ Actualiza src de logos según theme activo
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

// ░░ Define theme inicial según página actual
function setInitialHeaderThemeForPage() {
    const page = document.body.dataset.page;

    if (page === "herramienta") {
        setHeaderTheme("brown");
        return;
    }

    setHeaderTheme("grey");
}

// ░░ En home, click logo recarga para reiniciar experiencia
function initHomeLogoReload() {
    const logoLink = document.querySelector("a.logo");

    if (!logoLink) return;

    logoLink.addEventListener("click", (event) => {
        const isHomePage =
            document.body.dataset.page === "home" ||
            window.location.pathname === "/" ||
            window.location.pathname.endsWith("/index.html");

        if (!isHomePage) return;

        event.preventDefault();
        event.stopImmediatePropagation();

        window.location.reload();
    }, true);
}

// ░░░░░░░░ HEADER — THEME SECTIONS
// Cambia theme header al entrar / salir de secciones con data-header-theme
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

// ░░░░░░░░ NARRATIVA — SECUENCIA COMPLETA
// Control 6 pasos narrativa
function initNarrativeSequence() {
    const sequence = document.querySelector(".narrative-sequence--all");

    if (!sequence) return;

    /// --> SELECTORES LAYERS
    const nacerLayer = sequence.querySelector(".narrative-layer--01");
    const guionLayer = sequence.querySelector(".narrative-layer--02");
    const layer03 = sequence.querySelector(".narrative-layer--03");
    const layer04 = sequence.querySelector(".narrative-layer--04");
    const layer05 = sequence.querySelector(".narrative-layer--05");
    const layer06 = sequence.querySelector(".narrative-layer--06");


    /// --> INDICADOR NARRATIVA
    const indicator = document.querySelector(".indicator");
    const indicatorCurrent = document.querySelector(".indicator__current");
    const indicatorTitle = document.querySelector(".indicator__title");
    const indicatorTotal = document.querySelector(".indicator__total");

    const narrativeSteps = gsap.utils.toArray(sequence.querySelectorAll(".narrative-step"));

    let activeIndicatorIndex = -1;

    const indicatorBrownSteps = [1, 4, 5];

    // ░ Mostrar indicador al entrar en narrativa
    function showNarrativeIndicator() {
        if (!indicator) return;

        gsap.to(indicator, {
            autoAlpha: 1,
            duration: 0.45,
            ease: "power2.out",
            overwrite: true
        });
    }

    // ░ Ocultar indicador al salir de narrativa
    function hideNarrativeIndicator() {
        if (!indicator) return;

        gsap.to(indicator, {
            autoAlpha: 0,
            duration: 0.35,
            ease: "power2.out",
            overwrite: true
        });
    }

    // ░ Actualizar número / título del indicador según paso activo
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

        /// --> TIMELINE INDICADOR
        const tl = gsap.timeline();

        // 1. Sale dato actual
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

        // 2. Cambia contenido del indicador
        tl.call(() => {
            updateNarrativeIndicatorColor(index);

            indicatorCurrent.textContent = nextCurrent;
            indicatorTitle.textContent = nextTitle;

            gsap.set(changingItems, {
                y: 7,
                filter: "blur(4px)"
            });
        });

        // 3. Entra nuevo dato
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

    // ░ Cambia color indicador según paso narrativo
    function updateNarrativeIndicatorColor(index) {
        if (!indicator) return;

        const shouldBeBrown = indicatorBrownSteps.includes(index);

        indicator.classList.toggle("is-brown", shouldBeBrown);
    }


    // ░ Sincroniza indicador con labels de la timeline
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

    /// ░ --> SNAP POINTS
    function getSnapPointsFromLabels(timeline, labels) {
        if (!timeline || !labels.length) return [];

        const duration = timeline.duration();

        if (!duration) return [];

        return labels
            .map((label) => timeline.labels[label] / duration)
            .filter((point) => Number.isFinite(point));
    }


    /// ░ --> CÁLCULOS SALIDA FLORES
    // Cálculo responsive para sacar flores pantalla (paso 03-04)
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


    /// --> SET INICIAL INDICADOR
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
    const apagaContent = sequence.querySelectorAll(".narrative-layer--03 .txt-block__center p");

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
    const pasoGradientTool = sequence.querySelector(".narrative-layer--06 .step--6_gradient__tool");

    const pasoContent = sequence.querySelector(".narrative-layer--06 .step--06__content");
    const pasoBtn = sequence.querySelector(".narrative-layer--06 .btn");

    // Luces Step 05 / 06
    const allFlowersLights = gsap.utils.toArray(".step--05_luz, .step--06-luz");

    const flowerLightPairs = [
        {
            triggerLight: ".step--06-luz-1",
            centralLight: ".step--05_luz-1"

        },
        {
            triggerLight: ".step--06-luz-4",
            centralLight: ".step--05_luz-2"
        },
        {
            triggerLight: ".step--06-luz-2",
            centralLight: ".step--05_luz-5"
        },
        {
            triggerLight: ".step--06-luz-3",
            centralLight: ".step--05_luz-3"
        },
        {
            triggerLight: ".step--06-luz-5",
            centralLight: ".step--05_luz-4"
        },
    ]

    const flowerLightsLoop = gsap.timeline({
        paused: true,
        repeat: -1
    });

    flowerLightPairs.forEach((pair) => {
        const currentLights = [pair.triggerLight, pair.centralLight];

        // 1. Aparece primero la luz del step 6
        flowerLightsLoop.to(pair.triggerLight, {
            autoAlpha: 1,
            scale: 1.25,
            duration: 1.8,
            ease: "sine.inOut",
            filter: "blur(1px)"
        });

        // 2. Aparece la luz central (flor step 5)
        flowerLightsLoop.to(pair.centralLight, {
            autoAlpha: 1,
            scale: 1.25,
            duration: 1.8,
            ease: "sine.inOut",
            filter: "blur(1px)"
        }, "<+=0.6");

        // 3. Ambas se quedan encendidas un momento
        flowerLightsLoop.to({}, {
            duration: 0.8
        });

        // 4. Se apaga la pareja completa
        flowerLightsLoop.to(currentLights, {
            autoAlpha: 0,
            scale: 0.75,
            duration: 1.8,
            ease: "sine.inOut",
            filter: "blur(0px)"
        });

    });

    // Cierre loop: apagar última pareja antes de reiniciar
    const lastPair = flowerLightPairs[flowerLightPairs.length - 1];
    const lastLights = [lastPair.triggerLight, lastPair.centralLight];

    flowerLightsLoop.to(lastLights, {
        autoAlpha: 0,
        scale: 0.75,
        duration: 1,
        ease: "sine.inOut"
    });

    flowerLightsLoop.to({}, {
        duration: 0.35
    });

    // Labels para snap narrativo escritorio
    const narrativeSnapLabels = [
        "rest01",
        "rest02",
        "rest03",
        "rest04",
        "rest05",
        "rest06",
        "rest07",
        "rest08",
        "rest09",
        "rest10",
    ];

    if (!nacerLayer || !guionLayer || !nacerGraphics.length || !nacerTxt || !guionGraphics || !guionContent) return;

    /// ░ --> GSAP.SET NARRATIVA
    // Estado inicial común antes de crear timeline desktop / mobile
    function setInitialNarrativeState(isDesktop) {
        // Indicador
        if (indicator) {
            gsap.set(indicator, {
                autoAlpha: 0
            });
        }

        activeIndicatorIndex = -1;
        updateNarrativeIndicator(0, false);

        gsap.set([indicatorCurrent, indicatorTitle], {
            willChange: "transform, opacity, filter"
        });

        // Capas principales
        gsap.set(nacerLayer, {
            autoAlpha: 1
        });

        gsap.set([guionLayer, layer03, layer04, layer05, layer06], {
            autoAlpha: 0
        });

        // Step 01
        gsap.set(nacerGraphics, {
            transformOrigin: "50% 50%",
            scale: 1,
            force3D: false
        });

        gsap.set(nacerBgWhite, {
            autoAlpha: 0,
            scale: 1,
            filter: "blur(2px)",
            transformOrigin: "50% 50%"
        });

        gsap.set(nacerTxt, {
            autoAlpha: isDesktop ? 0 : 1,
            filter: isDesktop ? "blur(10px)" : "blur(0px)"
        });

        // Step 02
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

        if (pixelSvg) {
            gsap.set(pixelSvg, {
                autoAlpha: 1
            });
        }

        gsap.set(pixelParts, {
            autoAlpha: 0
        });

        // Step 03
        gsap.set(apagaContent, {
            autoAlpha: 0,
            filter: "blur(25px)"
        });



        gsap.set(juicioBrownSphere, {
            autoAlpha: 0,
            scale: 0,
            filter: "blur(0px)"
        });



        // Step 05
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



        // Step 06
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

        gsap.set(pasoGradientTool, {
            scaleY: 0
        });

        gsap.set(allFlowersLights, {
            autoAlpha: 0,
            visibility: "hidden",
            transformOrigin: "center center",
            scale: 0.75
        });
    }

    /// ░ --> TIMELINE NARRATIVA — DESKTOP
    // Secuencia con scrub + snap por puntos de descanso
    function initNarrativeDesktop() {

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: sequence,
                start: "top top",
                end: "bottom bottom",
                scrub: 1.2,
                invalidateOnRefresh: true,

                // Snap escritorio a labels rest01...rest10
                snap: {
                    snapTo: (progress, self) => {
                        const duration = tl.duration();

                        if (!duration) return progress;

                        const snapPoints = getSnapPointsFromLabels(tl, narrativeSnapLabels);

                        if (!snapPoints.length) return progress;

                        const direction = self.direction;

                        const previousPoint = [...snapPoints]
                            .reverse()
                            .find((point) => point < progress);

                        const nextPoint = snapPoints
                            .find((point) => point > progress);

                        const fallbackPoint = gsap.utils.snap(snapPoints, progress);

                        const targetPoint = direction > 0
                            ? nextPoint ?? fallbackPoint
                            : previousPoint ?? fallbackPoint;

                        const distance = Math.abs(targetPoint - progress);

                        const maxSnapDistanceForward = 0.25;
                        const maxSnapDistanceBackward = 0.15;

                        const maxSnapDistance = direction > 0
                            ? maxSnapDistanceForward
                            : maxSnapDistanceBackward;

                        if (distance > maxSnapDistance) {
                            return progress;
                        }

                        return targetPoint;
                    },
                    duration: {
                        min: 2,
                        max: 2.5
                    },
                    delay: 0.12,
                    ease: "sine.inOut"
                },

                onEnter: () => {
                    setHeaderTheme("grey");
                    updateNarrativeIndicator(0, false);
                    showNarrativeIndicator();
                },
                onEnterBack: () => {
                    setHeaderTheme("grey");
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

        // ░ Ajusta color header según dirección del scroll
        function setHeaderThemeByDirection(forwardTheme, backwardTheme) {
            const direction = tl.scrollTrigger ? tl.scrollTrigger.direction : 1;

            setHeaderTheme(direction === -1 ? backwardTheme : forwardTheme);
        }

        // -> STEP 1 — NACER
        tl.addLabel("chapter01");
        tl.call(() => setHeaderThemeByDirection("grey", "grey"), null, "chapter01");

        // 1. Entra texto Step 1
        tl.to(nacerTxt, {
            autoAlpha: 1,
            filter: "blur(0px)",
            duration: 2
        }, "<+=0.3");

        tl.to({}, {
            duration: 1.5
        });

        // 2. Aparece esfera blanca
        tl.to(nacerBgWhite, {
            autoAlpha: 1,
            duration: 0.15,
            ease: "sine.out"
        });

        tl.addLabel("rest01");

        // 3. Esfera blanca invade pantalla
        tl.to(nacerBgWhite, {
            scale: 30,
            duration: 6,
            ease: "sine.out"
        });

        // 4. Sale texto Step 1
        tl.to(nacerTxt, {
            autoAlpha: 0,
            filter: "blur(20px)",
            duration: 1
        }, "<+=0.1");

        // -> STEP 2 — GUIÓN
        tl.addLabel("chapter02", "<+=3.2");
        tl.call(() => setHeaderThemeByDirection("brown", "grey"), null, "chapter02");

        // 1. Activa capa Step 2
        tl.to(guionLayer, {
            autoAlpha: 1,
            duration: 2,
            ease: "sine.out"
        }, "<+=1");
        // }, "chapter02");


        // 2. Sube gráfico Step 2
        tl.to(guionGraphics, {
            y: "25vh",
            duration: 6,
        }, "<-=0.1");

        tl.addLabel("rest02");

        // 3. Entra texto Step 2
        tl.to(guionContent, {
            autoAlpha: 1,
            duration: 4,
            filter: "blur(0px)"
        }, "<+=0.1");

        // 4. Gráfico ocupa posición final
        tl.to(guionGraphics, {
            y: 0,
            duration: 6,
            scale: 1
        });

        // 5. Aparece SVG pixelado por piezas
        tl.to(shuffledPixelParts, {
            autoAlpha: 1,
            duration: 0.01,
            stagger: 0.05,
            ease: "steps(1)"
        });

        tl.addLabel("rest03");


        tl.to({}, {
            duration: 2
        });


        // 6. Desplaza flor pixel inicial
        tl.to(pixelSvg, {
            x: 300,
            duration: 5,
            ease: "sine.out",
        });


        // 7. Desplaza flor desenfocada inicial
        tl.to(guionImage, {
            x: -470,
            duration: 5,
            ease: "sine.out",
        }, "<=");

        tl.addLabel("rest04");

        tl.to(nacerLayer, {
            autoAlpha: 0,
            duration: 0.1,
        }, "<=");


        // -> STEP 3 — APAGA
        tl.addLabel("chapter03", "<");
        tl.call(() => setHeaderThemeByDirection("grey", "brown"), null, "chapter03");


        // 1. Entra transición de fondo
        tl.to(guionBgTransition, {
            autoAlpha: 1,
            duration: 1.5,
            ease: "sine.out"
        }, "<");

        // 2. Activa capa Step 3
        tl.to(layer03, {
            autoAlpha: 1,
            duration: 1,
            ease: "sine.out"
        }, "<");

        // 3. Sale texto Step 2
        tl.to(guionContent, {
            autoAlpha: 0,
            duration: 1,
            filter: "blur(50px)"
        }, "<");

        // Aparece texto step 3
        tl.to(apagaContent, {
            autoAlpha: 1,
            duration: 2,
            filter: "blur(0px)",
            stagger: {
                each: 0.2,
                from: "start"
            }
        }, "<+=0.1");

        tl.to({}, {
            duration: 1.5
        });


        // Flor pixel sale de pantalla derecha
        tl.to(pixelSvg, {
            x: () => getXToExitRight(pixelSvg),
            duration: 5.5,
            ease: "power1.in",
        });

        // Flor desenfocada sale de pantalla izquierda
        tl.to(guionImage, {
            x: () => getXToExitLeft(guionImage),
            duration: 5.5,
            ease: "power1.in",
        }, "<=");


        // -> STEP 4 — JUICIO

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

        tl.addLabel("rest05");

        // Pausa
        tl.to({}, {
            duration: 2
        });

        // Aparece esfera marrón
        tl.to(juicioBrownSphere, {
            autoAlpha: 1,
            scale: 5,
            duration: 3,
            filter: "blur(1px)",
            ease: "sine.out"
        });

        tl.addLabel("rest06");

        tl.to({}, {
            duration: 2
        });

        // Esfera marrón ocupa toda la pantalla
        tl.to(juicioBrownSphere, {
            autoAlpha: 1,
            scale: 65,
            duration: 5.5,
            filter: "blur(2px)",
            ease: "sine.out"
        });

        // Desaparece texto step 4
        tl.to(juicioContent, {
            autoAlpha: 0,
            duration: 1,
            filter: "blur(15px)"
        }, "<+=0.1");


        // -> STEP 5 — NOMBRE
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
            duration: 6,
            ease: "sine.out"
        }, "<=+0.1");

        tl.addLabel("rest07");

        tl.to(layer04, {
            autoAlpha: 0,
            duration: 0.1
        }, "<=");

        tl.to(nombreContent, {
            autoAlpha: 1,
            duration: 3,
            filter: "blur(0px)"
        }, "<-=0.2");

        // Pausa
        tl.to({}, {
            duration: 2
        });

        tl.to(nombreGradientBg, {
            scaleY: 3,
            duration: 4,
            ease: "power4.in",
        });

        tl.to([nombreFlorHblur, nombreFlorMblur], {
            autoAlpha: 0,
            duration: 4,
            ease: "power4.in",
        }, "<=");

        // Pausa

        tl.to(nombreContent, {
            autoAlpha: 0,
            duration: 3,
            filter: "blur(15px)"
        }, "<+=4");


        // -> STEP 6 — PASO
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

        tl.addLabel("rest08");

        tl.to(pasoFlor2, {
            yPercent: 0,
            duration: 6,
            ease: "power3.out",
        });

        tl.to(pasoFlor3, {
            yPercent: 0,
            duration: 6,
            ease: "power3.out",
        }, "<+=0.5");

        tl.to(pasoFlor4, {
            yPercent: 0,
            duration: 6,
            ease: "power3.out",
        }, "<+=0.7");

        tl.to(pasoFlor1, {
            yPercent: 0,
            duration: 6,
            ease: "power3.out",
        }, "<+=0.7");


        tl.to(pasoFlor5, {
            yPercent: 0,
            duration: 6,
            ease: "power3.out",
        }, "<+=0.7");


        tl.to(pasoBtn, {
            autoAlpha: 1,
            filter: "blur(0px)",
            duration: 3
        }, "<+=0.5");

        tl.addLabel("flowerLights");

        tl.to({}, {
            duration: 0.5
        });

        tl.addLabel("rest09");

        let hasStartedFlowerLightsLoop = false;
        let flowerLightsFadeOutTween = null;

        // ░ Reiniciar / apagar loop luces flores
        function stopFlowerLightsLoop() {
            if (!hasStartedFlowerLightsLoop) return;

            hasStartedFlowerLightsLoop = false;

            flowerLightsLoop.pause();

            if (flowerLightsFadeOutTween) {
                flowerLightsFadeOutTween.kill();
            }

            flowerLightsFadeOutTween = gsap.to(allFlowersLights, {
                autoAlpha: 0,
                scale: 0.45,
                filter: "blur(8px)",
                duration: 1.4,
                ease: "sine.inOut",
                overwrite: "auto",
                onComplete: () => {
                    flowerLightsLoop.pause(0);

                    gsap.set(allFlowersLights, {
                        autoAlpha: 0,
                        scale: 0.75,
                        filter: "blur(0px)"
                    });

                    flowerLightsFadeOutTween = null;
                }
            });
        }
        tl.call(() => {
            if (hasStartedFlowerLightsLoop) return;

            if (flowerLightsFadeOutTween) {
                flowerLightsFadeOutTween.kill();
                flowerLightsFadeOutTween = null;
            }

            gsap.set(allFlowersLights, {
                autoAlpha: 0,
                scale: 0.75,
                filter: "blur(0px)"
            });

            hasStartedFlowerLightsLoop = true;
            flowerLightsLoop.restart();
        }, null, "flowerLights");

        tl.eventCallback("onUpdate", () => {
            syncNarrativeIndicator(tl);

            const flowerLightsTime = tl.labels.flowerLights;

            if (typeof flowerLightsTime !== "number") return;

            if (tl.time() >= flowerLightsTime && !hasStartedFlowerLightsLoop) {
                if (flowerLightsFadeOutTween) {
                    flowerLightsFadeOutTween.kill();
                    flowerLightsFadeOutTween = null;
                }

                gsap.set(allFlowersLights, {
                    autoAlpha: 0,
                    scale: 0.75,
                    filter: "blur(0px)"
                });

                hasStartedFlowerLightsLoop = true;
                flowerLightsLoop.restart();
            }

            if (tl.time() < flowerLightsTime - 0.05) {
                stopFlowerLightsLoop();
            }
        });

        tl.to({}, {
            duration: 1.5
        });

        tl.to(pasoGradientTool, {
            scaleY: 1.5,
            duration: 3,
        });

        tl.addLabel("rest10");

        tl.to({}, {
            duration: 1
        });

    }

    /// ░ --> TIMELINE NARRATIVA — MOBILE
    // Secuencia lineal sin snap para evitar conflictos táctiles
    function initNarrativeMobile() {
        let hasStartedFlowerLightsLoop = false;
        let flowerLightsFadeOutTween = null;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: sequence,
                start: "top top",
                end: "bottom bottom",
                scrub: 1.2,
                invalidateOnRefresh: true,

                // Sin snapTo en mobile / tablet
                snap: false,

                onEnter: () => {
                    setHeaderTheme("grey");
                    updateNarrativeIndicator(0, false);
                    showNarrativeIndicator();
                },
                onEnterBack: () => {
                    setHeaderTheme("grey");
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

        function stopFlowerLightsLoop() {
            if (!hasStartedFlowerLightsLoop) return;

            hasStartedFlowerLightsLoop = false;

            flowerLightsLoop.pause();

            if (flowerLightsFadeOutTween) {
                flowerLightsFadeOutTween.kill();
            }

            flowerLightsFadeOutTween = gsap.to(allFlowersLights, {
                autoAlpha: 0,
                scale: 0.45,
                filter: "blur(8px)",
                duration: 1.4,
                ease: "sine.inOut",
                overwrite: "auto",
                onComplete: () => {
                    flowerLightsLoop.pause(0);

                    gsap.set(allFlowersLights, {
                        autoAlpha: 0,
                        scale: 0.75,
                        filter: "blur(0px)"
                    });

                    flowerLightsFadeOutTween = null;
                }
            });
        }

        // STEP 1 — NACER
        tl.addLabel("chapter01");
        tl.call(() => setHeaderTheme("grey"), null, "chapter01");

        tl.to(nacerTxt, {
            autoAlpha: 1,
            filter: "blur(0px)",
            duration: 3,
            ease: "sine.out"
        });

        tl.to({}, {
            duration: 2
        });

        // STEP 2 — GUIÓN
        tl.addLabel("chapter02");
        tl.call(() => setHeaderTheme("brown"), null, "chapter02");

        tl.to(nacerBgWhite, {
            autoAlpha: 1,
            duration: 0.2,
            ease: "sine.out"
        });

        tl.to(nacerBgWhite, {
            scale: 30,
            duration: 7,
            ease: "sine.out"
        });

        tl.to(nacerTxt, {
            autoAlpha: 0,
            filter: "blur(20px)",
            duration: 2,
            ease: "sine.out"
        }, "<+=1");

        tl.to(guionLayer, {
            autoAlpha: 1,
            duration: 2,
            ease: "sine.out"
        }, "<+=1");

        tl.to(guionGraphics, {
            y: 0,
            scale: 1,
            duration: 7,
            ease: "sine.inOut"
        }, "<");

        tl.to(guionContent, {
            autoAlpha: 1,
            filter: "blur(0px)",
            duration: 3,
            ease: "sine.out"
        }, "<+=2");

        tl.to({}, {
            duration: 2.5
        });

        // STEP 3 — APAGA
        tl.addLabel("chapter03");
        tl.call(() => setHeaderTheme("grey"), null, "chapter03");

        tl.to(shuffledPixelParts, {
            autoAlpha: 1,
            duration: 0.01,
            stagger: 0.045,
            ease: "steps(1)"
        });

        tl.to(guionBgTransition, {
            autoAlpha: 1,
            duration: 2,
            ease: "sine.out"
        }, "<+=0.5");

        tl.to(layer03, {
            autoAlpha: 1,
            duration: 1.5,
            ease: "sine.out"
        }, "<");

        tl.to(guionContent, {
            autoAlpha: 0,
            filter: "blur(40px)",
            duration: 2,
            ease: "sine.out"
        }, "<");

        tl.to(apagaContent, {
            autoAlpha: 1,
            filter: "blur(0px)",
            duration: 3,
            ease: "sine.out",
            stagger: {
                each: 0.18,
                from: "start"
            }
        }, "<+=0.5");

        tl.to({}, {
            duration: 2.5
        });

        // STEP 4 — JUICIO
        tl.addLabel("chapter04");
        tl.call(() => setHeaderTheme("grey"), null, "chapter04");

        tl.to([guionImage, pixelSvg], {
            autoAlpha: 0,
            filter: "blur(18px)",
            duration: 3,
            ease: "sine.out"
        });

        tl.to(apagaContent, {
            autoAlpha: 0,
            filter: "blur(40px)",
            duration: 2.5,
            ease: "sine.out"
        }, "<");

        tl.to(layer04, {
            autoAlpha: 1,
            duration: 3,
            ease: "sine.out"
        }, "<+=0.4");

        tl.to(juicioBrownSphere, {
            autoAlpha: 1,
            scale: 5,
            filter: "blur(1px)",
            duration: 4,
            ease: "sine.out"
        }, "<+=1.2");

        tl.to({}, {
            duration: 2.5
        });

        // STEP 5 — NOMBRE
        tl.addLabel("chapter05");
        tl.call(() => setHeaderTheme("grey"), null, "chapter05");

        tl.to(juicioBrownSphere, {
            autoAlpha: 1,
            scale: 65,
            filter: "blur(2px)",
            duration: 7,
            ease: "sine.out"
        });

        tl.to(layer05, {
            autoAlpha: 1,
            duration: 1,
            ease: "sine.out"
        }, "<+=2");

        tl.to(nombreGradientBtm, {
            scaleY: 1,
            duration: 3,
            ease: "sine.out"
        }, "<+=0.3");

        tl.to(nombreFlorGrupo, {
            yPercent: 0,
            duration: 7,
            ease: "sine.out"
        }, "<");

        tl.to(nombreContent, {
            autoAlpha: 1,
            filter: "blur(0px)",
            duration: 3,
            ease: "sine.out"
        }, "<+=2");

        tl.to({}, {
            duration: 2.5
        });

        // STEP 6 — PASO
        tl.to(nombreGradientBg, {
            scaleY: 3,
            duration: 5,
            ease: "power4.in"
        });

        tl.to([nombreFlorHblur, nombreFlorMblur], {
            autoAlpha: 0,
            duration: 5,
            ease: "power4.in"
        }, "<=");

        tl.to(nombreContent, {
            autoAlpha: 0,
            duration: 3,
            filter: "blur(15px)"
        }, "<+=2");

        tl.addLabel("chapter06", "<+=2");
        tl.call(() => setHeaderTheme("grey"), null, "chapter06");

        tl.to(layer06, {
            autoAlpha: 1,
            duration: 0.1
        }, "<=");

        tl.to(pasoContent, {
            autoAlpha: 1,
            filter: "blur(0px)",
            duration: 4,
            ease: "power2.out"
        }, "<-=0.5");

        tl.to(pasoFlor1, {
            yPercent: 0,
            duration: 8,
            ease: "power2.out"
        }, "<+=1");

        tl.to(pasoFlor2, {
            yPercent: 0,
            duration: 8,
            ease: "power2.out"
        }, "<+=1");

        tl.to(pasoFlor3, {
            yPercent: 0,
            duration: 8,
            ease: "power2.out"
        }, "<+=0.8");

        tl.to(pasoFlor4, {
            yPercent: 0,
            duration: 8,
            ease: "power2.out"
        }, "<+=0.8");

        tl.to(pasoFlor5, {
            yPercent: 0,
            duration: 8,
            ease: "power2.out"
        }, "<+=0.8");

        tl.to(pasoBtn, {
            autoAlpha: 1,
            filter: "blur(0px)",
            duration: 4,
            ease: "power2.out"
        }, "<+=1");

        tl.addLabel("flowerLights");

        function stopFlowerLightsLoopMobile() {
            if (!hasStartedFlowerLightsLoop) return;

            hasStartedFlowerLightsLoop = false;
            flowerLightsLoop.pause();

            if (flowerLightsFadeOutTween) {
                flowerLightsFadeOutTween.kill();
            }

            flowerLightsFadeOutTween = gsap.to(allFlowersLights, {
                autoAlpha: 0,
                scale: 0.45,
                filter: "blur(8px)",
                duration: 1.4,
                ease: "sine.inOut",
                overwrite: "auto",
                onComplete: () => {
                    flowerLightsLoop.pause(0);

                    gsap.set(allFlowersLights, {
                        autoAlpha: 0,
                        scale: 0.75,
                        filter: "blur(0px)"
                    });

                    flowerLightsFadeOutTween = null;
                }
            });
        }

        tl.call(() => {
            if (hasStartedFlowerLightsLoop) return;

            if (flowerLightsFadeOutTween) {
                flowerLightsFadeOutTween.kill();
                flowerLightsFadeOutTween = null;
            }

            gsap.set(allFlowersLights, {
                autoAlpha: 0,
                scale: 0.75,
                filter: "blur(0px)"
            });

            hasStartedFlowerLightsLoop = true;
            flowerLightsLoop.restart();
        }, null, "flowerLights");

        tl.eventCallback("onUpdate", () => {
            syncNarrativeIndicator(tl);

            const flowerLightsTime = tl.labels.flowerLights;

            if (typeof flowerLightsTime !== "number") return;

            if (tl.time() >= flowerLightsTime && !hasStartedFlowerLightsLoop) {
                if (flowerLightsFadeOutTween) {
                    flowerLightsFadeOutTween.kill();
                    flowerLightsFadeOutTween = null;
                }

                gsap.set(allFlowersLights, {
                    autoAlpha: 0,
                    scale: 0.75,
                    filter: "blur(0px)"
                });

                hasStartedFlowerLightsLoop = true;
                flowerLightsLoop.restart();
            }

            if (tl.time() < flowerLightsTime - 0.05) {
                stopFlowerLightsLoopMobile();
            }
        });

        tl.to({}, {
            duration: 4
        });

        tl.to(pasoGradientTool, {
            scaleY: 1.5,
            duration: 4,
            ease: "power2.out"
        });

        tl.to({}, {
            duration: 2
        });
    }

    /// --> MATCH MEDIA NARRATIVA
    // Lanza timeline desktop o mobile según ancho viewport
    const mm = gsap.matchMedia();

    mm.add({
        isDesktop: "(min-width: 1280px)",
        isMobile: "(max-width: 1279px)"
    }, (context) => {
        const { isDesktop } = context.conditions;

        setInitialNarrativeState(isDesktop);

        if (isDesktop) {
            initNarrativeDesktop();
        } else {
            initNarrativeMobile();
        }
    });
}

// ░░░░░░░░ TOOL — ANIMACIÓN
// Entrada de sección herramienta en home y página herramienta

async function initToolAnimation() {
    const toolSection = document.querySelector(".tool");
    const titleTool = document.querySelector(".tool .hf-l");

    const txtTool = document.querySelector(".tool .txt-block");
    const btnTool = document.querySelector(".tool .btn");
    const gradientTool = document.querySelector(".tool .tool_gradient__white");

    const txtInfInfTool = document.querySelectorAll(".tool .tool_txt_inf p");

    if (!toolSection || !titleTool || !txtTool || !btnTool || !txtInfInfTool.length) return;

    const titleToolLines = titleTool.querySelectorAll(".tool .two-lines-title-line");

    if (!titleToolLines.length) return;

    const isToolPage = document.body.dataset.page === "herramienta";

    // Esperar fuentes antes de animar líneas
    if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
    }

    /// --> GSAP.SET
    gsap.set([titleTool, txtTool, btnTool], {
        autoAlpha: 1
    });

    gsap.set(titleToolLines, {
        autoAlpha: 0,
        y: 18,
        filter: "blur(10px)",
        willChange: "transform, opacity, filter"
    });

    gsap.set(txtTool, {
        autoAlpha: 0,
        y: 20,
        filter: "blur(7px)"
    });

    gsap.set(btnTool, {
        autoAlpha: 0
    });

    if (gradientTool) {
        gsap.set(gradientTool, {
            scaleY: 0
        });
    }

    gsap.set(txtInfInfTool, {
        autoAlpha: 0,
        y: 14,
    });

    /// --> SNAP TOOL ESCRITORIO
    function getToolSnapPoints(timeline, labels) {
        if (!timeline || !labels.length) return [];

        const duration = timeline.duration();

        if (!duration) return [];

        return labels
            .map((label) => timeline.labels[label] / duration)
            .filter((point) => Number.isFinite(point));
    }

    const isMobile = ScrollTrigger.isTouch || window.matchMedia("(max-width: 1279px)").matches;
    const toolSnapLabels = [
        "toolContent",
        "toolEnd"
    ];

    /// --> TIMELINE TOOL
    // En página herramienta / móvil se ejecuta directa; en home va con ScrollTrigger
    const tlTool = gsap.timeline(
        isToolPage || isMobile
            ? {}
            : {
                scrollTrigger: {
                    trigger: toolSection,
                    start: "top 70%",
                    end: "bottom bottom",
                    scrub: 1.2,
                    invalidateOnRefresh: true
                }
            }
    );

    // 1. Entra título
    tlTool.to(titleToolLines, {
        autoAlpha: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 2.4,
        ease: "power3.out",
        stagger: {
            each: 0.18,
            from: "start"
        }
    });

    // 2. Entra texto
    tlTool.to(txtTool, {
        autoAlpha: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 2.4,
        ease: "power3.out",
        stagger: {
            each: 0.18,
            from: "start",
        }
    }, "<+=0.6");

    // 3. Entra texto inferior
    tlTool.to(txtInfInfTool, {
        autoAlpha: 1,
        y: 0,
        duration: 1.5,
        ease: "power3.out",
        stagger: {
            each: 0.18,
            from: "start",
        }
    }, "<+=0.4");

    // 4. Entra botón
    tlTool.to(btnTool, {
        autoAlpha: 1,
        duration: 0.9
    }, "<+=1.5");

    tlTool.addLabel("toolContent");

    // *Solo en home: transición hacia siguiente sección
    if (!isToolPage && gradientTool) {
        tlTool.to({}, {
            duration: 2
        });

        // 5. Entra transición blanca hacia siguiente sección
        tlTool.to(gradientTool, {
            scaleY: 1.5,
            duration: 3
        });

        tlTool.addLabel("toolEnd");

        tlTool.to({}, {
            duration: 4
        });
    }
}

// ░░░░░░░░ BUSCO AYUDA — ANIMACIÓN
// Entrada título, texto y listado de contactos
function initRepoAnimation() {
    const repoSection = document.querySelector(".repo");

    if (!repoSection) return;

    const titleRepo = repoSection.querySelector(".repo_hdr .hf-l");
    const txtRepo = repoSection.querySelector(".repo_hdr .txt-block");
    const itemsRepo = repoSection.querySelectorAll(".repo_contacts_row");
    const titleRepoLines = titleRepo.querySelectorAll(".repo_hdr .two-lines-title-line");

    if (!titleRepo || !txtRepo || !itemsRepo.length || !titleRepoLines.length) return;


    /// --> GSAP.SET
    gsap.set(titleRepo, {
        autoAlpha: 1
    });

    gsap.set(txtRepo, {
        autoAlpha: 0,
        y: 18,
        filter: "blur(10px)"
    });

    gsap.set(itemsRepo, {
        autoAlpha: 0,
        y: 24,
        filter: "blur(10px)"
    });

    gsap.set(titleRepoLines, {
        autoAlpha: 0,
        y: 18,
        filter: "blur(10px)"
    });

    /// --> TIMELINE
    const tlRepo = gsap.timeline();

    // 1. Entra título
    tlRepo.to(titleRepoLines, {
        autoAlpha: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 1.4,
        ease: "power3.out",
        stagger: {
            each: 0.12,
            from: "start"
        }
    });

    // 2. Entra texto
    tlRepo.to(txtRepo, {
        autoAlpha: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 1.2,
        ease: "power3.out"
    }, "<+=0.4");

    // 3. Entran contactos
    tlRepo.to(itemsRepo, {
        autoAlpha: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 1,
        ease: "power3.out",
        stagger: {
            each: 0.08,
            from: "start"
        }
    }, "<+=0.35");
}

// ░░░░░░░░ FOOTER — OPACITY 0 END
function initFooterHeaderVisibility() {
    const footer = document.querySelector(".ftr");

    if (!footer) return;

    ScrollTrigger.create({
        trigger: footer,
        start: "top 23%",
        end: "bottom top",

        onEnter: () => {
            document.documentElement.classList.add("is-footer-in-view");
        },

        onLeaveBack: () => {
            document.documentElement.classList.remove("is-footer-in-view");
        }
    });
}

// ░░░░░░░░ FOOTER — ANIMACIÓN
// Entrada del titular final por caracteres
function initFooterAnimation() {
    const ftr = document.querySelector(".ftr");

    if (!ftr) return;

    const titleFtr = document.querySelector(".ftr .hf-xl");

    /// --> SPLIT TEXT
    const titleFtrSplit = new SplitText(titleFtr, {
        type: "words,chars",
        wordsClass: "word",
        charsClass: "char"
    });

    /// --> GSAP.SET
    gsap.set(titleFtr, {
        autoAlpha: 1,
        visibility: "visible",
    });

    gsap.set(titleFtrSplit.chars, {
        autoAlpha: 0,
        y: 18,
        filter: "blur(12px)",
        willChange: "transform, opacity, filter"
    });

    /// --> TIMELINE
    const tlFooter = gsap.timeline({
        scrollTrigger: {
            trigger: ftr,
            start: "top 30%",
            once: true
        }

    });

    // 1. Entra titular footer por caracteres
    tlFooter.to(titleFtrSplit.chars, {
        autoAlpha: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 3,
        ease: "power3.out",
        stagger: {
            each: 0.03,
            from: "end"
        }
    });
}

// ░░░░░░░░ FAQS — ANIMACIÓN ENTRADA
// Entrada de título, FAQs y botón al hacer scroll
function initFaqsAnimation() {
    const faqsSection = document.querySelector(".sec_faqs");

    if (!faqsSection) return;

    const titleFaqs = faqsSection.querySelector(".hf-l");
    const itemsFaqs = faqsSection.querySelectorAll(".dropdown_faqs");
    const moreButton = faqsSection.querySelector(".btn-more");

    if (!titleFaqs || !itemsFaqs.length) return;

    const titleFaqsLines = titleFaqs.querySelectorAll(".two-lines-title-line");

    if (!titleFaqsLines.length) return;

    /// --> GSAP.SET
    gsap.set(titleFaqsLines, {
        autoAlpha: 0,
        y: 18,
        filter: "blur(10px)"
    });

    gsap.set(itemsFaqs, {
        autoAlpha: 0,
        y: 24,
        filter: "blur(10px)"
    });

    if (moreButton) {
        gsap.set(moreButton, {
            autoAlpha: 0,
            y: 18,
            filter: "blur(8px)"
        });
    }

    /// --> TIMELINE
    const tlFaqs = gsap.timeline({
        scrollTrigger: {
            trigger: faqsSection,
            start: "top 75%",
            once: true
        }
    });

    // 1. Entra título FAQs
    tlFaqs.to(titleFaqsLines, {
        autoAlpha: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 1.4,
        ease: "power3.out",
        stagger: {
            each: 0.12,
            from: "start"
        }
    });

    // 2. Entran items FAQs
    tlFaqs.to(itemsFaqs, {
        autoAlpha: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 1,
        ease: "power3.out",
        stagger: {
            each: 0.08,
            from: "start"
        }
    }, "<+=0.35");

    if (moreButton) {
        // 3. Entra botón "+"
        tlFaqs.to(moreButton, {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.9,
            ease: "power3.out"
        }, "<+=0.35");
    }
}

// ░░░░░░░░ INIT
// Inicialización general + navegación interna con Swup
let swup;
let isSwupNavigation = false;
let shouldResetScrollBeforeNextView = false;

// Inicializa componentes y animaciones de la página actual
async function initPage() {
    const swupContainer = document.querySelector("#swup");

    if (swupContainer?.dataset.page) {
        document.body.dataset.page = swupContainer.dataset.page;
    }

    // 1. Carga includes antes de inicializar eventos / animaciones
    await loadIncludes();

    // 2. Estado base header según página
    setInitialHeaderThemeForPage();

    initHomeLogoReload();

    // 3. Inicializa interacciones y animaciones
    initFaqsMore();
    initFaqsAccordion();

    initHeroIntroMessages();
    initHeroAnimation();
    initNarrativeSequence();
    initHeroCtaScroll();
    initHeaderThemeSections();

    await initToolAnimation();
    initFaqsAnimation();

    initRepoAnimation();
    initFooterAnimation();
    initFooterHeaderVisibility();

    // 4. Refresh final tras montar includes y animaciones
    requestAnimationFrame(() => {
        ScrollTrigger.refresh();
    });
}


// ░░░░░░░░ SCROLL — RESET INSTANTÁNEO
// Resetea scroll sin animación (swup)
function resetScrollTopInstant() {
    gsap.killTweensOf(window);

    window.scrollTo({
        top: 0,
        left: 0,
        behavior: "auto"
    });

    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
}

// Inicializa app y navegación Swup
async function initApp() {
    await initPage();

    initResizeRefresh();

    // ░░░░░░░░ HOME — CARGA COMPLETA DESDE PÁGINAS INTERNAS
    // La home tiene intro, bloqueo de scroll y ScrollTriggers principales.
    // Al volver con Swup puede heredar scrollY de la página anterior.
    // Desde páginas internas, la home se carga como documento completo.
    document.addEventListener("click", (event) => {
        const link = event.target.closest("a[href]");

        if (!link) return;

        const url = new URL(link.href, window.location.origin);

        const isHomeLink =
            url.pathname === "/" ||
            url.pathname.endsWith("/index.html");

        const isCurrentPageHome =
            document.body.dataset.page === "home";

        if (!isHomeLink || isCurrentPageHome) return;

        event.preventDefault();
        event.stopImmediatePropagation();

        window.location.href = url.href;
    }, true);


    /// --> SWUP
    swup = new Swup({
        containers: ["#swup"]
    });

    // Activar clase de transición al iniciar navegación
    swup.hooks.on("visit:start", (visit) => {
        const isMobile = window.innerWidth < 1280;

        // Escritorio: exactamente como antes
        if (!isMobile) {
            document.documentElement.classList.add("is-page-transitioning");
            return;
        }

        document.documentElement.classList.add("is-page-transitioning");

        const fromHome = document.body.dataset.page === "home";

        const toPath = visit.to?.url
            ? new URL(visit.to.url, window.location.origin).pathname
            : "";

        const toInternalPage =
            toPath.endsWith("/busco-ayuda.html") ||
            toPath.endsWith("/herramienta.html");

        shouldResetScrollBeforeNextView = fromHome && toInternalPage;

        if (!shouldResetScrollBeforeNextView) return;

        // Ocultamos scrollbar solo durante el reset móvil
        document.documentElement.classList.add("is-scroll-resetting");

        // Esperamos a que la transición verde tape la pantalla
        setTimeout(() => {
            ScrollTrigger.getAll().forEach((trigger) => {
                trigger.kill();
            });

            resetScrollTopInstant();
        }, 180);
    });

    // Re-inicializa página tras cambio interno Swup
    swup.hooks.on("page:view", async () => {
        isSwupNavigation = true;

        const isMobile = window.innerWidth < 1280;

        // Limpia ScrollTriggers anteriores antes de montar nueva página
        ScrollTrigger.getAll().forEach((trigger) => {
            trigger.kill();
        });

        // Escritorio: comportamiento original
        if (!isMobile) {
            window.scrollTo(0, 0);

            await initPage();

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setTimeout(() => {
                        document.documentElement.classList.remove("is-page-transitioning");
                    }, 800);
                });
            });

            return;
        }

        // Móvil: reset reforzado
        resetScrollTopInstant();

        await initPage();

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                if (shouldResetScrollBeforeNextView) {
                    resetScrollTopInstant();
                    shouldResetScrollBeforeNextView = false;
                }

                setTimeout(() => {
                    document.documentElement.classList.remove("is-scroll-resetting");
                    document.documentElement.classList.remove("is-page-transitioning");
                }, 800);
            });
        });
    });
}

initApp();
