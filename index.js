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
  const current = new Date();
  const currentDay = `${current.getFullYear()}-${current.getMonth() + 1}-${current.getDate().toString()}`;
  const response = await fetch(`http://localhost:8080/reserve/${currentDay}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getCookie(
        "token"
      )}`,
    },
  });

  const result = await response.json();
  result.forEach(item => {
    const time= new Date(item.reservationTime);
    //getMonth에 +1한 값을 저장했기 때문에 reservationTime은 +1 추가 안함.
    const reservationTime = `${time.getFullYear()}-${time.getMonth()}-${time.getDate().toString()}`;
    console.log(currentDay);
    console.log(reservationTime);
    if(currentDay == reservationTime){
      alert(`${item.petname}의 ${item.content} 날입니다.`)
    }
  });

})();