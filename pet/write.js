

function createOption(item){
  const option =  /*html*/
  `<option value="${item.petname}">${item.petname}</option>`
  return option;
}

// (async() => {

//   const select = document.forms[0].querySelector("select");

//   const response = await fetch("http://localhost:8080/Auth", 
//   {
//     method: "GET",
//     headers: {
//       "content-type": "application/json",
//     },});
//   const result = await response.json();
//   console.log(result);

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
      const writebox = document.getElementById("writebox");
      const form = writebox.querySelector("form");
      form.hidden = true;
      writebox.innerHTML = /*html*/
      `<p> 작성이 완료되었습니다. </p>`;
    }else {
      //파일이 없을 때
      createPost();
      const writebox = document.getElementById("writebox");
      const form = writebox.querySelector("form");
      form.hidden = true;
      writebox.innerHTML = /*html*/
      `<p> 작성이 완료되었습니다. </p>`;
      
    }
    
    

  });

})();