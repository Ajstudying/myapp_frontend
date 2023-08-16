(()=> {
  const divs = document.querySelectorAll("div");
  const buttons = divs[1].querySelectorAll("button");

  buttons[0].addEventListener("click", (e) => {
    e.preventDefault();
    window.location.replace("http://localhost:5500/login.html");
  })
  buttons[1].addEventListener("click", async(e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    // const response = await fetch(`http://localhost:8080/auth/logout`, {

    // });
    //   console.log(response);
    window.location.replace("http://localhost:5500/index.html")
  })
})();

(() => {
  document.addEventListener("DOMContentLoaded", () => {
    const rotateElement = document.getElementsByClassName("rotate");
    for(let i = 0; i < rotateElement.length; i++){
      rotateElement[i].classList.add("rotate-animate");
    }
  });
})();