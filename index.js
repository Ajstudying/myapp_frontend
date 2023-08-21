(() => {
  hiddenButton();
  loginLogout();
})();

(() => {
  document.addEventListener("DOMContentLoaded", () => {
    const rotateElement = document.getElementsByClassName("rotate");
    for(let i = 0; i < rotateElement.length; i++){
      rotateElement[i].classList.add("rotate-animate");
    }
  });
})();