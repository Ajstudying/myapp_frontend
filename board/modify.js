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

//삭제
(() => {
  const section = document.querySelector("section");

  section.addEventListener("click", async(e) => {
    e.preventDefault();

    if(e.target.classList.contains("remove")){
      
      const removeArticle = e.target.closest("article");
      const removeNumber = removeArticle.dataset.no;
      
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
      removeArticle.remove();
      window.location.reload();
      }
    }
  });

})();
