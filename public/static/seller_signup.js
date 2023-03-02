const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const mobileInput = document.getElementById("mobile");
const addressInput = document.getElementById('address')
const passwordInput = document.getElementById("password");


const name_err = document.getElementById("name_err");
const email_err = document.getElementById("email_err");
const mobile_err = document.getElementById("mobile_err");
const address_err = document.getElementById("address_err")
const password_err = document.getElementById("password_err");

const errorSpan = document.getElementById("error_msg");

const signUpBtn = document.getElementById("signUpBtn");

passwordInput.addEventListener("keyup", () => {
  password_err.innerHTML = "";
  validatePassword(passwordInput.value.trim());
});

function validatePassword(password) {
  var lowerCaseLetters = /[a-z]/g;
  var upperCaseLetters = /[A-Z]/g;
  var numbers = /[0-9]/g;
  let flag = true;

  if (!password.match(lowerCaseLetters)) {
    let p = document.createElement("p");
    p.innerHTML = "One Lowercase Letter";
    password_err.append(p);
    flag = false;
  }

  if (!password.match(upperCaseLetters)) {
    let p = document.createElement("p");
    p.innerHTML = "One Uppercase Letter";
    password_err.append(p);
    flag = false;
  }

  if (!password.match(numbers)) {
    let p = document.createElement("p");
    p.innerHTML = "One Number";
    password_err.append(p);
    flag = false;
  }

  if (password.length < 8) {
    let p = document.createElement("p");
    p.innerHTML = "Minimum 8 Character Long";
    password_err.append(p);
    flag = false;
  }

  return flag;
}

signUpBtn.addEventListener("click", function (event) {
  name_err.innerHTML = "";
  email_err.innerHTML = "";
  mobile_err.innerHTML = "";
  address_err.innerHTML= "";
  password_err.innerHTML="";

  let emailRgx = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

  if (nameInput.value.trim().length < 5) {
    name_err.innerHTML = "Please Enter A Valid Name!!!";
  } else if (!email.value.trim().match(emailRgx)) {
    email_err.innerHTML = "Please Enter A Valid E-mail!!!";
  } else if(mobileInput.value.trim().length!=10)
  {
    mobile_err.innerHTML='MObile Should Be Of 10 Digits'
  }else if(addressInput.value.trim().length<=5)
  {
    address_err.innerHTML='Please Enter A Valid Address'
  }
  else if (!validatePassword(passwordInput.value.trim())) {
    password_err.innerHTML = "Please Enter A Valid Passward";

  } else {

    let user = {
      name: nameInput.value,
      email: emailInput.value,
      password: passwordInput.value,
      mobile: mobileInput.value,
      address:{"hno":addressInput.value}
    };
    fetch("/seller/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(user),
    })
      .then((response) => response.json())
      .then(function (result) {
        console.log(result)
        if(result['err'])
        {
          errorSpan.innerHTML = result['err'];

        }else
        if (result["data"] == "done") {
          window.location.href = "./addProduct";
        } 
      });
  }
});
