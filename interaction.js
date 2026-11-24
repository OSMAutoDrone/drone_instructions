/* === OSMAutoDrone - interaction.js ===
 * This file contains the interaction logic for the assembly and disassembly
 * guides.
 */

const RPi = "Raspberry Pi 5";
const Cube = "contrôleur de vol";
const GCS = "station de contrôle au sol";
const ESC = "variateur de vitesse électronique (ESC)";
const ESCs = "variateurs de vitesse électronique (ESC)";

function replaceRPiAliases() {
    for (const element of document.querySelectorAll("rpi")) {
        element.replaceWith(RPi, ...element.childNodes);
    }
}

function replaceCubeAliases() {
    for (const element of document.querySelectorAll("cube")) {
        element.replaceWith(Cube, ...element.childNodes);
    }
}

function replaceGCSAliases() {
    for (const element of document.querySelectorAll("gcs")) {
        element.replaceWith(GCS, ...element.childNodes);
    }
}

function replaceESCAliases() {
    for (const element of document.querySelectorAll("esc")) {
        element.replaceWith(ESC, ...element.childNodes);
    }
    for (const element of document.querySelectorAll("escs")) {
        element.replaceWith(ESCs, ...element.childNodes);
    }

}

// C-style macro text replacement
replaceRPiAliases();
replaceCubeAliases();
replaceGCSAliases();
replaceESCAliases();

function formatNoteItems() {
    for (const item of document.querySelectorAll("li.note")) {
        if (item.querySelector(":scope > .note-icon")) continue;

        item.style.listStyle = "none";
        const content = item.innerHTML;
        item.replaceChildren();

        const icon = document.createElement("span");
        icon.className = "note-icon";
        icon.setAttribute("aria-hidden", "true");

        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("width", "16");
        svg.setAttribute("height", "16");
        svg.setAttribute("viewBox", "0 0 512 512");
        svg.setAttribute("focusable", "false");

        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("fill", "currentColor");
        path.setAttribute(
            "d",
            "M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464a256 256 0 1 0 0-512 256 256 0 1 0 0 512zM216 336c-13.3 0-24 10.7-24 24s10.7 24 24 24h80c13.3 0 24-10.7 24-24s-10.7-24-24-24h-8v-88c0-13.3-10.7-24-24-24h-48c-13.3 0-24 10.7-24 24s10.7 24 24 24h24v64h-24zm40-144a32 32 0 1 0 0-64 32 32 0 1 0 0 64z"
        );
        svg.append(path);
        icon.append(svg);

        const noteContent = document.createElement("span");
        noteContent.className = "note-content";
        noteContent.innerHTML = content;

        item.append(icon, noteContent);
    }
}

formatNoteItems();

new MutationObserver(formatNoteItems).observe(document.body, {
    childList: true,
    subtree: true,
});

new MutationObserver(replaceRPiAliases).observe(document.body, {
    childList: true,
    subtree: true,
});

// Edit a tool here; its BOM entry and every mention update together.
function demoImage(label) {
    const safeLabel = label.replace(/[&<>"']/g, (character) => {
        const escapes = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&apos;",
        };

        return escapes[character];
    });

    const svg = `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800">
            <rect width="600" height="800" fill="#e7edf3"/>
            <rect x="60" y="60" width="480" height="680"
              rx="24" fill="#fff" stroke="#aebbc8" stroke-width="8"/>
            <text x="300" y="400" text-anchor="middle"
              font-family="sans-serif" font-size="36"
              fill="#33465a">${safeLabel}</text>
          </svg>
        `;

    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

