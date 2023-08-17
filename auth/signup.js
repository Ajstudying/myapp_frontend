(() => {
  hiddenButton();
  const forms = document.querySelectorAll("form");
  const section = document.querySelector("section");
  const buttons = section.querySelectorAll("button");
  console.log(buttons[0]);
  console.log(buttons[1]);

  //프로필 정보 추가
  buttons[0].addEventListener("click", (e) => {
    e.preventDefault();
    const profileTemplate = /*html*/
    `<hr>
    <div class="inputbox">
    <h4>펫이름:</h4>
    <label>
    <input type="text" />
    </label>
    </div>
    <div class="inputbox">
    <h4>펫종류:</h4>
    <label>
    <input type="text" />
    </label>
    </div>`;
    forms[1].insertAdjacentHTML("beforeend", profileTemplate);
  });

  //회원 가입 버튼
  buttons[1].addEventListener("click", (e) => {
    const inputs = forms[0].querySelectorAll("input");
    const userId = inputs[0].value;
    const password = inputs[1].value;
    const nickname = inputs[2].value;

    const profileInputs = forms[1].querySelectorAll("Input");
    const pets = [];
    for(let i = 0; i < profileInputs.length; i+=2){
      pets.push({petname: profileInputs[i].value, species: profileInputs[i+1].value});
    }
    fetch(
      "http://localhost:8080/auth/signup",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          userId,
          password,
          nickname,
          "profilelist": pets,
        }),
      }
    );

    alert("회원가입이 완료되었습니다.")
    window.location.replace("http://localhost:5500/index.html")

  });

})();

