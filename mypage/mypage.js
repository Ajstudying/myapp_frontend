(() => {
  hiddenButton();
  loginLogout();
  const token = getCookie("token");
  console.log(token);
  if (!token) {
    window.location.href = "http://localhost:5500/auth/login.html";
  }
})();

function mytable(item) {
  const table =
    /*html*/
    `<tr data-no="${item[6]}">
    <th class="material-symbols-outlined">pets</th>
  <th>펫이름: </th>
  <td>${item[2]}</td>
  <td><button>수정</button> <button>삭제</button></td>
  </tr>
  <tr>
  <th class="material-symbols-outlined">pet_supplies</th>
  <th>펫종류: </th>
  <td>${item[3]}</td>
  </tr>
  `;
  return table;
}

//프로필 조회
(async () => {
  const url = "http://localhost:8080/profile";
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${getCookie("token")}`,
    },
  });
  if ([401, 403].includes(response.status)) {
    // 로그인 페이지로 튕김
    alert("인증처리가 되지 않았습니다.");
    window.location.href = "/login.html";
  }
  const results = await response.json();

  const userTable = document.querySelectorAll("table")[0];
  const profileTbody = document
    .querySelectorAll("table")[1]
    .querySelector("tbody");
  const myArticles = document.querySelectorAll("table")[2];

  results.data.forEach((item) => {
    profileTbody.insertAdjacentHTML("beforeend", mytable(item));
  });
  const id = userTable.querySelectorAll("td")[0];
  const nickname = userTable.querySelectorAll("td")[2];
  id.innerHTML = results.data[0][0];
  nickname.innerHTML = results.data[0][1];

  const petArticle = myArticles.querySelectorAll("td")[0];
  const boardArticle = myArticles.querySelectorAll("td")[2];

  petArticle.innerHTML = `<ins data-nick="${results.data[0][1]}">${results.data[0][4]}건</ins>`;
  boardArticle.innerHTML = `<ins>${results.data[0][5]}건</ins>`;
})();

//포스트, 정보나눔 조회
(() => {
  const myArticles = document.querySelectorAll("table")[2];
  const posts = myArticles.querySelectorAll("td")[0];
  const boards = myArticles.querySelectorAll("td")[1];

  posts.addEventListener("click", (e) => {
    e.preventDefault();
    const nickname = posts.querySelector("ins").dataset.nick;
    window.location.href = `http://localhost:5500/pet/pet-index.html?nickname=${nickname}`;
  });
  boards.addEventListener("click", (e) => {
    e.preventDefault();
    const nickname = posts.querySelector("ins").dataset.nick;
    window.location.href = `http://localhost:5500/board/board.html?nickname=${nickname}`;
  });
})();

//추가
(() => {
  const profile = document.querySelectorAll("h3")[1];
  const addBtn = profile.querySelector("button");
  addBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const layer = document.querySelector("section");
    const insertbox = document.querySelector("article");
    const title = layer.querySelector("h5");

    h5.innerHTML = "< 추가 >";
    layer.hidden = false;
  });
})();
