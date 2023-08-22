let currentPage = 0; //현재 페이지 번호
let isLastPage = false; //마지막 페이지 인지 여부 
const MAX_PAGE = 10;// 고정된 페이지 갯수
let currentQuery = ""; // 현재 검색 키워드

(() => {
  const token = getCookie("token");
  console.log(token);
  if(!token){
    window.location.href = "http://localhost:5500/auth/login.html"
  }
  hiddenButton();
  loginLogout();
})();

async function getPagedBoard(page, option, query){
  const section = document.querySelector("section");
    let url = "";
    if(query) {
      url = `http://localhost:8080/boards/paging/search?page=${page}&size=${MAX_PAGE}&${option}=${query}`
    }else{
      url = `http://localhost:8080/boards/paging?page=${page}&size=${MAX_PAGE}`;
    }

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${getCookie(
          "token"
        )}`,
      },
    });
    if ([401, 403].includes(response.status)) {
      // 로그인 페이지로 튕김
      alert("인증처리가 되지 않았습니다.");
      window.location.href = "http://localhost:5500/auth/login.html";
    }

    const results = await response.json();

    //목록초기화
    section.innerHTML = "";
    const result = results.content;
    const ul = document.createElement("ul");
    section.append(ul);
    result.forEach(item => {
      const li = document.createElement("li");
      const template = /*html*/
      `<div><sub>${item.species}</sub></div>
      <div>
      <span>${item.title}</span>
      <span>${item.nickname}</span>
      <span>${new Date(item.createdTime).toLocaleString()}</span>
      </div>`;
      li.dataset.no = item.no;
      console.log(item.no);
      li.insertAdjacentHTML("afterbegin", template);
      ul.append(li);
    });

  currentPage = results.number; //현재 페이지 설정
  isLastPage = results.last; // 마지막 페이지 여부
      
  //이전 /다음 버튼 활성화 처리
  setBtnActive();
}
(() => {
  hiddenButton();
  loginLogout();
  window.addEventListener("DOMContentLoaded", () => {
    getPagedBoard(0);
  });
})();

function setBtnActive() {
  const sections = document.querySelectorAll("section");
  const buttons = sections[1].querySelectorAll("button");

  const btnPrev = buttons[0];
  const btnNext = buttons[1];

  //첫번째 페이지면 이전 버튼 비활성화
  if(currentPage === 0){
    btnPrev.disabled = true;
  }else{
    btnPrev.disabled = false;
  }
  //마지막 페이지면 다음 버튼 비활성화
  if(isLastPage) {
    btnNext.disabled = true;
  }else{
    btnNext.disabled = false;
  }

}

//페이징
(() => {
  const sections = document.querySelectorAll("section");
  const buttons = sections[1].querySelectorAll("button");

  const btnPrev = buttons[0];
  const btnNext = buttons[1];

  //이전 버튼
  btnPrev.addEventListener("click", (e) => {
    e.preventDefault();
    currentPage > 0 && getPagedMemo(currentPage -1, currentQuery);
  });
  //다음 버튼
  btnNext.addEventListener("click", (e) => {
    e.preventDefault();
    !isLastPage && getPagedMemo(currentPage + 1, currentQuery);
  });
})();

//검색기능
(() => {
  const option = document.querySelector("select");
  const textQuery = document.querySelector("input");
  const buttons = document.querySelectorAll("section")[1].querySelectorAll("button");
  const btnSearch = buttons[2];
  
  btnSearch.addEventListener("click", (e) => {
    e.preventDefault();
    currentQuery = textQuery.value;
    getPagedBoard(0, option, currentPage);
  });

  textQuery.addEventListener("keyup", (e) => {
    e.preventDefault();
    currentQuery = textQuery.value;
    getPagedBoard(0, option, currentPage);
  });

})();

//검색조건 초기화
(() => {
  const btnReset = document.querySelectorAll("section")[1].querySelectorAll("button")[3];

  btnReset.addEventListener("click", (e) => {
    e.preventDefault();
    document.forms[0].reset();
    currentQuery = "";
    getPagedBoard(0, currentQuery);
  });
})();

// //상세페이지 이동
// (() => {
//   const ul = document.querySelector("ul");
//   ul.addEventListener("click", (e) => {
//     e.preventDefault();
//     console.log(e.target);
//     if(e.target.tagName.toLowerCase() === "li"){
//       const boardNo = e.target.parentElement.dataset.no;

//       window.location.href = `http://localhost:5500/boards/details.html?boardNo=${boardNo}`;
//     }
//   })
// })();
