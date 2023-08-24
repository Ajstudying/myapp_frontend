(() => {
  hiddenButton();
  loginLogout();
  const token = getCookie("token");
  console.log(token);
  if(!token){
    window.location.href = "http://localhost:5500/auth/login.html"
  }

})();

//수정으로 쿼리를 받아올 때


//셀렉트 옵션 추가
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
    `<option data-pet="${item[3]}"value="${item[2]}">${item[2]}</option>`;
    select.insertAdjacentHTML("beforeend", option);
  });

})();

//추가
function addBoard() {

  //데이터를 추가하기 위해 엘레멘트 찾기
  const inputs = document.forms[0].querySelectorAll("input");
  const textbox = document.forms[0].querySelector("textarea");
  const select = document.forms[0].querySelector("select");

  const title = inputs[0];
  const content = textbox;
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
    
    if(petname.value === "반려동물을 선택해주세요"){
      alert("반려동물을 선택해주세요.");
      return;
    }

    //데이터를 서버에 전송하고, UI 요소 생성
    async function createBoard(image) {
      const species = select[select.selectedIndex].dataset.pet;
      console.log(species);
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
            species: species,
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
      createBoard();
      const section = document.querySelector("section");
      const form = section.querySelector("form");
      form.hidden = true;
      section.innerHTML = /*html*/
      `<p> 작성이 완료되었습니다. </p>`;
      
    }

  });

}


(() => {

})();


//수정과 삭제
(() => {
  const section = document.querySelector("section");
  section.addEventListener("click", async(e) => {
    e.preventDefault();
    console.log(e.target);
    const buttons = section.querySelectorAll("button");
    const modifyBtn = buttons[0];
    const removeBtn = buttons[1];
    if(e.target == removeBtn){
      const removeNumber = section.dataset.no;
      
      //서버연결
      const response = await fetch(`http://localhost:8080/boards/${removeNumber}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getCookie(
            "token"
          )}`,
        },
      });
      if ([403].includes(response.status)) {
        alert("해당 포스트의 작성자가 아닙니다.");
      }else if([404].includes(response.status)){
        alert("해당 포스트를 찾을 수 없습니다.");
      }else{
      section.remove();
      window.location.replace("http://localhost:5500/board/board.html");
      }
    }else if(e.target == modifyBtn){
      const modifyNum = section.dataset.no;
     
      const response = await fetch(`http://localhost:8080/posts/verify/${modifyNum}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${getCookie(
            "token"
            )}`,
          },
        });
        if ([403].includes(response.status)) {
          alert("해당 포스트의 작성자가 아닙니다.");
        } else if([404].includes(response.status)){
          alert("해당 포스트를 찾을 수 없습니다.");
        }else{
          //레이어 띄우기
          /** @type {HTMLDivElement} */
          const layer = document.querySelector("article");
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
              await fetch (
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
                      image: image ? image : null,
                    }),
                  });
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