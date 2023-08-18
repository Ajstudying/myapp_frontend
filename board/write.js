(() => {
  hiddenButton();
  const token = getCookie("token");
  console.log(token);
  if(!token){
    window.location.href = "http://localhost:8080/auth/login.html"
  }

})();

(async() => {
  const select = document.forms[0].querySelector("select");

  console.log(select);
  const url = "http://localhost:8080/profile";
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${getCookie(
        "token"
      )}`,
    },
  });
  const result = await response.json();

  console.log(result);

  result.data.forEach(item => {
    const option =  /*html*/
    `<option data-pet="${item[2]}"value="${item[3]}">${item[3]}</option>`;
    select.insertAdjacentHTML("beforeend", option);
  });

})();

//추가
(() => {

  //데이터를 추가하기 위해 엘레멘트 찾기
  const inputs = document.forms[0].querySelectorAll("input");
  const textbox = document.forms[0].querySelector("textarea");
  const select = document.forms[0].querySelector("select");

  const title = inputs[0];
  const content = textbox;
  const file = inputs[1];
  const species = select;

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
    
    if(select.value === "반려동물의 종류를 선택해주세요"){
      alert("반려동물 종류를 선택해주세요.");
      return;
    }

    //데이터를 서버에 전송하고, UI 요소 생성
    async function createBoard(image) {
      const petname = select[select.selectedIndex].dataset.pet;
      console.log(petname);
      //서버에 전송하면 UI를 생성한다.
      const response = await fetch(
        "http://localhost:8080/boards",
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
            species: species.value,
            petname: petname,
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
          createBoard(image);
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
