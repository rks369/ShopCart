let email = document.getElementById('email');
let email_err = document.getElementById('email_err');

let error_msg = document.getElementById('error_msg');

let reset_password = document.getElementById('reset_password');

reset_password.addEventListener('click', (event) => {
  email_err.innerHTML = '';
  error_msg.innerHTML = '';
  if (email.value.trim() == '') {
    email_err.innerHTML = "Emial Can't Be Empty !!! "
  } else {
    fetch('/forgotPassword', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify({ email: email.value.trim() })
    }).then(response => response.json())
      .then(function (result) {
        if (result['msg'] == 'error') {
          error_msg.innerHTML = 'Something Went Wrong !!!';
        } else if(result['msg']=='Done') {
          error_msg.innerHTML = 'Email Is Sent !Redirecting to Login !';
          setTimeout(() => {
            window.location.href = './login';

          }, 1000);
        }else{
          error_msg.innerHTML=result['err'];
        }
        console.log(result);
      })
  }
})
