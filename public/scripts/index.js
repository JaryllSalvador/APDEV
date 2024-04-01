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
        e.preventDefault();
        validateSignUpInputs();
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

const validateSignUpInputs = () => {
    const firstName = signUpForm['firstname'];
    const lastName = signUpForm['lastname'];
    const username = signUpForm['account_name'];
    const email = signUpForm['profile_email'];
    const password = signUpForm['password'];

    if (!startsWithCapital(firstName.value)) {
        setError(firstName, 'First name must start with a capital letter');
    } else {
        setSuccess(firstName);
    }
    
    if (!startsWithCapital(lastName.value)) {
        setError(lastName, 'Last name must start with a capital letter');
    } else {
        setSuccess(lastName);
    }

    if (!isNumericAndEightChars(username.value)) {
        setError(username, 'Username must be 8 numeric characters');
    } else {
        // check if unique!!!!!!!!!!!!!!!!!!!!!!!!!!
        setSuccess(username);
    }

    if (!isValidEmail(email.value)) {
        setError(email, 'Provide a valid email address');
    } else {
        setSuccess(email);
    }

    if (password.value.length < 8 || password.value.length > 20) {
        setError(password, 'Password must be 8-20 characters long');
    } else {
        setSuccess(password);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.forms['login-form'];

    loginForm.addEventListener('submit', e => {
        e.preventDefault(); 
        validateLoginInputs();
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

const validateLoginInputs = () => {
    const username = loginForm['user'];
    const password = loginForm['pass'];

    if (username.value.trim() === '') {
        setErrorForLogin(username, 'Username is required');
    } else {
        setSuccessForLogin(username);
    }

    if (password.value.trim() === '') {
        setErrorForLogin(password, 'Password is required');
    } else {
        setSuccessForLogin(password);
    }
};


