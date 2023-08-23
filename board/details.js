(() => {
  hiddenButton();
  loginLogout();
})();



(async() => {
  // URL에서 쿼리 파라미터 가져오기
  const urlParams = new URLSearchParams(window.location.search);
  const boardNo = urlParams.get('boardNo'); // 쿼리 파라미터에서 postNo 값을 가져옴
  
  const response = await fetch(`http://localhost:8080/boards/${boardNo}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${getCookie(
            "token"
            )}`,
        },
  });
  const section = document.querySelector("section");
  const button = section.querySelector("button");
  const result = await response.json();
    
  section.dataset.no = result.no;
  if([403, 404].includes(response.status)){
    button.hidden = true;

    const h3 = section.querySelectorAll("h3");
    h3[0].innerHTML = result.species;
    const h4 = section.querySelector("h4");
    h4.innerHTML = result.title;
    const p = section.querySelector("p");
    p.innerHTML = result.content;
    const image = section.querySelector("div");
    image.innerHTML = result.image ? `<img src="${result.image}" alt="반려동물사진">` : "";
    h3[1].innerHTML = result.nickname;
  }else {
    button.hidden = false;

    const h3 = section.querySelectorAll("h3");
    h3[0].innerHTML = result.species;
    const h4 = section.querySelector("h4");
    h4.innerHTML = result.title;
    const p = section.querySelector("p");
    p.innerHTML = result.content;
    const image = section.querySelector("div");
    image.innerHTML = result.image ? `<img src="${result.image}" alt="반려동물사진">` : "";
    h3[1].innerHTML = result.nickname;
  
  }
  
})();

//수정/삭제 페이지 이동
(() => {
  const section = document.querySelector("section");
  const button = section.querySelector("button");

  button.addEventListener("click", (e) => {
    e.preventDefault();
    const boardNo = section.dataset.no;

    window.location.href = `http://localhost:5500/board/modify.html?boardNo=${boardNo}`;
  });

})();

function isVarify(boardNo){

}

