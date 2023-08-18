(() => {
  hiddenButton();
  const token = getCookie("token");
  console.log(token);
  if(!token){
    window.location.href = "http://localhost:8080/auth/login.html"
  }

})();