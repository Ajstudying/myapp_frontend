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