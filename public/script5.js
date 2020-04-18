function addStep() {
    const steps = document.querySelector("#steps");
    const fieldContainer2 = document.querySelectorAll(".step");
    
    // Realiza um clone do último step adicionado
    const newField2 = fieldContainer2[fieldContainer2.length - 1].cloneNode(true);
    
    // Não adiciona um novo input se o último tem um valor vazio
    if (newField2.children[0].value == "") return false;
    
    // Deixa o valor do input vazio
    newField2.children[0].value = "";
    steps.appendChild(newField2);
    }
    
    document
    .querySelector(".add-step")
    .addEventListener("click", addStep);
