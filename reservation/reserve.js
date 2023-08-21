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
        choiceDate();
      }
      // 미래인 경우
      else {                                      
        nowColumn.className = "futureDay";
        choiceDate();
      }
    }
}

//날짜 선택
function choiceDate() {
  const section = document.querySelector("section");
  section.addEventListener("click", (e)=> {
    e.preventDefault();

    if(e.target.tagName.toLowerCase() == "td"){
      if(!e.target.classList.contains("choiceDay")){
        e.target.classList.remove("choiceDay");
      }
      e.target.classList.add("choiceDay");
      const form = document.querySelector("form");
      form.hidden = false;
      form.addEventListener("")
    }
 
  });
}
//달력 페이징
(() => {
  
  const thead = document.querySelector("thead"); 
  const arrows = thead.querySelectorAll("td");
  //이전 달 버튼 클릭
  arrows[0].addEventListener("click", (e) => {
    e.preventDefault();
    // 현재 달을 1 감소
    now = new Date(now.getFullYear(), now.getMonth() - 1);
    // 달력 다시 생성
  buildCalendar(now);  
  });

  arrows[2].addEventListener("click", (e) => {
    e.preventDefault();
    // 현재 달을 1 증가
    now = new Date(now.getFullYear(), now.getMonth() + 1); 
    // 달력 다시 생성
    buildCalendar(now);  
  });

})();

function createOption(item){
  const option =  /*html*/
  `<option value="${item[2]}">${item[2]}</option>`
  return option;
}

(async() => {
  hiddenButton();
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

