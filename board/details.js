// URL에서 쿼리 파라미터 가져오기
const urlParams = new URLSearchParams(window.location.search);
const boardNo = urlParams.get("boardNo"); // 쿼리 파라미터에서 boardNo 값을 가져옴

(() => {
  hiddenButton();
  loginLogout();
})();

//해당 페이지 조회
(async () => {
  const response = await fetch(`http://localhost:8080/boards/${boardNo}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getCookie("token")}`,
    },
  });
  const section = document.querySelector("section");
  const spans = section.querySelectorAll("span");
  const result = await response.json();

  section.dataset.no = result.no;
  if ([403, 404].includes(response.status)) {
    spans[1].hidden = true;

    const h3 = section.querySelectorAll("h3");
    h3[0].innerHTML = result.species;
    const h4 = section.querySelector("h4");
    h4.innerHTML = result.title;
    const p = section.querySelector("p");
    p.innerHTML = result.content;
    const image = section.querySelector("div");
    image.innerHTML = result.image
      ? `<img src="${result.image}" alt="반려동물사진">`
      : "";
    h3[1].innerHTML = result.nickname;
  } else {
    spans[1].hidden = false;

    const h3 = section.querySelectorAll("h3");
    h3[0].innerHTML = result.species;
    const h4 = section.querySelector("h4");
    h4.innerHTML = result.title;
    const p = section.querySelector("p");
    p.innerHTML = result.content;
    const image = section.querySelector("div");
    image.innerHTML = result.image
      ? `<img src="${result.image}" alt="반려동물사진">`
      : "";
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

  buttons[1].addEventListener("click", async (e) => {
    const removeNumber = section.dataset.no;

    //서버연결
    const response = await fetch(
      `http://localhost:8080/boards/${removeNumber}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      }
    );
    if ([403].includes(response.status)) {
      alert("해당 포스트의 작성자가 아닙니다.");
    } else if ([404].includes(response.status)) {
      alert("해당 포스트를 찾을 수 없습니다.");
    } else {
      section.remove();
      window.location.replace("http://localhost:5500/board/board.html");
    }
  });
})();

//댓글 조회
(async () => {
  const section = document.querySelectorAll("section")[1];
  const response = await fetch(
    `http://localhost:8080/boards/${boardNo}/comments`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getCookie("token")}`,
      },
    }
  );
  const result = await response.json();
  result.findedComment.forEach((item) => {
    section.insertAdjacentHTML("afterbegin", createCard(item));
  });
  result.otherComment.forEach((item) => {
    const card =
      /*html*/
      `<article data-id="${item.id}">
      <div>
      <div>
      <sup><em>${item.ownerName}</em></sup>
      <p>${item.content}</p>
      </div>
      <div>
      <sub>${timeCheck(item.createdTime)}</sub>
      </div>
      </div>
      </article> 
      `;
    section.insertAdjacentHTML("afterbegin", card);
  });
})();

//댓글 등록
(() => {
  const form = document.querySelector("form");
  const content = form.querySelector("input");
  const addBtn = form.querySelector("button");
  const time = new Date();

  addBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    if (content.value === "") {
      alert("댓글을 입력해주세요.");
      return;
    }
    const response = await fetch(
      `http://localhost:8080/boards/${boardNo}/comments`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${getCookie("token")}`,
        },
        body: JSON.stringify({
          content: content.value,
          createdTime: time.getTime(),
        }),
      }
    );
    const result = await response.json();
    const section = document.querySelectorAll("section")[1];
    section.insertAdjacentHTML("afterbegin", createCard(result));
    content.value = "";
  });
})();

//댓글 삭제
(() => {
  const section = document.querySelectorAll("section")[1];

  section.addEventListener("click", async (e) => {
    e.preventDefault();
    const article = e.target.parentElement.parentElement;
    const id = article.dataset.id;
    if (e.target.tagName.toLowerCase() == "button" && e.target.innerHTML === "삭제") {
      //서버연결
      const response = await fetch(
        `http://localhost:8080/boards/${boardNo}/comments/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${getCookie("token")}`,
          },
        }
      );
      if ([404].includes(response.status)) {
        alert("댓글을 찾을 수 없습니다.");
      } else {
        article.remove();
        alert("삭제가 완료되었습니다.");
      }
    }
  });
})();

//댓글 수정
(() => {
  const section = document.querySelectorAll("section")[1];

  section.addEventListener("click",  (e) => {
    e.preventDefault();
    const article = e.target.parentElement.parentElement.parentElement;
    const text = article.querySelector("textarea");
    const textDiv = text.parentElement;
    const time = new Date();
    console.log(text);
    const id = article.dataset.id;
    if (e.target.tagName.toLowerCase() == "button" && e.target.innerHTML === "수정"){
      textDiv.hidden = false;
      const modifyBtn = e.target;
      modifyBtn.innerHTML = "완료";
      modifyBtn.addEventListener("click", async(event) => {
        event.preventDefault();
        const modifyText = text.value;
        console.log(modifyText);
        if(text.value === ""){
          alert("댓글을 입력해주세요.");
          return;
        }
        await fetch(
          `http://localhost:8080/boards/${boardNo}/comments/${id}`,
          {
            method: "PUT",
            headers: {
              "content-type": "application/json",
              Authorization: `Bearer ${getCookie("token")}`,
            },
            body: JSON.stringify({
              content: modifyText,
              createdTime: time.getTime(),
            }),
          }
        );
        const p = article.querySelector("p");
        textDiv.hidden = true;
        p.innerHTML = modifyText;
        modifyBtn.innerHTML = "수정";
      });
    }
  });
})();

function timeCheck(createdTime) {
  const time = new Date();
  const savedTime = new Date(createdTime);
  const savedDay = `${savedTime.getFullYear()}-${savedTime.getMonth()}-${savedTime
    .getDate()
    .toString()}`;
  const currentDay = `${time.getFullYear()}-${time.getMonth()}-${time
    .getDate()
    .toString()}`;
  if (savedDay === currentDay) {
    const currentTime = `${time.getHours().toString().padStart(2, "0")}:
    ${time.getMinutes().toString().padStart(2, "0")}:
    ${time.getSeconds().toString().padStart(2, "0")}`;
    return currentTime;
  } else {
    return savedDay;
  }
}

function createCard(item){
  const card =
      /*html*/
      `<article data-id="${item.id}">
        <div>
        <div>
        <sup><em>${item.ownerName}</em></sup>
        <p>${item.content}</p>
        </div>
        <div>
        <sub>${timeCheck(item.createdTime)}</sub>
        <button>수정</button>
        <button>삭제</button>
        </div>
        </div>
        <div hidden>
        <textarea cols="40" rows="5"></textarea>
        </div>
        </article>
        `;
  return card;
}