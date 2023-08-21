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

(async() => {
  const currentDay = new Date().getTime();
  console.log(currentDay);
  const response = await fetch(`http://localhost:8080/reserve/${currentDay}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getCookie(
        "token"
      )}`,
    },
  });
  const result = response.json();
  console.log(result);
  if([202].includes(response.status)){
    alert("병원 예약일입니다.");
  }

})();