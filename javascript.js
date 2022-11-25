let btnApply = document.querySelector(".apply");
let btnTry = document.querySelector(".tryAgain");
let agifyURL = " https://api.agify.io?name=";
let genderizesURL = "https://api.genderize.io?name=";
let nationalizeURL = "https://api.nationalize.io?name=";
let flagURL = "https://restcountries.com/v3.1/alpha?codes=";
let arrayAll = [];
//----------------------------------------------------------
function nameGuessed() {
  let allName = getItemFeomLocalS();
  let guessedN = document.querySelector("#guessed");
  if (allName) {
    for (let k = 0; k < allName.length; k++) {
      console.log(allName[k]);
      let spanN = document.createElement("span");
      let textNote = document.createTextNode(allName[k]);
      spanN.appendChild(textNote);
      guessedN.appendChild(spanN);
    }
  }
}
nameGuessed();

//--------------Click button Apply----------------
btnApply.addEventListener("click", (e) => {
  e.preventDefault();
  let inputName = document.querySelector("#name").value;
  let inputAge = document.querySelector("#age");
  let inputGender = document.querySelector("#gender");
  let inputFlage = document.querySelector("#country");
  let imgFlag = document.createElement("img");
 
  function noSpaceText(name) {
    if (name == "" && name.keyCode == 32) {
      alert("Space is not allowed");
      return false;
    }
    arrayAll.push(inputName);

    return true;
  }
  //----------Check---------------------
  if (noSpaceText(inputName)) {
    let myAge = fetch(agifyURL + inputName).then((response) => response.json());
    let myGender = fetch(genderizesURL + inputName).then((response) =>
      response.json()
    );
    //--------Get Age and Gender---------------------------
    Promise.all([myAge, myGender]).then((values) => {
      inputAge.value = values[0].age;
      inputGender.value = values[1].gender;
    });

    //------------Get Flag-------------------------------
    let myNa = fetch(nationalizeURL + inputName);
    myNa
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then((json) => {
        let ArryCon = json.country;
        const codes = ArryCon.map((element) => {
          return element.country_id;
        });
        console.log(codes);
        return codes;
      })
      .then((code) => {
        inputFlage.replaceChildren();
        code.forEach((element) => {
          let flageData = fetch(flagURL + element);
          flageData
            .then((response) => {
              if (response.ok) {
                return response.json();
              }
            })
            .then((flageData) => {
              let dataImage = flageData[0];
              let srcImg = dataImage.flags.png;
              imgFlag = document.createElement("img");
              imgFlag.setAttribute("src", srcImg);
              imgFlag.setAttribute("width", "75");
              imgFlag.setAttribute("height", "25");
              inputFlage.appendChild(imgFlag);
            });
        });
      });
  }
  addToLocalS(arrayAll);
});
//----------Add in Local--------------------
function addToLocalS(names) {
  window.localStorage.setItem("NameGuess", JSON.stringify(names));
}

//-------------Get from Local------------------
function getItemFeomLocalS() {
  let data = window.localStorage.getItem("NameGuess");
  if (data) {
    let name = JSON.parse(data);
    return name;
  }
}
