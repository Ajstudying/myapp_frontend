// URL에서 쿼리 파라미터 가져오기
const urlParams = new URLSearchParams(window.location.search);
const boardNo = urlParams.get("boardNo"); // 쿼리 파라미터에서 boardNo 값을 가져옴

(() => {
  hiddenButton();
  loginLogout();
})();

//해당 페이지 조회
(() => {
  window.addEventListener("DOMContentLoaded", async () => {
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
  });
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

//해당 페이지 삭제
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

//댓글 조회 //답글도
(() => {
  window.addEventListener("DOMContentLoaded", async () => {
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
    //내가 만든 원댓글 만들기
    result.findedComment.forEach(async (item) => {
      const reply = await fetch(
        `http://localhost:8080/boards/${boardNo}/comments/${item.id}/reply`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${getCookie("token")}`,
          },
        }
      );
      const replyResult = await reply.json();
      const mainReply = document.createElement("article");
      mainReply.dataset.id = item.id;
      mainReply.innerHTML = createCard(item);
      //내 댓글에 답글인데 내 답글
      replyResult.findedReply.forEach((reply) => {
        const replyElement = document.createElement("article");
        replyElement.dataset.id = reply.replyId;
        replyElement.innerHTML = replyCard(reply);
        mainReply.appendChild(replyElement);
      });
      //내 댓글에 답글인데 남의 댓글
      replyResult.otherReply.forEach((reply) => {
        const replyElement = document.createElement("article");
        replyElement.dataset.id = reply.replyId;
        replyElement.innerHTML = card(reply);
        mainReply.appendChild(replyElement);
      });
      section.insertAdjacentElement("afterbegin", mainReply);
    });
    //남의 원댓글
    result.otherComment.forEach(async (item) => {
      const reply = await fetch(
        `http://localhost:8080/boards/${boardNo}/comments/${item.id}/reply`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${getCookie("token")}`,
          },
        }
      );
      const replyResult = await reply.json();
      const mainReply = document.createElement("article");
      mainReply.dataset.id = item.id;
      mainReply.innerHTML =
        /*html*/
        `
      <div>
      <div>
      <sup class="material-symbols-outlined">pets<em>${
        item.ownerName
      }</em></sup>
      <p>${item.content}</p>
      </div>
      <div>
      <sub>${timeCheck(item.createdTime)}</sub>
      <button>답글</button>
      <button hidden>취소</button>
      </div>
      </div>
      <div hidden>
      <textarea cols="40" rows="5"></textarea>
      </div>
      `;
      //남의 댓글 내 답글
      replyResult.findedReply.forEach((reply) => {
        const replyElement = document.createElement("article");
        replyElement.dataset.id = reply.replyId;
        replyElement.innerHTML = replyCard(reply);
        mainReply.appendChild(replyElement);
      });
      //남의 댓글 남의 답글
      replyResult.otherReply.forEach((reply) => {
        const replyElement = document.createElement("article");
        replyElement.dataset.id = reply.replyId;
        replyElement.innerHTML = card(reply);
        mainReply.appendChild(replyElement);
      });
      section.insertAdjacentElement("afterbegin", mainReply);
    });
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
    const article = document.createElement("article");
    article.dataset.id = result.id;
    article.innerHTML = createCard(result);
    section.append(article);
    content.value = "";
  });
})();

