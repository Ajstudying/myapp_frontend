(() => {
  hiddenButton();
  loginLogout();
  const forms = document.querySelectorAll("form");
  const section = document.querySelector("section");
  const buttons = section.querySelectorAll("button");
  console.log(buttons[0]);
  console.log(buttons[1]);

  //프로필 정보 추가
  buttons[0].addEventListener("click", (e) => {
    e.preventDefault();
    const profileTemplate =
      /*html*/
      `<div class="bar">
      <label class="material-symbols-outlined"
        >pets
        <input type="text" placeholder="반려동물의 이름을 입력해주세요." />
      </label>
    </div>
    <div class="bar">
      <label class="material-symbols-outlined"
        >pet_supplies
        <input type="text" placeholder="반려동물의 종류를 입력해주세요." />
      </label>
    </div>`;
    forms[1].insertAdjacentHTML("beforeend", profileTemplate);
  });

  //회원 가입 버튼
  buttons[1].addEventListener("click", async (e) => {
    const inputs = forms[0].querySelectorAll("input");
    const userId = inputs[0].value;
    const password = inputs[1].value;
    const nickname = inputs[3].value;

    const profileInputs = forms[1].querySelectorAll("Input");
    const profile = [];
    for (let i = 0; i < profileInputs.length; i += 2) {
      profile.push({
        petname: profileInputs[i].value,
        species: profileInputs[i + 1].value,
      });
    }
    console.log(profile);
    const response = await fetch(`${apiUrl()}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
      body: JSON.stringify({
        userId,
        password,
        nickname,
        profileList: profile,
      }),
    });
    if (response.status === 201) {
      alert("회원가입이 완료되었습니다.");
      const url = ["localhost", "127.0.0.1"].includes(location.hostname)
        ? "http://localhost:5500"
        : "https://d1a39zs71kjyn9.cloudfront.net";
      window.location.replace(`${url}/auth/login.html`);
    } else {
      alert("회원가입에 실패했습니다. 다시 시도해주세요.");
    }
  });
})();

//비밀번호 확인 아이콘 모양으로 하기
(() => {
  const password = document.forms[0].querySelectorAll("input")[1];
  const icon = document.forms[0].querySelectorAll("label")[2];

  password.addEventListener("input", () => {
    const passwordCheck = icon.querySelector("input");
    if (password.value.toLowerCase() !== passwordCheck.value.toLowerCase()) {
      icon.innerHTML = `live_help
      <input type="password" placeholder="비밀번호 다시 입력해주세요." />`;

      icon.classList.remove("feedback-icon"); // feedback 아이콘 클래스 제거
      icon.classList.add("help-icon"); // help 아이콘 클래스 추가
    }
    icon.childNodes[1].addEventListener("input", (e) => {
      if (
        password.value.toLowerCase() === icon.childNodes[1].value.toLowerCase()
      ) {
        icon.innerHTML = `feedback
        <input type="password" placeholder="입력완료" />`;

        icon.classList.remove("help-icon"); // help 아이콘 클래스 제거
        icon.classList.add("feedback-icon"); // feedback 아이콘 클래스 추가
      }
    });
  });
})();
