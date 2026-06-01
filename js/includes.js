export async function loadIncludes() {
    const includeElements = document.querySelectorAll("[data-include]");

    for (const element of includeElements) {
        const file = element.getAttribute("data-include");

        const response = await fetch(file);
        const html = await response.text();

        element.innerHTML = html;
    }
}