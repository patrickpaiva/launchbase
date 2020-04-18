const stepRemove = document.querySelector(".remove-step")


stepRemove.addEventListener('click', function() {
    stepRemove.closest('div').remove();
})

