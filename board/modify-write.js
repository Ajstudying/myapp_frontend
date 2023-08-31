(() => {
  hiddenButton();
  loginLogout();
  const token = getCookie("token");
  console.log(token);
  if (!token) {
    window.location.href = "http://localhost:5500/auth/login.html";
  }
})();

//셀렉트 옵션 추가
(async () => {
  const select = document.forms[0].querySelectorAll("select")[1];

  console.log(select);
  const url = "http://localhost:8080/profile";
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${getCookie("token")}`,
    },
  });
  const result = await response.json();

  console.log(result);

  result.data.forEach((item) => {
    const option =
      /*html*/
      `<option data-pet="${item[3]}"value="${item[2]}">${item[2]}</option>`;
    select.insertAdjacentHTML("beforeend", option);
  });
})();

//수정으로 받아온 쿼리 있을 때
(async () => {
  // URL에서 쿼리 파라미터 가져오기
  const urlParams = new URLSearchParams(window.location.search);
  const boardNo = urlParams.get("boardNo");

  const section = document.querySelector("section");
  const button = section.querySelectorAll("div")[1].querySelector("button");
  if (boardNo) {
    const response = await fetch(`http://localhost:8080/boards/${boardNo}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getCookie("token")}`,
      },
    });

    const form = section.querySelector("form");
    const title = section.querySelectorAll("input")[0];
    const textbox = section.querySelector("textarea");
    const select = document.forms[0].querySelectorAll("select")[0];
    const petname = document.forms[0].querySelectorAll("select")[1];
    const file = section.querySelectorAll("input")[1];

    button.classList.add("modify");
    button.innerHTML = "수정";

    const result = await response.json();
    form.dataset.nickname = result.nickname;
    select.value = result.request;
    title.value = result.title;
    petname.value = result.petname;
    textbox.value = result.content;
    file.src = result.image ? result.image : "";
  } else {
    button.classList.add("add");
    button.innerHTML = "저장";
  }
})();

//수정으로 쿼리를 받아서, 수정 버튼을 눌렀을 때 수정저장되도록
(() => {
  const modifyBtn = document.forms[0].querySelector("button");

  modifyBtn.addEventListener("click", (e) => {
    e.preventDefault();
    console.log(e.target);
    if (e.target.classList.contains("modify")) {
      // URL에서 쿼리 파라미터 가져오기
      const urlParams = new URLSearchParams(window.location.search);
      const boardNo = urlParams.get("boardNo"); // 쿼리 파라미터에서 boardNo 값을 가져옴

      const form = document.querySelector("form");
      const title = form.querySelectorAll("input")[0];
      const select = form.querySelectorAll("select")[0];
      const petname = form.querySelectorAll("select")[1];
      const species = petname[petname.selectedIndex].dataset.pet;
      const content = form.querySelector("textarea");
      const file = form.querySelectorAll("input")[1];
      console.log(species);
      console.log(file.src);

      async function modifyBoard(image) {
        await fetch(`http://localhost:8080/boards/${boardNo}`, {
          method: "PUT",
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${getCookie("token")}`,
          },
          body: JSON.stringify({
            title: title.value,
            content: content.value,
            request: select.value,
            image: image ? image : null,
            species: species,
            petname: petname.value,
          }),
        });
      }
      if (file.files[0]) {
        const reader = new FileReader();
        reader.addEventListener("load", async (e) => {
          const image = e.target.result;
          modifyBoard(image);
          alert("수정이 완료되었습니다.");
          window.location.href = `http://localhost:5500/board/details.html?boardNo=${boardNo}`;
        });
        reader.readAsDataURL(file.files[0]);
      } else if (file.src) {
        const image = file.src;
        modifyBoard(image);
        alert("수정이 완료되었습니다.");
        window.location.href = `http://localhost:5500/board/details.html?boardNo=${boardNo}`;
      } else {
        modifyBoard();
        alert("수정이 완료되었습니다.");
        window.location.href = `http://localhost:5500/board/details.html?boardNo=${boardNo}`;
      }
    }
  });
})();

//추가
(() => {
  //데이터를 추가하기 위해 엘레멘트 찾기
  const inputs = document.forms[0].querySelectorAll("input");
  const textbox = document.forms[0].querySelector("textarea");
  const petname = document.forms[0].querySelectorAll("select")[1];
  const select = document.forms[0].querySelectorAll("select")[0];

  const title = inputs[0];
  const content = textbox;
  const file = inputs[1];

  const add = document.forms[0].querySelector("button");
  add.addEventListener("click", (e) => {
    e.preventDefault();
    if (e.target.classList.contains("add")) {
      if (select.value == "선택") {
        alert("게시글의 종류를 선택해주세요.");
        return;
      }
      if (title.value === "") {
        alert("제목을 입력해주세요.");
        return;
      }

      if (content.value === "") {
        alert("내용을 입력해주세요.");
        return;
      }

      if (petname.value === "반려동물") {
        alert("반려동물을 선택해주세요.");
        return;
      }

      //데이터를 서버에 전송하고, UI 요소 생성
      async function createBoard(image) {
        const species = petname[petname.selectedIndex].dataset.pet;
        console.log(species);
        //서버에 전송하면 UI를 생성한다.
        const response = await fetch("http://localhost:8080/boards", {
          method: "POST",
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${getCookie("token")}`,
          },
          body: JSON.stringify({
            title: title.value,
            content: content.value,
            image: image ? image : null,
            request: select.value,
            species: species,
            petname: petname.value,
          }),
        });
        console.log(response);
      }

      if (file.files[0]) {
        //파일이 있을 때
        //파일 읽은 후 이벤트 실행
        const reader = new FileReader();

        reader.addEventListener("load", async (e) => {
          const image = e.target.result;
          createBoard(image);
        });
        reader.readAsDataURL(file.files[0]);
        alert("작성이 완료되었습니다.");
        window.location.href = `http://localhost:5500/board/board.html`;
      } else {
        //파일이 없을 때
        createBoard();
        alert("작성이 완료되었습니다.");
        window.location.href = `http://localhost:5500/board/board.html`;
      }
    }
  });
})();