const tools = {
    M2p5AllenKey: {
        name: "Clé hexagonale M2.5",
        image: "images/tools/M2.5_allen_key.webp",
        alt: "Illustration d'une clé hexagonale M2.5",
    },
    M3AllenKey: {
        name: "Clé hexagonale M3",
        image: "images/tools/M3_allen_key.webp",
        alt: "Illustration d'une clé hexagonale M3",
    },
    M4AllenKey: {
        name: "Clé hexagonale M4",
        image: "images/tools/M4_allen_key.webp",
        alt: "Illustration d'une clé hexagonale M4",
    },
    Wrench8mm: {
        name: "Clé anglaise 8 mm",
        image: "images/tools/wrench_8mm.webp",
        alt: "Illustration d'une clé anglaise 8 mm",
    },
    Wrench10mm: {
        name: "Clé anglaise 10 mm",
        image: "images/tools/wrench_10mm.webp",
        alt: "Illustration d'une clé anglaise 10 mm",
    },
    LongNosePliers: {
        name: "Pince à long bec",
        image: "images/tools/long_nose_pliers.webp",
        precision: "petite",
        alt: "Illustration d'une pince à long bec",
    },
    ViseGripPliers: {
        name: "Pince autobloquante (pince étau)",
        image: "images/tools/vise_grip_pliers.webp",
        alt: "Illustration d'une pince autobloquante",
    },
    FlushCutPliers: {
        name: "Pince coupante à ras",
        image: "images/tools/flushcut_pliers.webp",
        precision: "petite",
        alt: "Illustration d'une pince coupante à ras",
    },
};

// Add hardware here; BOM entries and instruction references use these keys.
const boltsAndNuts = {
    M3x16Bolt: {
        id: "&#x3258;",
        longName: "Boulons M3x16 à tête cylindrique à pans creux",
        image: "images/bolts-and-nuts/M3x16_bolt.png",
        alt: "Illustration de boulons M3x16 à tête cylindrique à pans creux",
    },
    M3x25Bolt: {
        id: "&#x2472;",
        longName: "Boulons M3x25",
        image: "images/bolts-and-nuts/M3x25_bolt.png",
        alt: "Illustration de boulons M3x25",
    },
    M3x30Bolt: {
        id: "&#x3252;",
        longName: "Boulons M3x30",
        image: "images/bolts-and-nuts/M3x30_bolt.png",
        alt: "Illustration de boulons M3x30",
    },
    M3Washer: {
        id: "&#x2473;",
        longName: "Rondelles M3",
        image: "images/bolts-and-nuts/M3_washer.png",
        alt: "Illustration de rondelles M3",
    },
    M3Nut: {
        id: "&#x3251;",
        longName: "Écrous M3",
        image: "images/bolts-and-nuts/M3_nut.png",
        alt: "Illustration d'écrous M3",
    },
    M5x35Bolt: {
        id: "&#x3255;",
        longName: "Boulons M5x35",
        image: "images/bolts-and-nuts/M5x35_bolt.png",
        alt: "Illustration de boulons M5x35",
    },
    M5Washer: {
        id: "&#x3256;",
        longName: "Rondelles M5",
        image: "images/bolts-and-nuts/M5_washer.png",
        alt: "Illustration de rondelles M5",
    },
    M5NylonNut: {
        id: "&#x3257;",
        longName: "Écrous M5 avec nylon",
        image: "images/bolts-and-nuts/M5_nylon_nut.png",
        alt: "Illustration d'écrous M5 avec nylon",
    },
    M6Washer: {
        id: "&#x3254;",
        longName: "Rondelles M6",
        image: "images/bolts-and-nuts/M6_washer.png",
        alt: "Illustration de rondelles M6",
    },
    M6NylonNut: {
        id: "&#x3253;",
        longName: "Écrous M6 avec nylon",
        image: "images/bolts-and-nuts/M6_nylon_nut.png",
        alt: "Illustration d'écrous M6 avec nylon",
    },
};

const consumables = {
    ElectricTape: {
        name: "Ruban adhésif électrique",
        image: "images/consumables/electric_tape1.webp",
        alt: "Illustration de rubans adhésifs électriques",
    },
    MaskingTape: {
        name: "Ruban de masquage",
        image: "images/consumables/masking_tape.webp",
        alt: "Illustration d'un ruban de masquage",
    },
    DualLock: {
        name: "Rouleau de bande d'attache refermable (Dual-Lock™)",
        image: "images/consumables/dual_lock.webp",
        alt: "Illustration d'un rouleau de Dual-Lock™",
    },
    TieWraps: {
        name: "Attaches autobloquantes",
        image: "images/consumables/tie_wraps.webp",
        alt: "Illustration d'attaches autobloquantes",
    },
};

let openReferenceCard = null;

