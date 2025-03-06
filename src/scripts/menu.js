
let isHamburgerOpen = false;
const hamburgerButton = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navElement = document.querySelector('.navbar');


hamburgerButton.addEventListener('click', toggleHamburger);




window.onscroll = onScroll;

function onScroll() {

  if (!isHamburgerOpen) {

  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    document.body.classList.remove("scroll-top");
  }
  else {
    document.body.classList.add("scroll-top");
  }
}
}


function toggleHamburger(){
  isHamburgerOpen = !isHamburgerOpen; // Update the state
  hamburgerButton.classList.toggle('expanded');
  navLinks.classList.toggle('expanded');
  navElement.classList.toggle('nav-open');

}