function getCookie(name) {
  let matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

function hiddenButton(){
  const token = getCookie("token");
  const aside = document.querySelector("aside");
  const buttons = aside.querySelectorAll("button");
  if(!token){ 
    buttons[0].hidden = true;
    buttons[1].hidden = true;
    buttons[3].hidden = true;
  } else{
    buttons[2].hidden = true;
  }
}

function loginLogout() {
  const divs = document.querySelectorAll("div");
  const buttons = divs[1].querySelectorAll("button");

  buttons[0].addEventListener("click", (e) => {
    e.preventDefault();
    window.location.replace("http://localhost:5500/auth/login.html");
  })
  buttons[1].addEventListener("click", async(e) => {
    e.preventDefault();
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        
    window.location.replace("http://localhost:5500/index.html");
    // try {
    //   // 서버로 로그아웃 요청 보내기
    //   const response = await fetch("http://localhost:8080/auth/logout", {
    //     method: "DELETE",
    //     headers: {
    //       Authorization: `Bearer ${getCookie("token")}`,
    //     },
    //   });
  
    //   if (response.ok) {
    //     // 세션 정보 삭제
    //     document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        
    //     window.location.replace("http://localhost:5500/index.html");
    //   } else {
    //     console.error("로그아웃 실패");
    //   }
    // } catch (error) {
    //   console.error("에러 발생:", error);
    // }
    
  });
}


