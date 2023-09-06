(() => {
  hiddenButton();
  loginLogout();
})();

//첫화면 조회
(() => {
  document.addEventListener("DOMContentLoaded", () => {
    // const rotateElement = document.getElementsByClassName("rotate");
    // for(let i = 0; i < rotateElement.length; i++){
    //   rotateElement[i].classList.add("rotate-animate");
    // }
  });
})();

//일정관리 해당 일에 얼럿창
(async () => {
  const current = new Date();
  const currentDay = `${current.getFullYear()}-${
    current.getMonth() + 1
  }-${current.getDate().toString()}`;
  const response = await fetch(`http://localhost:8080/schedule`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getCookie("token")}`,
    },
  });

  const result = await response.json();
  result.forEach((item) => {
    const time = new Date(item.reservationTime);
    const reservationTime = `${time.getFullYear()}-${time.getMonth() + 1}-${time
      .getDate()
      .toString()}`;
    console.log(currentDay);
    console.log(reservationTime);
    if (currentDay == reservationTime) {
      alert(`${item.petname}의 ${item.content} 날입니다.`);
    }
  });
})();
