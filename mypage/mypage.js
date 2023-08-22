(() => {
  hiddenButton();
  loginLogout();
  const token = getCookie("token");
  console.log(token);
  if(!token){
    window.location.href = "http://localhost:5500/auth/login.html"
  }

})();

function myTemplate(item){
  const template = /*html*/
  `<article data-no="${item[4]}">
  <div>
  <div>
  <h4>펫이름: </h4>
  <p>${item[2]}</p>
  </div>
  <button>수정</button>
  </div>
  <div>
  <div>
  <h4>펫종류: </h4>
  <p>${item[3]}</p>
  </div>
  <button>삭제</button>
  </div>
  </article>
  <hr>
  `;
  return template;
}

//조회
(async() => {
  const main = document.querySelector("main");
  const url = "http://localhost:8080/profile";
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${getCookie(
        "token"
      )}`,
    },
  });
  if ([401, 403].includes(response.status)) {
    // 로그인 페이지로 튕김
    alert("인증처리가 되지 않았습니다.");
    window.location.href = "/login.html";
  }
  const results = await response.json();

  const divs = main.querySelectorAll("div");
  const profile = main.querySelectorAll("section")[1];
  results.data.forEach(item => {
    profile.insertAdjacentHTML("beforeend", myTemplate(item));
  });
    
  divs[0].querySelector("p:last-child").innerHTML = results.data[0][0];
  divs[1].querySelector("p:last-child").innerHTML = results.data[0][1];

})();

//삭제 수정 기능
(() => {
  const profile = document.querySelectorAll("section")[1];
  profile.addEventListener("click", async(e) => {
    e.preventDefault();
    const article = e.target.closest("article");
    const buttons = article.querySelectorAll("button");
    const modifyButton = buttons[0];
    const removeButton = buttons[1]
    if(e.target == removeButton){
      const removeBtn = removeArticle.querySelectorAll("button")[1];
      console.log(removeBtn);
      const removeNum = removeArticle.dataset.no;
      
      //서버연결
      const response = await fetch(`http://localhost:8080/profile/${removeNum}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${getCookie(
            "token"
          )}`,
          },
        });
        if([404].includes(response.status)){
          alert("해당 프로필이 존재하지 않습니다.");
        }
        removeArticle.remove();
        window.location.reload();
    }else if(e.target == modifyButton){
      const layer = document.querySelector("footer");
      const modifybox = document.querySelector("#modify-box");
      const h5 = document.createElement("h5");
      h5.innerHTML = "< 수정 >";
      modifybox.prepend(h5);
      layer.hidden = false;

      const ps = article.querySelectorAll("p");
      const inputs = layer.querySelectorAll("input");
      const petname =  ps[0];
      inputs[0].value = petname.innerHTML;
      const species = ps[1];
      inputs[1].value = species.innerHTML;

      const buttons = layer.querySelectorAll("button");
      buttons[1].addEventListener("click", (e) => {
        e.preventDefault();
        cleanLayer();
        layer.hidden = true;
      });

      buttons[0].addEventListener("click", async(e) => {
        e.preventDefault();
        const section = document.querySelector("section");
        console.log(section);
        const no = article.dataset.no;
        console.log(no);

        const modifyPetName = inputs[0].value;
        const modifySpecies = inputs[1].value;

        const response = await fetch(
          `http://localhost:8080/profile/${no}`,{
            method: "PUT",
          headers: {
            "content-type": "application/json",
            "Authorization": `Bearer ${getCookie(
              "token"
            )}`,
          },
          body: JSON.stringify ({
            petname: modifyPetName,
            species: modifySpecies,
          }),
        });

        console.log(response.status);
        petname.innerHTML = inputs[0].value;
        species.innerHTML = inputs[1].value;
        cleanLayer();
        layer.hidden = true;
      });
    }
  });
})();

//추가
(() => {
  const profile = document.querySelectorAll("section")[1];
  const addBtn = profile.querySelector("button");
  addBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const layer = document.querySelector("footer");
    const insertBox = document.querySelector("#modify-box");
    const h5 = document.createElement("h5");
    h5.innerHTML = "< 추가 >";
    insertBox.prepend(h5);
    layer.hidden = false;

    const buttons = layer.querySelectorAll("button");
    //취소버튼
    buttons[1].addEventListener("click", (e) =>{
      e.preventDefault();
      cleanLayer();
      layer.hidden = true;
    });
    //추가
    buttons[0].addEventListener("click", async(e) => {
      e.preventDefault();
      const inputs = layer.querySelectorAll("input");
      const petname = inputs[0];
      const species = inputs[1];
      if(petname.value == ""){
        alert("반려동물의 이름을 입력해주세요.");
        return;
      }
      if(species.value == ""){
        alert("반려동물의 종류를 입력해주세요.");
        return;
      }
      await fetch(
        "http://localhost:8080/profile",
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "Authorization": `Bearer ${getCookie(
              "token"
            )}`,
          },
          body: JSON.stringify({
            petname: petname.value,
            species: species.value,
            user: null,
          }),
        }
      );
      cleanLayer();
      layer.hidden = true;
      window.location.reload();
    });
    
  });
})();


function cleanLayer(){
  const layer = document.querySelector("footer");
  const inputs = layer.querySelectorAll("input");
  const h5 = layer.querySelector("h5");
  h5.innerHTML = "";
  inputs[0].innerHTML = "";
  inputs[1].innerHTML = "";
}