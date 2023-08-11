let currentPage = 0;// 현재 페이지 번호
let isLastPage = false; // 마지막 페이지인지 여부
const MAX_MEMO = 5; //고정된 메모 갯수
let currentQuery = ""; //현재 검색 키워드

//메모 형태
function cardTemplate(item){
  const imageElement = item.image ? `<img src="${item.image}" alt="${item.no}">` : "";
  const template =  /*html*/
    `<article data-no="${item.no}">
    <div>
    <h4>${item.title}</h4>
    <button class="remove">X</button>
    </div>
    <hr>
    <h5><sub>생성시간: ${new Date(item.createdTime).toLocaleString()}</sub></h5>
    <div>
    ${imageElement}
    </div>
    <div>
    <p>${item.content}</p>
    <button class="btn-modify">:</button>
    </div>
    <hr>
    <div>
    <h3>${item.petname}</h3>
    <h3>${item.nickname}</h3>
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
    section.insertAdjacentHTML("afterbegin", cardTemplate(item));
  });

}

//화면을 처음 켰을 때 첫번째 페이지 조회
(async() => {
  window.addEventListener("DOMContentLoaded", () => {
    getPagedMemo(0);
  });
})();

//검색 기능
(() => {
  const textQuery = document.forms[0].querySelector("input");
  const btnSearch = document.forms[0].querySelector("button");

  btnSearch.addEventListener("click", (e) => {
    e.preventDefault();
    currentQuery = textQuery.value;
    getPagedMemo(0, currentQuery);
  });

  textQuery.addEventListener("keyup", (e) => {
    e.preventDefault();
    if(e.key.toLocaleLowerCase() === "enter"){
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
    //검색 박스 초기화
    document.forms[1].reset();
    //검색 조건 값 초기화
    currentQuery = "";
    //검색 조건이 초기화 되면 0번 페이지에서 다시 조회
    getPagedMemo(0, currentQuery);
  });
})();

//삭제
(() => {
  
  const section = document.querySelector("section");

  section.addEventListener("click", async(e) => {
    e.preventDefault();
    console.log(e.target);

    //e.target !== buttons[0] &&
    if(e.target.classList.contains("remove")){

      const removeArticle = e.target.closest("article");
      const removeNumber = removeArticle.dataset.no;
      
      //서버연결
      await fetch(`http://localhost:8080/posts/${removeNumber}`,
      {
        method: "DELETE",
        // headers: {
        //   Authorization: `Bearer ${getCookie(
        //     "token"
        //   )}`,
        // },
      });
      removeArticle.remove();
      window.location.reload();
      
    }
    
    
  })

})();

//수정
(() => {
  document.querySelector("section").addEventListener("click", (e) => {
    e.preventDefault();
    console.log(e.target);
    if(e.target.classList.contains("btn-modify")){
      const modifyArticle = e.target.closest("article");
      console.log(modifyArticle);
      console.log(modifyArticle.querySelector("h3").innerHTML);
     
      //레이어 띄우기
      /** @type {HTMLDivElement} */
      const layer = document.querySelector("#modify-layer");
      layer.hidden = false;

      //레이어 내부에 선택값을 채워넣음
      const title = modifyArticle.querySelector("h3");
      layer.querySelector("input").value = title.innerHTML;

      const textbox = modifyArticle.querySelector("p");
      layer.querySelector("textarea").value = textbox.innerHTML;

      // 확인 / 취소 버튼에 이벤트 핸들러 추가

      const buttons = layer.querySelectorAll("button");
      //취소 버튼
      buttons[1].addEventListener("click", (e) => {
        e.preventDefault();
        layer.hidden = true;
      });

      //수정
      buttons[0].addEventListener("click", async(e) => {
        e.preventDefault();

        const modifyNum = modifyArticle.dataset.no;
        
        const modifyTitle = layer.querySelector("input").value;
        const modifyTextbox = layer.querySelector("textarea").value;

        //서버연동
        const response = await fetch(
          `http://localhost:8080/posts/${modifyNum}` , {
          method: "PUT",
          headers: {
            "content-type": "application/json",
            "Authorization": `Bearer ${getCookie(
              "token"
            )}`,
          },
          body: JSON.stringify ({
            title: modifyTitle,
            content: modifyTextbox,
          }),
        });
        console.log(response.status);

        //데이터 셀의 값을 수정입력으로 바꿈.
        title.innerHTML = layer.querySelector("input").value;
        textbox.innerHTML = layer.querySelector("textarea").value;
        layer.hidden = true;
      })



    }

  });
})();