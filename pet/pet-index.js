let currentPage = 0; //현재 페이지 번호
let isLastPage = false; //마지막 페이지 인지 여부 
const MAX_MEMO = 4;// 고정된 메모 갯수
let currentQuery = ""; // 현재 검색 키워드

//메모 형태
function cardTemplate(item, token){
  const imageElement = item.image ? `<img src="${item.image}" alt="반려동물사진">` : "";
  const template =  /*html*/
    `<article data-no="${item.no}">
    <div>
    <h4>${item.title}</h4>
    <select>
    <option>선택</option>
    <option class="modify" value="modify">수정</option>
    <option class="delete" value="delete">삭제</option>
    </select>
    </div>
    <hr>
    <h5><sub>생성시간: ${new Date(item.createdTime).toLocaleString()}</sub></h5>
    <div>
    ${imageElement}
    </div>
    <div>
    <p>${item.content}</p>
    <div>
    </div>
    </div>
    <hr>
    <div>
    <h3>${item.petname}</h3>
    <h3>${item.nickname}</h3>
    </div>
    </article>`;
    return template;
}

//메모를 찾아서 조회 후 화면에 보이는 메서드
async function getPagedMemo(page, query){
  const section = document.querySelector("section");
  let url = "";
  if(query){
    url = `http://localhost:8080/posts/paging/search?page=${page}&size=${MAX_MEMO}&query=${query}`
  }else {
    url = `http://localhost:8080/posts/paging?page=${page}&size=${MAX_MEMO}`;
  }
  const response = await fetch(url);

  const results = await response.json();

  //목록 초기화
  section.innerHTML = "";
  results.content.forEach(item => {
    
    const token = getCookie("token");
    if(!token){
      section.insertAdjacentHTML("beforeend", cardTemplate(item));
    }else{
      section.insertAdjacentHTML("beforeend", cardTemplate(item, token));
    }
          
  });

  currentPage = results.number;
  isLastPage = results.last;
  //페이징 버튼
  setBtnActive();
}

//화면을 처음 켰을 때 첫번째 페이지 조회
(async() => {
  hiddenButton();
  loginLogout();
  window.addEventListener("DOMContentLoaded", () => {
    getPagedMemo(0);
  });
})();

//검색 기능
(() => {
  const textQuery = document.forms[0].querySelector("input");
  const btnSearch = document.forms[0].querySelector("button");

  console.log(textQuery);
  console.log(btnSearch);

  btnSearch.addEventListener("click", (e) => {
    e.preventDefault();
    currentQuery = textQuery.value;
    getPagedMemo(0, currentQuery);
  });

  textQuery.addEventListener("keyup", (e) => {
    e.preventDefault();
    if(e.key.toLowerCase() === "enter"){
      currentQuery = textQuery.value;
      getPagedMemo(0, currentQuery);
    }
  });
})();

//검색 조건 초기화
(() => {
  const btnReset = document.forms[0].querySelectorAll("button")[0];
  btnReset.addEventListener("click", (e) => {
    e.preventDefault();
    document.forms[0].reset();
    currentQuery = "";
    getPagedMemo(0, currentQuery);
  });
})();

//페이징 버튼
function setBtnActive() {
  //버튼 선택
  const paging = document.getElementById("paging");
  const buttons = paging.querySelectorAll("button");

  const btnPrev = buttons[0];
  const btnNext = buttons[1];

  if(currentPage === 0){
    btnPrev.disabled = true;
  }else{
    btnPrev.disabled = false;
  }
 
  if(isLastPage) {
    btnNext.disabled = true;
  }else{
    btnNext.disabled = false;
  }
}

//페이징
(() => {
  const paging = document.getElementById("paging");
  const buttons = paging.querySelectorAll("button");

  const btnPrev = buttons[0];
  const btnNext = buttons[1];
  console.log(btnPrev);
  console.log(btnNext);

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

//삭제
(() => {
  const section = document.querySelector("section");
  let previousValue = null; 
  section.addEventListener("click", async(e) => {
    e.preventDefault();
    const select = e.target.closest("select");
    const article = select.parentElement.parentElement;
    const number = article.dataset.no;
    if (!select) return;
    const currentValue = select.value;
    if (currentValue !== previousValue) {
      previousValue = currentValue;
      if(currentValue === "delete"){
        //서버연결
        const response = await fetch(`http://localhost:8080/posts/${number}`,
        {
          method: "DELETE",
          headers: {
          Authorization: `Bearer ${getCookie(
            "token"
          )}`,
          },
         });
         if([401, 403].includes(response.status)) {
          hasChanged = false;
          alert("해당 포스트의 작성자가 아닙니다.");
        }else if([404].includes(response.status)){
          hasChanged = false;
          alert("해당 포스트를 찾을 수 없습니다.");
        }else{
          article.remove();
          hasChanged = false;
          alert("삭제가 완료 되었습니다.");
        }
      }
    }
  });
})();

//수정
(() => {
  const section = document.querySelector("section");
  let previousValue = null; 
  section.addEventListener("click", async(e) => {
    e.preventDefault();
    const select = e.target.closest("select");
    const article = select.parentElement.parentElement;
    const number = article.dataset.no;
    if (!select) return;
    const currentValue = select.value;
    if (currentValue !== previousValue) {
      previousValue = currentValue;
      if(currentValue === "modify") {
        //레이어 띄우기
        /** @type {HTMLDivElement} */
        const layer = document.querySelector("footer");
        layer.hidden = false;
        const title = section.querySelector("h4");
        layer.querySelector("input").value = title.innerHTML;
        const textbox = section.querySelector("p");
        layer.querySelector("textarea").value = textbox.innerHTML;
        const buttons = layer.querySelectorAll("button");
    
         //취소버튼
         buttons[1].addEventListener("click", (e) => {
          e.preventDefault();
          layer.hidden = true;
        });
    
        //확인버튼
        buttons[0].addEventListener("click", async(e) => {
          e.preventDefault();
    
          const inputs = layer.querySelectorAll("input");
          const modifyTitle = inputs[0].value;
          const modifyTextbox = layer.querySelector("textarea").value;
          const file = inputs[1];
    
          async function modifyPost(image) {
            const response = await fetch (
            `http://localhost:8080/posts/${number}` , {
              method: "PUT",
              headers: {
                "content-type": "application/json",
                "Authorization": `Bearer ${getCookie(
                 "token")}`,
              },
              body: JSON.stringify ({
                title: modifyTitle,
                content: modifyTextbox,
                image: image ? image : null,
              }),
            });
            if([401, 403].includes(response.status)) {
              hasChanged = false;
              alert("해당 포스트의 작성자가 아닙니다.");
              window.location.reload();
            }else if([404].includes(response.status)){
              hasChanged = false;
              alert("해당 포스트를 찾을 수 없습니다.");
              window.location.reload();
            }
          }
          if(file.files[0]){
            const reader = new FileReader();
            reader.addEventListener("load", async(e) => {
            const image = e.target.result;
            modifyPost(image);
            const imageElement = modifyArticle.querySelector("img");
            imageElement.src = image;
            });
            reader.readAsDataURL(file.files[0]);
          }else {modifyPost();}
          title.innerHTML = layer.querySelector("input").value;
          textbox.innerHTML = layer.querySelector("textarea").value;
          layer.hidden = true;
        });
      }
    }
  });
})();