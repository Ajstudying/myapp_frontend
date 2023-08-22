//로드한 현재 시간
let now =  new Date();
let today = new Date();

(() => {
  hiddenButton();
  loginLogout();
  window.addEventListener("DOMContentLoaded", () => {
    today.setHours(0, 0, 0, 0);
    buildCalendar(now);
  });

})();

//유저에게 등록된 총 일정 조회
(async() => {
  const sections = document.querySelectorAll("section");
  const response = await fetch(`http://localhost:8080/reserve`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getCookie(
        "token"
      )}`,
    },
  });

  const result = await response.json();
  
  result.forEach(item => {
    const time= new Date(item.reservationTime);
    const reservationTime = `${time.getFullYear()}-${time.getMonth()}-${time.getDate().toString()}`;
    const schedule = /*html*/
    `<article data-no="${item.no}">
    <div>
    <h4>예정일: ${reservationTime}</h4>
    <h4>내용: </h4>
    <p>${item.petname}</p>
    <p>${item.content}</p>
    </div>
    <div>
    <button>수정</button>
    <button>삭제</button>
    </div>
    </article>
    `;
    sections[1].insertAdjacentHTML("beforeend", schedule);
  });
})();

//등록된 일정 수정 삭제
(() => {
  const sections = document.querySelectorAll("section");
  sections[1].addEventListener("click", async(e) => {
    e.preventDefault();
    const article = e.target.closest("article");
    const buttons = article.querySelectorAll("button");
    const modifyButton = buttons[0];
    const removeButton = buttons[1];
    if(e.target == removeButton){
      const removeNumber = article.dataset.no;
      //서버연결
      const response = await fetch(`http://localhost:8080/reserve/${removeNumber}`,
      {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
          "Authorization": `Bearer ${getCookie(
            "token"
          )}`,
        },
        body: JSON.stringify ({
          
        }),
      });
      if ([404].includes(response.status)) {
        alert("해당 일정을 찾을 수 없습니다.");
      }
      removeArticle.remove();
      window.location.reload();
    }
    else if(e.target == modifyButton){
      const layer = document.querySelector("footer");
      layer.hidden = false;
      const inputs = layer.querySelectorAll("input");
      const petname = article.querySelectorAll("p")[0];
      inputs[1].value = petname.innerHTML;
      const content = article.querySelectorAll("p")[1];
      inputs[2].value = content.innerHTML;

      const btns = layer.querySelectorAll("button");
      //취소 버튼
      btns[1].addEventListener("click", (e) => {
        e.preventDefault();
        layer.hidden = true;
      });

      //확인 버튼
      btns[0].addEventListener("click", async(e) => {
        e.preventDefault();
        const time = inputs[0].value;
        const modifyYear = time.split("-")[0];
        const modifyMonth = time.split("-")[1];
        const modifyDay = time.split("-")[2];
        //변경된 예약 날짜
        const modifyReserve = new Date(modifyYear, modifyMonth, modifyDay);
        console.log(modifyReserve.getTime());
        const modifyPet = inputs[1].value;
        const modifyContent = inputs[2].value;
        const modifyNum = article.dataset.no;
        //서버연결
        const response = await fetch(`http://localhost:8080/reserve/${modifyNum}`,
        {
          method: "PUT",
          headers: {
            "content-type": "application/json",
            "Authorization": `Bearer ${getCookie(
              "token"
            )}`,
          },
          body: JSON.stringify ({
            petname: modifyPet,
            content: modifyContent,
            reservationTime: modifyReserve.getTime(),
          }),
        });
        if([404].includes(response.status)){
          alert("해당 일정을 찾을 수 없습니다.")
        }
        const schedule = article.querySelector("h4");
        schedule.innerHTML = `예정일: ${time}`;
        petname.innerHTML = modifyPet;
        content.innerHTML = modifyContent;
        window.location.reload();

      });
      

    }  
  });
})();

//날짜 선택
(() => {
  const main = document.querySelector("main");
  main.addEventListener("click", (e)=> {
    e.preventDefault();
    const td = e.target.closest("td");
    if(td && !td.classList.contains("pastDay")){
      td.classList.toggle("choiceDay");
    }
  });
})();


