const showi = document.querySelector('.showi');
const hidei = document.querySelector('.hidei');
const ingredients = document.querySelector('.ingredients')

const showp = document.querySelector('.showp');
const hidep = document.querySelector('.hidep');
const preparation = document.querySelector('.preparation')

const showf = document.querySelector('.showf');
const hidef = document.querySelector('.hidef');
const information = document.querySelector('.information')


showi.addEventListener("click", function(){
    showi.classList.add('active');    
    hidei.classList.remove('active');
    ingredients.classList.remove('active');

})

hidei.addEventListener("click", function(){
    showi.classList.remove('active');
    hidei.classList.add('active');
    ingredients.classList.add('active');

})

showp.addEventListener("click", function(){
    showp.classList.add('active');    
    hidep.classList.remove('active');
    preparation.classList.remove('active');

})

hidep.addEventListener("click", function(){
    showp.classList.remove('active');
    hidep.classList.add('active');
    preparation.classList.add('active');

})

showf.addEventListener("click", function(){
    showf.classList.add('active');    
    hidef.classList.remove('active');
    information.classList.remove('active');

})

hidef.addEventListener("click", function(){
    showf.classList.remove('active');
    hidef.classList.add('active');
    information.classList.add('active');

})