function createImageReference(marker, { image: imagePath, alt }, label, accessibleLabel = label) {
    marker.classList.add("tool-reference");
    const trigger = document.createElement("button");
    trigger.type = "button";
    trigger.className = "tool-trigger";
    trigger.textContent = label;
    trigger.setAttribute("aria-label", accessibleLabel);
    trigger.setAttribute("aria-expanded", "false");

    const card = document.createElement("span");
    card.className = "tool-card";
    card.hidden = true;

    const image = document.createElement("img");
    image.src = imagePath;
    image.alt = alt;
    const enlargeButton = document.createElement("button");
    enlargeButton.type = "button";
    enlargeButton.className = "tool-card-image";
    enlargeButton.setAttribute("aria-label", `Enlarge image: ${alt}`);
    enlargeButton.addEventListener("click", () => showLightbox(image));
    enlargeButton.append(image);
    card.append(enlargeButton);

    trigger.addEventListener("click", () => {
        const wasOpen = !card.hidden;
        closeReferenceCard();

        if (!wasOpen) {
            card.hidden = false;
            trigger.setAttribute("aria-expanded", "true");
            openReferenceCard = { card, trigger };
        }
    });

    marker.append(trigger, card);
}

function createToolReference(marker, toolKey) {
    const tool = tools[toolKey];
    if (!tool) throw new Error(`Unknown tool: ${toolKey}`);

    createImageReference(marker, tool, tool.name);
}

function createConsumableReference(marker, consumableKey) {
    const consumable = consumables[consumableKey];
    if (!consumable) throw new Error(`Unknown consumable: ${consumableKey}`);

    createImageReference(marker, consumable, consumable.name);
}

const toolList = document.querySelector("#tool-list");
if (toolList) {
    for (const [toolKey, tool] of Object.entries(tools)) {
        const item = document.createElement("li");
        item.dataset.tool = toolKey;

        if (tool.precision) {
            item.dataset.precision = tool.precision;
        }

        createToolReference(item, toolKey);
        if (tool.precision) {
            item.append(document.createTextNode(` (${tool.precision})`));
        }
        toolList.append(item);
    }
}

const boltsAndNutsList = document.querySelector("#bolts-and-nuts-list");
if (boltsAndNutsList) {
    for (const [hardwareKey, hardware] of Object.entries(boltsAndNuts)) {
        const item = document.createElement("li");
        item.append(document.createTextNode(`${hardware.longName} `));

        const marker = document.createElement("span");
        marker.dataset.hardware = hardwareKey;
        item.append(marker);
        boltsAndNutsList.append(item);
    }
}

const consumablesList = document.querySelector("#consumable-list");
if (consumablesList) {
    for (const [consumableKey, consumable] of Object.entries(consumables)) {
        const item = document.createElement("li");
        item.dataset.consumable = consumableKey;
        createConsumableReference(item, consumableKey);
        consumablesList.append(item);
    }
}

for (const marker of document.querySelectorAll("[data-tool]:not(#tool-list li)")) {
    createToolReference(marker, marker.dataset.tool);
}

for (const marker of document.querySelectorAll("[data-consumable]:not(#consumable-list li)")) {
    createConsumableReference(marker, marker.dataset.consumable);
}

for (const marker of document.querySelectorAll("span[data-hardware]")) {
    const hardwareKey = marker.dataset.hardware;
    const hardware = boltsAndNuts[hardwareKey];
    if (!hardware) throw new Error(`Unknown hardware: ${hardwareKey}`);

    const id = document.createElement("span");
    id.innerHTML = hardware.id;
    createImageReference(marker, hardware, id.textContent, hardware.longName);
}

function closeReferenceCard() {
    if (!openReferenceCard) return;

    openReferenceCard.card.hidden = true;
    openReferenceCard.trigger.setAttribute("aria-expanded", "false");
    openReferenceCard = null;
}

document.addEventListener("click", (event) => {
    if (!event.target.closest(".tool-reference")) closeReferenceCard();
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeReferenceCard();
});

// Generate IDs, visible numbers, and jump links from document order.
const steps = [...document.querySelectorAll(".step")];
const stepLinks = document.querySelector("#step-links");
const stepInput = document.querySelector("#step-input");

stepInput.max = String(steps.length);

steps.forEach((step, index) => {
    const number = index + 1;
    const title = step.querySelector("h2 span").textContent.trim();

    step.id = `step-${number}`;
    step.querySelector(".step-number").textContent = `Étape ${number}`;

    const item = document.createElement("li");
    const link = document.createElement("a");
    link.href = `#${step.id}`;
    link.textContent = `${number} - ${title}`;
    item.append(link);
    stepLinks.append(item);
});

