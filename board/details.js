(() => {
  hiddenButton();
  loginLogout();
})();



(async() => {
  // URL에서 쿼리 파라미터 가져오기
  const urlParams = new URLSearchParams(window.location.search);
  const boardNo = urlParams.get('boardNo'); // 쿼리 파라미터에서 boardNo 값을 가져옴
  
  const response = await fetch(`http://localhost:8080/boards/${boardNo}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${getCookie(
            "token"
            )}`,
        },
  });
  const section = document.querySelector("section");
  const spans = section.querySelectorAll("span");
  const result = await response.json();
    
  section.dataset.no = result.no;
  if([403, 404].includes(response.status)){
    spans[1].hidden = true;

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
    spans[1].hidden = false;

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

//수정 페이지 이동
(() => {
  const section = document.querySelector("section");
  const button = section.querySelector("button");

  button.addEventListener("click", (e) => {
    e.preventDefault();
    const boardNo = section.dataset.no;

    window.location.href = `http://localhost:5500/board/modify-write.html?boardNo=${boardNo}`;
  });

})();

//삭제
(() => {
  const section = document.querySelector("section");
  const buttons = section.querySelectorAll("button");

  buttons[1].addEventListener("click", async(e) => {
    const removeNumber = section.dataset.no;
    
    //서버연결
    const response = await fetch(`http://localhost:8080/boards/${removeNumber}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getCookie(
            "token"
          )}`,
        },
      });
      if ([403].includes(response.status)) {
        alert("해당 포스트의 작성자가 아닙니다.");
      }else if([404].includes(response.status)){
        alert("해당 포스트를 찾을 수 없습니다.");
      }else{
      section.remove();
      window.location.replace("http://localhost:5500/board/board.html");
      }
  });
})();
