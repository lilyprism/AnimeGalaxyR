window.addEventListener("load", function (event) {
    init();
});

function init() {
    handleScroll();
}

function handleScroll() {
    let topbar_el = document.querySelector(".topbar");
    let sidebar_el = document.querySelector(".sidebar");
    let banner_el = document.querySelector(".banner-top");
    let container_el = document.querySelector(".container");
    window.addEventListener("scroll", function (event) {
        if (window.pageYOffset > banner_el.offsetTop + banner_el.clientHeight) {
            topbar_el.classList.add("sticky");
            sidebar_el.classList.add("sticky");
            container_el.classList.add("sticky");
        } else {
            topbar_el.classList.remove("sticky");
            sidebar_el.classList.remove("sticky");
            container_el.classList.remove("sticky");
        }
    });
}