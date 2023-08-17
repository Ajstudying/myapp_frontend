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
  </div>
  </article>
  `;
  return template;
}


//조회
(async() => {
  hiddenButton();
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
  const footer = main.querySelector("footer");
  results.data.forEach(item => {
    footer.insertAdjacentHTML("beforeend", myTemplate(item));
  });
    
  divs[0].querySelector("p:last-child").innerHTML = results.data[0][0];
  divs[1].querySelector("p:last-child").innerHTML = results.data[0][1];
  

})();

//수정
(() => {
  const footer = document.querySelector("footer");
  footer.addEventListener("click", (e) => {
    e.preventDefault();
    console.log(e.target);
    if(e.target.tagName.toLowerCase() == "button"){
      const article = e.target.parentElement.parentElement;
      console.log(article);
      console.log(article.dataset.no);

      const layer = document.querySelector("#modify-layer");
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
        layer.hidden = true;
      });
    }
  })
  
})();
