const messages = [
    "ENHYPEN conecta mundos ✦",
    "La identidad está en constante cambio.",
    "Cada era representa evolución."
];

let index = 0;

document.getElementById("heroBtn").addEventListener("click", () => {
    document.getElementById("dynamicText").textContent = messages[index];
    index = (index + 1) % messages.length;
});


const titles = document.querySelectorAll(".title");

titles.forEach(title => {
    title.addEventListener("click", () => {
        const content = title.nextElementSibling;

        if (content.style.maxHeight) {
            content.style.maxHeight = null;
        } else {
            content.style.maxHeight = content.scrollHeight + "px";
        }
    });
});