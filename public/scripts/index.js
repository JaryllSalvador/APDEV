const signUpForm = document.forms['sign-up-form'];
const loginForm = document.forms['login-form'];
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

document.addEventListener('DOMContentLoaded', () => {
    const signUpForm = document.forms['sign-up-form'];

    signUpForm.addEventListener('submit', e => {
        validateSignUpInputs(e);
    });
});

const setError = (element, message) => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');
    errorDisplay.innerText = message;
    inputControl.classList.add('error');
    inputControl.classList.remove('success');
};

const setSuccess = element => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');
    errorDisplay.innerText = '';
    inputControl.classList.add('success');
    inputControl.classList.remove('error');
};

const isValidEmail = email => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
};

const startsWithCapital = name => /^[A-Z]/.test(name);

const isNumericAndEightChars = username => /^\d{8}$/.test(username);

const validateSignUpInputs = (e) => {
    const firstName = signUpForm['firstname'];
    const lastName = signUpForm['lastname'];
    const username = signUpForm['account_name'];
    const email = signUpForm['profile_email'];
    const password = signUpForm['password'];

    if (!firstName.value.trim()) {
        setError(firstName, 'First name is required');
        e.preventDefault();
    } else if (!startsWithCapital(firstName.value)) {
        setError(firstName, 'First name must start with a capital letter');
        e.preventDefault();
    } else {
        setSuccess(firstName);
    }
    
    if (!lastName.value.trim()) {
        setError(lastName, 'Last name is required');
        e.preventDefault();
    } else if (!startsWithCapital(lastName.value)) {
        setError(lastName, 'Last name must start with a capital letter');
        e.preventDefault();
    } else {
        setSuccess(lastName);
    }
    
    if (!username.value.trim()) {
        setError(username, 'Username is required');
        e.preventDefault();
    } else if (!isNumericAndEightChars(username.value)) {
        setError(username, 'Username must be 8 numeric characters');
        e.preventDefault();
    } else {
        // check if unique!!!!
        setSuccess(username);
    }

    if (!email.value.trim()) {
        setError(email, 'Email address is required');
        e.preventDefault();
    } else if (!isValidEmail(email.value)) {
        setError(email, 'Provide a valid email address');
        e.preventDefault();
    } else {
        setSuccess(email);
    }

    if (!password.value.trim()) {
        setError(password, 'Password is required');
        e.preventDefault();
    } else if (password.value.length < 8 || password.value.length > 20) {
        setError(password, 'Password must be 8-20 characters long');
        e.preventDefault();
    } else {
        setSuccess(password);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.forms['login-form'];

    loginForm.addEventListener('submit', e => {
        validateLoginInputs(e);
    });
});

const setErrorForLogin = (element, message) => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');
    errorDisplay.innerText = message;
    inputControl.classList.add('error');
    inputControl.classList.remove('success');
};

const setSuccessForLogin = element => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');
    errorDisplay.innerText = '';
    inputControl.classList.add('success');
    inputControl.classList.remove('error');
};

const validateLoginInputs = (e) => {
    const username = loginForm['user'];
    const password = loginForm['pass'];

    if (username.value.trim() === '') {
        setErrorForLogin(username, 'Username is required');
        e.preventDefault();
    } else {
        setSuccessForLogin(username);
    }

    if (password.value.trim() === '') {
        setErrorForLogin(password, 'Password is required');
        e.preventDefault();
    } else {
        setSuccessForLogin(password);
    }
};


document.addEventListener('DOMContentLoaded', () => {
    const forgotPasswordLink = document.querySelector('.forgot');
    const forgotPasswordPopup = document.getElementById('forgotPasswordPopup');
    const closeButton = document.querySelector('.close-button');

    forgotPasswordLink.addEventListener('click', function(e) {
        e.preventDefault();
        forgotPasswordPopup.style.display = 'flex';
    });

    closeButton.addEventListener('click', function() {
        forgotPasswordPopup.style.display = 'none';
    });

    document.getElementById('resetPasswordForm').addEventListener('submit', async function(e) {
        const formData = new FormData(this);
        const data = Object.fromEntries(formData.entries());
    });
    
    const _forgotPasswordPopup = document.getElementById('updatePassContainer');
    const _closeButton = document.querySelector('.x-button');

    _closeButton.addEventListener('click', function() {
        _forgotPasswordPopup.style.display = 'none';
    });
});


