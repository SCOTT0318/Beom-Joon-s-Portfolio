document.addEventListener("DOMContentLoaded", () => {
    initImageModal();
    initCherryBlossoms();
});

function initImageModal() {
    const modal = document.getElementById("mediaModal");
    const modalTitle = document.getElementById("modalTitle");
    const modalImage = document.getElementById("modalImage");
    const closeButton = modal ? modal.querySelector(".close") : null;
    const galleryItems = document.querySelectorAll("img.gallery-item");
    let lastFocusedElement = null;

    if (!modal || !modalTitle || !modalImage || !closeButton) {
        return;
    }

    const getCaption = (item) => {
        const figure = item.closest("figure");
        const caption = figure ? figure.querySelector("figcaption") : null;
        return caption ? caption.textContent.trim() : "프로젝트 미디어";
    };

    const openModal = (item) => {
        lastFocusedElement = document.activeElement;
        const caption = getCaption(item);

        modalTitle.textContent = caption;
        modalImage.src = item.currentSrc || item.src;
        modalImage.alt = item.alt || caption;
        modalImage.hidden = false;

        modal.classList.add("is-open");
        modal.setAttribute("aria-hidden", "false");
        document.body.classList.add("modal-open");
        closeButton.focus();
    };

    const closeModal = () => {
        modal.classList.remove("is-open");
        modal.setAttribute("aria-hidden", "true");
        document.body.classList.remove("modal-open");
        modalImage.hidden = true;
        modalImage.removeAttribute("src");
        modalImage.alt = "";

        if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
            lastFocusedElement.focus();
        }
    };

    galleryItems.forEach((item) => {
        item.setAttribute("tabindex", "0");
        item.setAttribute("role", "button");
        item.setAttribute("aria-label", `${getCaption(item)} 크게 보기`);

        item.addEventListener("click", () => openModal(item));
        item.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openModal(item);
            }
        });
    });

    closeButton.addEventListener("click", closeModal);

    modal.addEventListener("click", (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (!modal.classList.contains("is-open")) {
            return;
        }
        if (event.key === "Escape") {
            closeModal();
            return;
        }
        if (event.key === "Tab") {
            const focusables = modal.querySelectorAll(
                'button, [href], [tabindex]:not([tabindex="-1"])'
            );
            const visible = Array.from(focusables).filter(
                (el) => !el.hasAttribute("disabled") && el.offsetParent !== null
            );
            if (visible.length === 0) return;
            const first = visible[0];
            const last = visible[visible.length - 1];
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        }
    });
}

function initCherryBlossoms() {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const canvas = document.createElement("canvas");
    canvas.id = "blossom-canvas";
    canvas.setAttribute("aria-hidden", "true");
    document.body.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    let width = 0;
    let height = 0;
    let dpr = window.devicePixelRatio || 1;
    let flakes = [];
    let rafId = null;
    let lastFrame = performance.now();

    const TAU = Math.PI * 2;

    const resize = () => {
        dpr = window.devicePixelRatio || 1;
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        canvas.style.width = width + "px";
        canvas.style.height = height + "px";
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const target = Math.min(140, Math.max(50, Math.floor((width * height) / 14000)));
        if (flakes.length < target) {
            while (flakes.length < target) flakes.push(spawnFlake(true));
        } else if (flakes.length > target) {
            flakes.length = target;
        }
    };

    const spawnFlake = (initial) => {
        const radius = 0.8 + Math.random() * 2.6;
        return {
            x: Math.random() * width,
            y: initial ? Math.random() * height : -radius * 2,
            r: radius,
            speedY: 0.3 + radius * 0.55,
            sway: 0.4 + Math.random() * 1.2,
            phase: Math.random() * TAU,
            alpha: 0.55 + Math.random() * 0.4
        };
    };

    const tick = (now) => {
        const delta = Math.min(40, now - lastFrame) / 16.67;
        lastFrame = now;
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < flakes.length; i++) {
            const f = flakes[i];
            f.phase += 0.015 * delta;
            f.x += Math.sin(f.phase) * f.sway * delta;
            f.y += f.speedY * delta;

            if (f.y > height + f.r * 2) {
                flakes[i] = spawnFlake(false);
                flakes[i].x = Math.random() * width;
            } else {
                ctx.beginPath();
                ctx.arc(f.x, f.y, f.r, 0, TAU);
                ctx.fillStyle = `rgba(255, 255, 255, ${f.alpha})`;
                ctx.shadowColor = "rgba(255, 255, 255, 0.6)";
                ctx.shadowBlur = f.r * 2;
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        }
        rafId = requestAnimationFrame(tick);
    };

    const start = () => {
        if (rafId !== null) return;
        lastFrame = performance.now();
        rafId = requestAnimationFrame(tick);
    };
    const stop = () => {
        if (rafId !== null) {
            cancelAnimationFrame(rafId);
            rafId = null;
        }
    };

    resize();
    start();
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", () => {
        if (document.hidden) stop(); else start();
    });
}