//달력 만들기
function buildCalendar(now) {
    //달의 1일
    const firstDate = new Date(now.getFullYear(), now.getMonth(), 1); 
    //달의 마지막 날
    const lastDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    const tbody = document.querySelector("tbody");
    const thead = document.querySelector("thead");
    const currentYear = thead.querySelectorAll("span")[0];

    const currentMonth = thead.querySelectorAll("span")[1];
    //년도 갱신
    currentYear.innerText = now.getFullYear();
    //월 갱신
    currentMonth.innerText = leftPad(now.getMonth() + 1);
    
    //초기화
    tbody.innerHTML = "";

    let nowRow = tbody.insertRow();

    for(let i = 0; i < firstDate.getDay(); i++){
      //열 추가
      nowRow.insertCell();
    }

    for (let nowDay = firstDate; nowDay <= lastDate; nowDay.setDate(nowDay.getDate() + 1)) {
      //새 열 추가
      let nowColumn = nowRow.insertCell();
      nowColumn.innerText = leftPad(nowDay.getDate());

      // 일요일인 경우 글자색 빨강으로
      if (nowDay.getDay() == 0) {                 
        nowColumn.style.color = "#DC143C";
      }
      // 토요일인 경우 글자색 파랑으로
      if (nowDay.getDay() == 6) {                 
        nowColumn.style.color = "#0000CD";
        // 새로운 행 추가
        nowRow = tbody.insertRow();    
      }

      // 지난날인 경우
      if (nowDay < today) {                       
        nowColumn.className = "pastDay";
      }
      // 오늘인 경우  
      else if (nowDay.getFullYear() == today.getFullYear() && nowDay.getMonth() == today.getMonth() && nowDay.getDate() == today.getDate()) {          
        nowColumn.className = "today";
      }
      // 미래인 경우
      else {                                      
        nowColumn.className = "futureDay";
      }
    }
}


//추가
(() => {
  const form = document.querySelector("form");
  const button = form.querySelector("button");
  button.addEventListener("click", async(e) => {
    e.preventDefault();
    const petname = form.querySelector("select");
    const content = form.querySelector("input");
    const choiceYear = parseInt(document.querySelectorAll("span")[0].innerHTML);
    const choiceMonth = parseInt(document.querySelectorAll("span")[1].innerHTML);
    const choiceArray = Array.from(document.getElementsByClassName("choiceDay"));
    let choiceDay = 0;
    choiceArray.forEach((item) => {
      choiceDay = parseInt(item.innerHTML);
    });
    
    const reservationTime = new Date(choiceYear, choiceMonth, choiceDay);
    console.log(reservationTime.getTime());

    if(!choiceDay){
      alert("날짜를 선택해주세요.");
      return;
    }
    if(petname.value === "반려동물의 이름을 선택해주세요"){
      alert("반려동물을 선택해주세요.");
      return;
    }
    if(content.value === ""){
      alert("일정 내용을 입력해주세요.");
      return;
    }

    const response = await fetch(
      "http://localhost:8080/reserve",
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
          content: content.value,
          reservationTime: reservationTime.getTime(),
        }),
      }
    );

    if([201].includes(response.status)){
      form.hidden = true;
      const section = document.querySelector("section");
      section.innerHTML = /*html*/
      `<p> 등록이 완료되었습니다. </p>`;
    }
  });
})();


//달력 페이징
(() => {
  const thead = document.querySelector("thead"); 
  const arrows = thead.querySelectorAll("th");
  //이전 달 버튼 클릭
  arrows[0].addEventListener("click", (e) => {
    e.preventDefault();
    // 현재 달을 1 감소
    now = new Date(now.getFullYear(), now.getMonth() - 1);
    // 달력 다시 생성
  buildCalendar(now);  
  });

  arrows[1].addEventListener("click", (e) => {
    e.preventDefault();
    // 현재 달을 1 증가
    now = new Date(now.getFullYear(), now.getMonth() + 1); 
    // 달력 다시 생성
    buildCalendar(now);  
  });

})();
//펫 셀렉트 옵션 형태
function createOption(item){
  const option =  /*html*/
  `<option value="${item[2]}">${item[2]}</option>`
  return option;
}
//펫 셀렉트 옵션 추가
(async() => {
  const select = document.forms[0].querySelector("select");

  const url = "http://localhost:8080/profile";
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${getCookie(
        "token"
      )}`,
    },
  });
  const result = await response.json();

  result.data.forEach(item => {
    select.insertAdjacentHTML("beforeend", createOption(item));
  });

})();

// input값이 한자리 숫자인 경우 앞에 '0' 붙혀주는 함수
function leftPad(value) {
  if (value < 10) {
      value = "0" + value;
      return value;
  }
  return value;
}

