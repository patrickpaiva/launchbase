const currentPage = location.pathname
const menuItems = document.querySelectorAll('.container-admin .menu a')
const menuItems2 = document.querySelectorAll('.container .menu a')

for (item of menuItems) {
    if (currentPage.includes(item.getAttribute("href"))) {
        item.classList.add('active')
    }
}

for (item of menuItems2) {
    if (currentPage.includes(item.getAttribute("href"))) {
        item.classList.add('active')
    }
}