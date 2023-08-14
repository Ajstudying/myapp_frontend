function myTemplate(item){
  const template = /*html*/
  `<h3>Profile</h3>
  <p>petname: ${item[2]}</p>
  <p>species: ${item[3]}</p>
  `;
  return template;
}


//조회
(async() => {
  const section = document.querySelector("section");
  const response = await fetch(`http://localhost:8080/profile`);
  const results = response.json();

  console.log(results);
  console.log(results.then);
  console.log(results.data);

  const divs = section.querySelectorAll("div");
  const userid = "";
  const nickname = "";

  results.data.forEach(item => {
    section.insertAdjacentHTML("beforeend", myTemplate(item));
    userid = item[0];
    nickname = item[1];
  });
    

  divs[0].querySelector("p").value = userid;
  divs[1].querySelector("p").value = nickname;
  

})();