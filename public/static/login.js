
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

const email_err = document.getElementById('email_err');
const password_err = document.getElementById('password_err');
const errorSpan = document.getElementById('error_msg');


const loginBtn = document.getElementById('loginBtn');

passwordInput.addEventListener('keyup', () => {
  password_err.innerHTML = '';
  validatePassword(passwordInput.value.trim());

})

function validatePassword(password) {
  var lowerCaseLetters = /[a-z]/g;
  var upperCaseLetters = /[A-Z]/g;
  var numbers = /[0-9]/g;
  let flag = true;

  if (!password.match(lowerCaseLetters)) {
    let p = document.createElement('p');
    p.innerHTML = 'One Lowercase Letter';
    password_err.append(p);
    flag = false;
  }

  if (!password.match(upperCaseLetters)) {

    let p = document.createElement('p');
    p.innerHTML = 'One Uppercase Letter';
    password_err.append(p);
    flag = false;
  }


  if (!password.match(numbers)) {

    let p = document.createElement('p');
    p.innerHTML = 'One Number';
    password_err.append(p);
    flag = false;
  }

  if (password.length < 8) {
    let p = document.createElement('p');
    p.innerHTML = 'Minimum 8 Character Long';
    password_err.append(p);
    flag = false;
  }

  return flag;

}

loginBtn.addEventListener('click', function (event) {
  email_err.innerHTML = '';
  password_err.innerHTML = '';
  let emailRgx = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  if (!email.value.trim().match(emailRgx)) {
    email_err.innerHTML = 'Please Enter A Valid E-mail!!!';
  } else if (!validatePassword(passwordInput.value.trim())) {
    password_err.innerHTML = 'Please EnterA Valid Password';
  } else {

    let user = {
      email: emailInput.value,
      password: passwordInput.value,
    }
    fetch('/login', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(user)
    }).then(response => response.json())
      .then(function (result) {
        if (result['err'] == 'Verify Email First') {
          window.location.href = './verifyMailFirst';
          
        } else if (result['err']) {
          errorSpan.innerHTML = result['err'];
        } else {
          console.log(result)
          window.location.href = './products';
        }
      });
  }
})