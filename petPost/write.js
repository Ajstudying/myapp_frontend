let currentPage = 0; //현재 페이지 번호
let isLastPage = false; //마지막 페이지 인지 여부 
const MAX_MEMO = 5;// 고정된 메모 갯수
let query = ""; // 현재 검색 키워드

function createOption(item){
  const option =  /*html*/
  `<option value="${item.petname}">${item.petname}</option>`
  return option;
}

// (async() => {

//   const select = document.forms[0].querySelector("select");

//   const response = await fetch("http://localhost:8080/");
//   const result = await response.json();

//   result.forEach(item => {
//     select.insertAdjacentHTML("afterbegin", createOption(item));
//   });

// })();

//추가
(() => {

  //데이터를 추가하기 위해 엘레멘트 찾기
  const inputs = document.forms[0].querySelectorAll("input");
  const textbox = document.forms[0].querySelector("textarea");
  const select = document.forms[0].querySelector("select");

  const title = inputs[0];
  const content = textbox;
  const file = inputs[1];
  const petname = select.value;
  

  const add = document.forms[0].querySelector("button");

  add.addEventListener("click", (e) => {
    e.preventDefault();

    if(title.value === ""){
      alert("제목을 입력해주세요.");
      return;
    }

    if(content.value === ""){
      alert("내용을 입력해주세요.");
      return;
    }

    //데이터를 서버에 전송하고, UI 요소 생성
    async function createPost(image) {
      //서버에 전송하면 UI를 생성한다.
      await fetch(
        "http://localhost:8080/posts",
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            // "Authorization": `Bearer ${getCookie(
            //   "token"
            // )}`,
          },
          body: JSON.stringify({
            title: title.value,
            content: content.value,
            image: image ? image : null,
            petname: petname,
          }),
        }
      );

    }

    if (file.files[0]) {
      //파일이 있을 때
      //파일 읽은 후 이벤트 실행
      const reader = new FileReader();

      reader.addEventListener(
        "load", 
        async(e) => {
          console.log(e);
          const image = e.target.result;
          createPost(image);
        }
      );
      reader.readAsDataURL(file.files[0]);
    }else {
      //파일이 없을 때
      createPost();
    }
    window.location.replace("http://192.168.100.36:5500/index.html");
    

  });

})();