document.querySelector("#step-form").addEventListener("submit", (event) => {
    event.preventDefault();

    if (!stepInput.reportValidity()) return;

    const number = Number(stepInput.value);

    if (!Number.isInteger(number) || number < 1 || number > steps.length) {
        stepInput.setCustomValidity(`Enter a step from 1 to ${steps.length}.`);
        stepInput.reportValidity();
        return;
    }

    document.querySelector(".jump details").open = false;
    steps[number - 1].scrollIntoView();
    location.hash = steps[number - 1].id;
});

stepInput.addEventListener("input", () => {
    stepInput.setCustomValidity("");
});

stepLinks.addEventListener("click", () => {
    document.querySelector(".jump details").open = false;
});

// Replace demo illustrations with real image paths when ready.
for (const image of document.querySelectorAll("img[data-demo]")) {
    image.src = demoImage(image.dataset.demo);
}

const lightbox = document.querySelector("#lightbox");
const enlargedImage = lightbox.querySelector("img");
const lightboxStage = lightbox.querySelector(".lightbox-stage");
let isImageZoomed = false;
let panX = 0;
let panY = 0;

function updateImageZoom() {
    enlargedImage.style.transform = isImageZoomed
        ? `translate(${panX}px, ${panY}px) scale(1.5)`
        : "translate(0, 0) scale(1)";
    enlargedImage.classList.toggle("zoomed", isImageZoomed);
}

function resetImageZoom() {
    isImageZoomed = false;
    panX = 0;
    panY = 0;
    updateImageZoom();
}

function toggleImageZoom() {
    isImageZoomed = !isImageZoomed;
    if (!isImageZoomed) {
        panX = 0;
        panY = 0;
    }
    updateImageZoom();
}

function closeLightbox() {
    lightbox.close();
}

function showLightbox(image) {
    enlargedImage.src = image.src;
    enlargedImage.alt = image.alt;
    resetImageZoom();
    document.body.classList.add("lightbox-open");
    lightbox.showModal();
}

lightbox.querySelector(".lightbox-close").addEventListener("click", () => {
    closeLightbox();
});

lightbox.addEventListener("close", () => {
    document.body.classList.remove("lightbox-open");
});

lightboxStage.addEventListener("click", (event) => {
    if (event.target === enlargedImage) {
        toggleImageZoom();
        return;
    }

    closeLightbox();
});

lightboxStage.addEventListener("wheel", (event) => {
    if (!isImageZoomed) return;

    event.preventDefault();
    if (event.shiftKey) {
        panX -= event.deltaY || event.deltaX;
    } else {
        panY -= event.deltaY;
    }

    const imageWidth = enlargedImage.offsetWidth * 2.0;
    const imageHeight = enlargedImage.offsetHeight * 2.0;
    const maxX = Math.max(0, (imageWidth - lightboxStage.clientWidth) / 2);
    const maxY = Math.max(0, (imageHeight - lightboxStage.clientHeight) / 2);

    panX = Math.min(maxX, Math.max(-maxX, panX));
    panY = Math.min(maxY, Math.max(-maxY, panY));
    updateImageZoom();
}, { passive: false });

for (const step of steps) {
    const thumbnails = [...step.querySelectorAll(".thumbnail")];
    if (thumbnails.length === 0) continue;

    const mainButton = step.querySelector(".main-photo");
    const mainImage = mainButton.querySelector("img");

    function selectPhoto(thumbnail) {
        const image = thumbnail.querySelector("img");
        mainImage.src = image.src;
        mainImage.alt = image.alt;

        for (const button of thumbnails) {
            button.setAttribute(
                "aria-pressed",
                String(button === thumbnail),
            );
        }
    }

    for (const thumbnail of thumbnails) {
        thumbnail.addEventListener("mouseenter", () => {
            selectPhoto(thumbnail);
        });
        thumbnail.addEventListener("focus", () => {
            selectPhoto(thumbnail);
        });
        thumbnail.addEventListener("click", () => {
            selectPhoto(thumbnail);
        });
    }

    selectPhoto(thumbnails[0]);

    mainButton.addEventListener("click", () => showLightbox(mainImage));
}