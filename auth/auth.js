function getCookie(name) {
  let matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

function hiddenButton(){
  const token = getCookie("token");
  const aside = document.querySelector("aside");
  const buttons = aside.querySelectorAll("button");
  if(!token){ 
    buttons[0].hidden = true;
    buttons[1].hidden = true;
    buttons[3].hidden = true;
  } else{
    buttons[2].hidden = true;
  }
}

function loginLogout() {
  const divs = document.querySelectorAll("div");
  const buttons = divs[1].querySelectorAll("button");

  buttons[0].addEventListener("click", (e) => {
    e.preventDefault();
    window.location.replace("http://localhost:5500/auth/login.html");
  })
  buttons[1].addEventListener("click", async(e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    // const response = await fetch(`http://localhost:8080/auth/logout`, {

    // });
    //   console.log(response);
    window.location.replace("http://localhost:5500/index.html")
  })
}
