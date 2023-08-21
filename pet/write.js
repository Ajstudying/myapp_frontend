
function createOption(item){
  const option =  /*html*/
  `<option value="${item[2]}">${item[2]}</option>`
  return option;
}

(async() => {
  hiddenButton();
  loginLogout();
  const select = document.forms[0].querySelector("select");

  const url = "http://localhost:8080/profile";
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${getCookie(
        "token"
      )}`,
    },
  });
  const result = await response.json();

  result.data.forEach(item => {
    select.insertAdjacentHTML("beforeend", createOption(item));
  });

})();

//추가
(() => {

  //데이터를 추가하기 위해 엘레멘트 찾기
  const inputs = document.forms[0].querySelectorAll("input");
  const content = document.forms[0].querySelector("textarea");
  const select = document.forms[0].querySelector("select");

  const title = inputs[0];
  const file = inputs[1];
  const petname = select;
  

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

    if(select.value === "반려동물의 이름을 선택해주세요"){
      alert("반려동물을 선택해주세요.")
      return;
    }

    //데이터를 서버에 전송하고, UI 요소 생성
    async function createPost(image) {
      //서버에 전송하면 UI를 생성한다.
      const response = await fetch(
        "http://localhost:8080/posts",
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "Authorization": `Bearer ${getCookie(
              "token"
            )}`,
          },
          body: JSON.stringify({
            title: title.value,
            content: content.value,
            image: image ? image : null,
            petname: petname.value,
          }),
        }
      );
      console.log(response);

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
      const section = document.querySelector("section");
      const form = section.querySelector("form");
      form.hidden = true;
      section.innerHTML = /*html*/
      `<p> 작성이 완료되었습니다. </p>`;
    }else {
      //파일이 없을 때
      createPost();
      const section = document.querySelector("section");
      const form = section.querySelector("form");
      form.hidden = true;
      section.innerHTML = /*html*/
      `<p> 작성이 완료되었습니다. </p>`;
      
    }
    
    

  });

})();