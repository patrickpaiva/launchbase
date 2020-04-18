const modalOverlay = document.querySelector('.modal-overlay');
const cards = document.querySelectorAll('.card');

for (let card of cards) {
    card.addEventListener("click", function(){
        const fotoId = card.querySelector("img").src;
        const title = card.querySelector("p.nome-receita").textContent;
        const autor = card.querySelector("p.feito-por").textContent;

        modalOverlay.querySelector("img").src = `${fotoId}`;
        modalOverlay.querySelector("p.nome-receita").innerHTML = title;
        modalOverlay.querySelector("p.feito-por").innerHTML = autor;


        modalOverlay.classList.add('active');
    })
}

document.querySelector('.close-modal').addEventListener("click", function(){
    modalOverlay.classList.remove('active');
})