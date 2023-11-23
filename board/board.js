let currentPage = 0; //현재 페이지 번호
let isLastPage = false; //마지막 페이지 인지 여부
const MAX_PAGE = 5; // 고정된 페이지 갯수
let currentQuery = ""; // 현재 검색 키워드

(() => {
  const token = getCookie("token");
  console.log(token);
  if (!token) {
    window.location.href = `${frontUrl()}/auth/login.html`;
  }
  hiddenButton();
  loginLogout();
})();

//게시글 모양
async function getPagedBoard(page, option, query) {
  const section = document.querySelectorAll("section")[0];
  let url = "";
  if (query) {
    url = `${apiUrl()}/boards/paging/search?page=${page}&size=${MAX_PAGE}&${option}=${query}`;
  } else {
    url = `${apiUrl()}/boards/paging?page=${page}&size=${MAX_PAGE}`;
  }

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${getCookie("token")}`,
    },
  });
  if ([401, 403].includes(response.status)) {
    // 로그인 페이지로 튕김
    alert("인증처리가 되지 않았습니다.");
    window.location.href = `${frontUrl()}/auth/login.html`;
  }

  const results = await response.json();

  //목록초기화
  section.innerHTML = "";
  const result = results.content;
  const ul = document.createElement("ul");
  section.append(ul);
  result.forEach((item) => {
    const time = new Date(item.createdTime);
    const reservationTime = `${time.getFullYear()}-${time.getMonth()}-${time
      .getDate()
      .toString()}`;
    const li = document.createElement("li");
    const hr = document.createElement("hr");
    const request =
      item.request === "inquiry"
        ? "문의"
        : item.request === "recommend"
        ? "추천"
        : "";
    const template =
      /*html*/
      `<div><sub>${item.species}</sub><button data-request="${item.request}">${request}</button></div>
      <div>
      <span>
      <p class="title">${item.title}</p>
      </span>
      <span>
      <p>작성자: ${item.nickname}</p>
      <p>${reservationTime}</p>
      </span>
      </div>`;
    li.dataset.no = item.no;
    li.insertAdjacentHTML("afterbegin", template);
    ul.append(li);
    ul.append(hr);
  });

  currentPage = results.number; //현재 페이지 설정
  isLastPage = results.last; // 마지막 페이지 여부

  //이전 /다음 버튼 활성화 처리
  setBtnActive();
}

//맨처음 화면 열었을 때
(() => {
  window.addEventListener("DOMContentLoaded", async () => {
    // URL에서 쿼리 파라미터 가져오기
    const urlParams = new URLSearchParams(window.location.search);
    const nickname = urlParams.get("nickname"); // 쿼리 파라미터에서 nickname 값을 가져옴
    if (nickname) {
      const response = await fetch(
        `${apiUrl()}/boards/nickname/${nickname}?page=0&size=5`,
        {
          headers: {
            Authorization: `Bearer ${getCookie("token")}`,
          },
        }
      );
      const results = await response.json();
      const section = document.querySelectorAll("section")[0];
      section.innerHTML = "";
      const result = results.content;
      const ul = document.createElement("ul");
      section.append(ul);
      result.forEach((item) => {
        const time = new Date(item.createdTime);
        const reservationTime = `${time.getFullYear()}-${time.getMonth()}-${time
          .getDate()
          .toString()}`;
        const li = document.createElement("li");
        const hr = document.createElement("hr");
        const request =
          item.request === "inquiry"
            ? "문의"
            : item.request === "recommend"
            ? "추천"
            : "";
        const template =
          /*html*/
          `<div><sub>${item.species}</sub><button data-request="${item.request}">${request}</button></div>
      <div>
      <span>
      <p class="title">${item.title}</p>
      </span>
      <span>
      <p>작성자: ${item.nickname}</p>
      <p>${reservationTime}</p>
      </span>
      </div>`;
        li.dataset.no = item.no;
        li.insertAdjacentHTML("afterbegin", template);
        ul.append(li);
        ul.append(hr);
      });
      currentPage = results.number; //현재 페이지 설정
      isLastPage = results.last; // 마지막 페이지 여부

      //이전 /다음 버튼 활성화 처리
      setBtnActive();
    } else {
      getPagedBoard(0);
    }
  });
})();

//상세페이지 이동
(() => {
  const section = document.querySelector("section");
  section.addEventListener("click", (e) => {
    e.preventDefault();

    if (e.target.classList.contains("title")) {
      const li = e.target.closest("li");
      const boardNo = li.dataset.no;

      window.location.href = `${frontUrl()}/board/details.html?boardNo=${boardNo}`;
    }
  });
})();

function setBtnActive() {
  const sections = document.querySelectorAll("section");
  const buttons = sections[1].querySelectorAll("button");

  const btnPrev = buttons[0];
  const btnNext = buttons[1];

  //첫번째 페이지면 이전 버튼 비활성화
  if (currentPage === 0) {
    btnPrev.disabled = true;
  } else {
    btnPrev.disabled = false;
  }
  //마지막 페이지면 다음 버튼 비활성화
  if (isLastPage) {
    btnNext.disabled = true;
  } else {
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
    currentPage > 0 && getPagedBoard(currentPage - 1, currentQuery);
  });
  //다음 버튼
  btnNext.addEventListener("click", (e) => {
    e.preventDefault();
    !isLastPage && getPagedBoard(currentPage + 1, currentQuery);
  });
})();

//검색기능
(() => {
  const option = document.querySelector("select");
  const textQuery = document.querySelector("input");
  const buttons = document.querySelector("form").querySelectorAll("button");
  const btnSearch = buttons[0];

  btnSearch.addEventListener("click", (e) => {
    e.preventDefault();
    currentQuery = textQuery.value;
    getPagedBoard(0, option.value, currentQuery);
  });

  textQuery.addEventListener("keyup", (e) => {
    e.preventDefault();
    if (e.key.toLowerCase() === "enter") {
      currentQuery = textQuery.value;
      getPagedBoard(0, option.value, currentQuery);
    }
  });
})();

//검색조건 초기화
(() => {
  const btnReset = document.querySelector("form").querySelectorAll("button")[1];

  btnReset.addEventListener("click", (e) => {
    e.preventDefault();
    document.forms[0].reset();
    currentQuery = "";
    getPagedBoard(0, currentQuery);
  });
})();

//문의/추천 등 글자를 눌렀을 때 해당 것만 나오게 검색 페이지 기능.
(() => {
  const section = document.querySelector("section");

  section.addEventListener("click", async (e) => {
    e.preventDefault();
    if (e.target.tagName.toLowerCase() == "button") {
      const request = e.target.dataset.request;
      console.log(request);

      const response = await fetch(
        `${apiUrl()}/boards/paging/request?page=0&size=${MAX_PAGE}&request=${request}`,
        {
          headers: {
            Authorization: `Bearer ${getCookie("token")}`,
          },
        }
      );
      const results = await response.json();

      //목록초기화
      section.innerHTML = "";
      const result = results.content;
      const ul = document.createElement("ul");
      section.append(ul);
      result.forEach((item) => {
        const time = new Date(item.createdTime);
        const reservationTime = `${time.getFullYear()}-${time.getMonth()}-${time
          .getDate()
          .toString()}`;
        const li = document.createElement("li");
        const hr = document.createElement("hr");
        const request =
          item.request === "inquiry"
            ? "문의"
            : item.request === "recommend"
            ? "추천"
            : "";
        const template =
          /*html*/
          `<div><sub>${item.species}</sub><button data-request="${item.request}">${request}</button></div>
      <div>
      <span>
      <p class="title">${item.title}</p>
      </span>
      <span>
      <p>작성자: ${item.nickname}</p>
      <p>${reservationTime}</p>
      </span>
      </div>`;
        li.dataset.no = item.no;
        li.insertAdjacentHTML("afterbegin", template);
        ul.append(li);
        ul.append(hr);
      });

      currentPage = results.number; //현재 페이지 설정
      isLastPage = results.last; // 마지막 페이지 여부

      //이전 /다음 버튼 활성화 처리
      setBtnActive();
    }
  });
})();