//댓글 삭제
(() => {
  const section = document.querySelectorAll("section")[1];

  section.addEventListener("click", async (e) => {
    e.preventDefault();
    const article = e.target.parentElement.parentElement.parentElement;
    const id = article.dataset.id;
    if (
      e.target.tagName.toLowerCase() == "button" &&
      e.target.innerHTML === "삭제" &&
      e.target.classList.contains("delete")
    ) {
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

  section.addEventListener("click", (e) => {
    e.preventDefault();

    if (
      e.target.tagName.toLowerCase() == "button" &&
      e.target.innerHTML === "수정"
    ) {
      const article = e.target.parentElement.parentElement.parentElement;
      const text = article.querySelector("textarea");
      const textDiv = text.parentElement;
      const time = new Date();
      console.log(text);
      const id = article.dataset.id;
      textDiv.hidden = false;
      const modifyBtn = e.target;
      modifyBtn.innerHTML = "등록";
      modifyBtn.addEventListener("click", async (event) => {
        event.preventDefault();
        const modifyText = text.value;
        console.log(modifyText);
        if (text.value === "") {
          alert("댓글을 입력해주세요.");
          return;
        }
        await fetch(`http://localhost:8080/boards/${boardNo}/comments/${id}`, {
          method: "PUT",
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${getCookie("token")}`,
          },
          body: JSON.stringify({
            content: modifyText,
            createdTime: time.getTime(),
          }),
        });
        const p = article.querySelector("p");
        textDiv.hidden = true;
        p.innerHTML = modifyText;
        modifyBtn.innerHTML = "수정";
      });
    }
  });
})();

//답댓 등록
(() => {
  const section = document.querySelectorAll("section")[1];

  section.addEventListener("click", async (e) => {
    e.preventDefault();

    if (
      e.target.tagName.toLowerCase() == "button" &&
      e.target.innerHTML === "답글"
    ) {
      const article = e.target.parentElement.parentElement.parentElement;
      const id = article.dataset.id;
      const text = article.querySelector("textarea");
      const textDiv = text.parentElement;
      const cancel = textDiv.parentElement.querySelectorAll("button")[1];
      const time = new Date();
      textDiv.hidden = false;
      cancel.hidden = false;
      const addBtn = e.target;
      addBtn.innerHTML = "등록";
      cancel.addEventListener("click", (event) => {
        event.preventDefault();
        textDiv.hidden = true;
        cancel.hidden = true;
        addBtn.innerHTML = "답글";
      });
      addBtn.addEventListener("click", async (event) => {
        event.preventDefault();
        const reply = text.value;
        if (text.value === "") {
          alert("답글을 입력해주시거나 취소버튼을 눌러주세요.");
          return;
        }
        const response = await fetch(
          `http://localhost:8080/boards/${boardNo}/comments/${id}/reply`,
          {
            method: "POST",
            headers: {
              "content-type": "application/json",
              Authorization: `Bearer ${getCookie("token")}`,
            },
            body: JSON.stringify({
              content: reply,
              createdTime: time.getTime(),
            }),
          }
        );
        const result = await response.json();
        const replyArticle = document.createElement("article");
        replyArticle.dataset.id = result.replyId;
        replyArticle.innerHTML = replyCard(result);
        article.appendChild(replyArticle);
        textDiv.hidden = true;
        cancel.hidden = true;
        addBtn.innerHTML = "답글";
        text.value = "";
      });
    }
  });
})();

//답글 삭제
(() => {
  const section = document.querySelectorAll("section")[1];
  section.addEventListener("click", async (e) => {
    e.preventDefault();

    const replyArticle = e.target.parentElement.parentElement.parentElement;
    const article = replyArticle.parentElement;
    console.log(article);
    const replyId = replyArticle.dataset.id;
    const id = article.dataset.id;
    if (
      e.target.tagName.toLowerCase() == "button" &&
      e.target.innerHTML === "삭제" &&
      e.target.classList.contains("remove")
    ) {
      //서버연결
      const response = await fetch(
        `http://localhost:8080/boards/${boardNo}/comments/${id}/reply/${replyId}`,
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
        replyArticle.remove();
        alert("삭제가 완료되었습니다.");
      }
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
    const currentTime = `${savedTime.getHours().toString().padStart(2, "0")}:
    ${savedTime.getMinutes().toString().padStart(2, "0")}:
    ${savedTime.getSeconds().toString().padStart(2, "0")}`;
    return currentTime;
  } else {
    return savedDay;
  }
}

function createCard(item) {
  const card =
    /*html*/
    `<div>
      <div>
      <sup class="material-symbols-outlined">pets<em>${
        item.ownerName
      }</em></sup>
      <p>${item.content}</p>
      </div>
      <div>
      <sub>${timeCheck(item.createdTime)}</sub>
      <button>수정</button>
      <button class="delete">삭제</button>
      </div>
      </div>
      <div hidden>
      <textarea cols="40" rows="5"></textarea>
      </div>`;
  return card;
}

function replyCard(result) {
  const card =
    /*html*/
    `<div>
      <div>
      <sup class="material-symbols-outlined">pets<em>${
        result.ownerName
      }</em></sup>
      <p>${result.content}</p>
      </div>
      <div>
      <sub>${timeCheck(result.createdTime)}</sub>
      <button class="remove">삭제</button>
      </div>
      </div>
        `;
  return card;
}
function card(reply) {
  const card =
    /*html*/
    `<div>
      <div>
      <sup class="material-symbols-outlined">pets<em>${
        reply.ownerName
      }</em></sup>
      <p>${reply.content}</p>
      </div>
      <div>
      <sub>${timeCheck(reply.createdTime)}</sub>
      </div>
      </div>`;
  return card;
}
