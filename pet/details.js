//포스트 형태
function cardTemplate(item){
  const imageElement = item.image ? `<img src="${item.image}" alt="반려동물사진">` : "";
  const template =  /*html*/
    `<article data-no="${item.no}">
    <h4>${item.title}</h4>
    <hr>
    <h5><sub>생성시간: ${new Date(item.createdTime).toLocaleString()}</sub></h5>
    <div>
    ${imageElement}
    </div>
    <div>
    <p>${item.content}</p>
    </div>
    <hr>
    <div>
    <h3>${item.petname}</h3>
    <h3>${item.nickname}</h3>
    </div>
    </article>`;
    return template;
}

(async() => {
  hiddenButton();
  // URL에서 쿼리 파라미터 가져오기
  const urlParams = new URLSearchParams(window.location.search);
  const postNo = urlParams.get('postNo'); // 쿼리 파라미터에서 postNo 값을 가져옴
  
  const response = await fetch(`http://localhost:8080/posts/${postNo}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${getCookie(
            "token"
            )}`,
        },
  });
  const result = await response.json();
  const section = document.querySelector("section");
  section.insertAdjacentHTML("beforeend", cardTemplate(result));

})();


