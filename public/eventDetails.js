// Sidebar Toggle Functionality
let hamburger = document.querySelector('.hamburger');
let sidebar = document.querySelector('.sidebar');
let closeBtn = document.querySelector('.close-btn button');

hamburger.addEventListener('click', () => {
    sidebar.classList.toggle('show');
});

closeBtn.addEventListener('click', () => {
    sidebar.classList.remove('show');
})



// Header background image 
let header = document.querySelector('header'); 
