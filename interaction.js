/* === OSMAutoDrone - interaction.js ===
 * This file contains the interaction logic for the assembly and disassembly
 * guides.
 */

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
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
            <rect width="800" height="600" fill="#e7edf3"/>
            <rect x="60" y="60" width="680" height="480"
              rx="24" fill="#fff" stroke="#aebbc8" stroke-width="8"/>
            <text x="400" y="300" text-anchor="middle"
              font-family="sans-serif" font-size="36"
              fill="#33465a">${safeLabel}</text>
          </svg>
        `;

    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

const tools = {
    driver: {
        name: "Tournevis étoile (Phillips #2)",
        image: demoImage("Tournevis étoile"),
        alt: "Illustration d'un tournevis étoile",
    },
};

const toolList = document.querySelector("#tool-list");

for (const tool of Object.values(tools)) {
    const item = document.createElement("li");
    item.textContent = tool.name;
    toolList.append(item);
}

let openToolCard = null;

for (const marker of document.querySelectorAll("[data-tool]")) {
    const tool = tools[marker.dataset.tool];

    if (!tool) {
        throw new Error(`Unknown tool: ${marker.dataset.tool}`);
    }

    marker.className = "tool-reference";

    const trigger = document.createElement("button");
    trigger.type = "button";
    trigger.className = "tool-trigger";
    trigger.textContent = tool.name;
    trigger.setAttribute("aria-expanded", "false");

    const card = document.createElement("span");
    card.className = "tool-card";
    card.hidden = true;

    const image = document.createElement("img");
    image.src = tool.image;
    image.alt = tool.alt;
    card.append(image);

    trigger.addEventListener("click", () => {
        const wasOpen = !card.hidden;
        closeToolCard();

        if (!wasOpen) {
            card.hidden = false;
            trigger.setAttribute("aria-expanded", "true");
            openToolCard = { card, trigger };
        }
    });

    marker.append(trigger, card);
}

function closeToolCard() {
    if (!openToolCard) return;

    openToolCard.card.hidden = true;
    openToolCard.trigger.setAttribute("aria-expanded", "false");
    openToolCard = null;
}

document.addEventListener("click", (event) => {
    if (!event.target.closest(".tool-reference")) closeToolCard();
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeToolCard();
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
    step.querySelector(".step-number").textContent = `Step ${number}`;

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

lightbox.querySelector(".lightbox-close").addEventListener("click", () => {
    lightbox.close();
});

lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox || event.target.classList.contains(
        "lightbox-stage"
    )) {
        lightbox.close();
    }
});

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

    mainButton.addEventListener("click", () => {
        enlargedImage.src = mainImage.src;
        enlargedImage.alt = mainImage.alt;
        lightbox.showModal();
    });
}