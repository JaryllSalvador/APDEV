const signUpButton = document.getElementById('signup');
const logInButton = document.getElementById('login');
const container = document.getElementById('container');
const containerTitle = document.querySelector('.container-title');
const logoImage = document.querySelector('.logo');

signUpButton.addEventListener('click', () => {
    container.classList.add('right-panel-active');
    containerTitle.style.color = '#fff';
    logoImage.style.filter = 'invert(100%)';
});

logInButton.addEventListener('click', () => {
    container.classList.remove('right-panel-active');
    containerTitle.style.color = '#195092';
    logoImage.style.filter = '';
});

