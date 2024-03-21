const passwordField = document.getElementById("login-password");
    const togglePassword = document.querySelector("#login .password-toggle-icon i");

    togglePassword.addEventListener("click", function () {
        if (passwordField.type === "password") {
            passwordField.type = "text";
            togglePassword.classList.remove("fa-eye");
            togglePassword.classList.add("fa-eye-slash");
        } else {
            passwordField.type = "password";
            togglePassword.classList.remove("fa-eye-slash");
            togglePassword.classList.add("fa-eye");
        }
    });

    const signupPasswordField = document.getElementById("signup-password");
    const signupTogglePassword = document.querySelector("#signup .password-toggle-icon i");

    signupTogglePassword.addEventListener("click", function () {
        if (signupPasswordField.type === "password") {
            signupPasswordField.type = "text";
            signupTogglePassword.classList.remove("fa-eye");
            signupTogglePassword.classList.add("fa-eye-slash");
        } else {
            signupPasswordField.type = "password";
            signupTogglePassword.classList.remove("fa-eye-slash");
            signupTogglePassword.classList.add("fa-eye");
        }
    });


// post the signup form
var fetchResult;
document.getElementById("signup-form").addEventListener("submit",function(event){
    event.preventDefault();
    document.getElementById("error-username").innerHTML="";
    document.getElementById("error-emailId").innerHTML="";
    document.getElementById("error-mobileNumber").innerHTML="";
    const username=document.getElementById("signup-username").value;
    const emailId=document.getElementById("emailId").value;
    const password=document.getElementById("signup-password").value;
    const mobileNumber=document.getElementById("mobileNumber").value;

    const myheader=new Headers();
    myheader.append("Content-type","application/JSON");
    // console.log(password)
    const raw=JSON.stringify({
        "username": username,
        "emailId": emailId,
        "password": password,
        "mobileNumber":mobileNumber
    });
    const requestOptions={
        method:"POST",
        headers:myheader,
        body:raw,
        redirect:"follow"
    };

    fetch("http://localhost:8081/signup",requestOptions)
     .then((response)=>response.text())
     .then((result)=>{
        // Store the result 
        fetchResult = result;
        // console.log(fetchResult);
        if(fetchResult==="SignUp Success"){
          document.getElementById("signup-username").value="";
           document.getElementById("emailId").value="";
           document.getElementById("signup-password").value="";
          document.getElementById("mobileNumber").value="";
            document.getElementById("login").style.display = "flex";
        
        document.getElementById("signup").style.display = "none";
        }
        else if(fetchResult === "UserName already taken") {
            const errorMessage = document.getElementById("error-username");
            errorMessage.innerHTML ='<p style= "color:red; font-size:12px">' +fetchResult + '</p>' ; // Display error message
        }
        else if(fetchResult === "Email already exist") {
            const errorMessage = document.getElementById("error-emailId");
            errorMessage.innerHTML ='<p style= "color:red; font-size:12px">' +fetchResult + '</p>' ; // Display error message
        }
        else if(fetchResult === "Mobile number already exist") {
            const errorMessage = document.getElementById("error-mobileNumber");
            errorMessage.innerHTML ='<p style= "color:red; font-size:12px">' +fetchResult + '</p>' ; // Display error message
        }
    })
     .then((error)=>error) 
})

//   post the login form
document.getElementById("login-form").addEventListener("submit", function(event){
    event.preventDefault();
    
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;
    
  
  const myHeaders=new Headers();
  myHeaders.append("Content-Type", "application/json");
  
  const raw= JSON.stringify({
    "username" : username,
    "password" : password,
  });
  
  const requestOptions={
    method: "POST",
    headers: myHeaders,
    body:raw,
    redirect: "follow"
  };
  fetch('http://localhost:8081/login', requestOptions)
      .then(response => {
        
        if (response.ok) {
          return response.text();
        }
        throw new Error('Login failed. Please check your credentials.');
      })
      .then((result)=>{
        if(result==="Invalid username. "||result==="Invalid password. ")
        {
          window.alert(result+"Please try again.");
        }
        else{
          document.getElementById("login-username").value="";
           document.getElementById("login-password").value="";
           localStorage.setItem("token", result); 
           localStorage.setItem("isLoggedIn", "true");
                
                window.location.href = "home.html";
        }
      })
      .catch(error => {
        console.error("Error:", error);
      });
  });

