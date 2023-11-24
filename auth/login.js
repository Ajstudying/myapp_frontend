(() => {
  const params = new URLSearchParams(window.location.search);
  if (params.get("err")) {
    console.log(params.get("err"));
    alert(params.get("err"));
    history.replaceState(null, null, `${frontUrl}/auth/login.html`);
  }
  const signin = document.forms[0].querySelectorAll("button")[0];
  const id = document.forms[0].querySelectorAll("input")[0];
  const pass = document.forms[0].querySelectorAll("input")[1];
  //로그인
  signin.addEventListener("click", (e) => {
    e.preventDefault();
    filledCheck();
  });
  signin.addEventListener("keyup", () => {
    filledCheck();
  });
  id.addEventListener("keyup", () => {
    if (e.key.toLowerCase() === "enter") {
      filledCheck();
    }
  });
  pass.addEventListener("keyup", () => {
    if (e.key.toLowerCase() === "enter") {
      filledCheck();
    }
  });
  function filledCheck() {
    const id = document.forms[0].querySelectorAll("input")[0];
    const pass = document.forms[0].querySelectorAll("input")[1];
    if (!id.value) {
      alert("사용자 이름을 입력해주세요.");
      return;
    }
    if (!pass.value) {
      alert("비밀번호를 입력해주세요.");
      return;
    }
    if (id.value && pass.value) {
      const url = ["localhost", "127.0.0.1"].includes(location.hostname)
        ? "http://localhost:8080/api/auth/signin"
        : "https://d1a39zs71kjyn9.cloudfront.net/api/auth/signin";
      console.log(url);
      document.forms[0].action = url;
      document.forms[0].submit();
    }
  }
  const signup = document.forms[0].querySelectorAll("button")[1];
  //회원가입
  signup.addEventListener("click", (e) => {
    e.preventDefault();
    const url = ["localhost", "127.0.0.1"].includes(location.hostname)
      ? "http://localhost:5500"
      : "https://d1a39zs71kjyn9.cloudfront.net";
    window.location.replace(`${url}/auth/signup.html`);
  });
})();
