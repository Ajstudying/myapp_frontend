(() => {
  const token = getCookie("token");
  console.log(token);
  if (!token) {
    window.location.href = `${frontUrl()}/auth/login.html`;
  }
  hiddenButton();
  loginLogout();
})();

function mytable(item) {
  const table =
    /*html*/
    `<tr data-no="${item[7]}">
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
  const url = `${apiUrl()}/profile`;
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
  const boardArticle = myArticles.querySelectorAll("td")[1];
  const schedule = myArticles.querySelectorAll("td")[2];

  petArticle.innerHTML = `<ins data-nick="${results.data[0][1]}">${results.data[0][4]}건</ins>`;
  boardArticle.innerHTML = `<ins>${results.data[0][5]}건</ins>`;
  schedule.innerHTML = `<ins>${results.data[0][6]}건</ins>`;
})();

//포스트, 정보나눔 조회
(() => {
  const myArticles = document.querySelectorAll("table")[2];
  const posts = myArticles.querySelectorAll("td")[0];
  const boards = myArticles.querySelectorAll("td")[1];
  const schedule = myArticles.querySelectorAll("td")[2];
  console.log(posts);
  posts.addEventListener("click", (e) => {
    e.preventDefault();
    if (e.target.tagName.toLowerCase() === "ins") {
      const nickname = posts.querySelector("ins").dataset.nick;
      window.location.href = `${frontUrl()}/pet/pet-index.html?nickname=${nickname}`;
    }
  });
  boards.addEventListener("click", (e) => {
    e.preventDefault();
    if (e.target.tagName.toLowerCase() === "ins") {
      const nickname = posts.querySelector("ins").dataset.nick;
      window.location.href = `${frontUrl()}/board/board.html?nickname=${nickname}`;
    }
  });
  schedule.addEventListener("click", (e) => {
    e.preventDefault();
    if (e.target.tagName.toLowerCase() === "ins") {
      window.location.href = `${frontUrl()}/schedule/schedule.html`;
    }
  });
})();

//프로필 추가
(() => {
  const profile = document.querySelectorAll("h3")[1];
  const addBtn = profile.querySelector("button");
  addBtn.addEventListener("click", (e) => {
    e.preventDefault();
    console.log(e.target);
    const layer = document.querySelector("section");
    const title = layer.querySelector("h5");

    title.innerHTML = "< 추가 >";
    layer.hidden = false;
    const buttons = layer.querySelectorAll("button");
    //취소버튼
    buttons[1].addEventListener("click", (e) => {
      e.preventDefault();
      cleanLayer();
      layer.hidden = true;
    });
    //추가
    buttons[0].addEventListener("click", async (e) => {
      e.preventDefault();
      const inputs = layer.querySelectorAll("input");
      const petname = inputs[0];
      const species = inputs[1];
      if (petname.value == "") {
        alert("반려동물의 이름을 입력해주세요.");
        return;
      }
      if (species.value == "") {
        alert("반려동물의 종류를 입력해주세요.");
        return;
      }
      await fetch(`${apiUrl()}/profile`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${getCookie("token")}`,
        },
        body: JSON.stringify({
          petname: petname.value,
          species: species.value,
          user: null,
        }),
      });
      cleanLayer();
      layer.hidden = true;
      window.location.reload();
    });
  });
})();

function cleanLayer() {
  const layer = document.querySelector("section");
  const inputs = layer.querySelectorAll("input");
  const title = layer.querySelector("h5");
  title.innerHTML = "";
  inputs[0].value = "";
  inputs[1].value = "";
}

//프로필 삭제
(() => {
  const profile = document.querySelectorAll("table")[1];
  profile.addEventListener("click", async (e) => {
    e.preventDefault();
    const tr = e.target.closest("tr");
    console.log(tr);
    const buttons = tr.querySelectorAll("button");
    const removeBtn = buttons[1];

    if (e.target === removeBtn) {
      const removeNum = tr.dataset.no;

      //서버연결
      const response = await fetch(`${apiUrl()}/profile/${removeNum}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      });
      if ([404].includes(response.status)) {
        alert("해당 프로필이 존재하지 않습니다.");
      }
      tr.remove();
      window.location.reload();
    }
  });
})();

//수정
(() => {
  const profile = document.querySelectorAll("table")[1];
  profile.addEventListener("click", async (e) => {
    e.preventDefault();
    const tr = e.target.closest("tr");
    console.log(tr);
    const buttons = tr.querySelectorAll("button");
    const modifyBtn = buttons[0];

    if (e.target === modifyBtn) {
      const layer = document.querySelector("section");
      const modifyBox = document.querySelector("article");
      const title = modifyBox.querySelector("h5");
      title.innerHTML = "< 수정 >";
      layer.hidden = false;

      const inputs = layer.querySelectorAll("input");
      const petname = tr.querySelector("td");
      inputs[0].value = petname.innerHTML;
      const species = tr.nextElementSibling.querySelector("td");
      inputs[1].value = species.innerHTML;
      //취소
      const buttons = layer.querySelectorAll("button");
      buttons[1].addEventListener("click", (e) => {
        e.preventDefault();
        cleanLayer();
        layer.hidden = true;
      });
      //수정
      buttons[0].addEventListener("click", async (e) => {
        e.preventDefault();
        const no = tr.dataset.no;

        const modifyPetName = inputs[0].value;
        const modifySpecies = inputs[1].value;

        await fetch(`${apiUrl()}/profile/${no}`, {
          method: "PUT",
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${getCookie("token")}`,
          },
          body: JSON.stringify({
            petname: modifyPetName,
            species: modifySpecies,
          }),
        });

        petname.innerHTML = inputs[0].value;
        species.innerHTML = inputs[1].value;
        cleanLayer();
        layer.hidden = true;
      });
    }
  });
})();
