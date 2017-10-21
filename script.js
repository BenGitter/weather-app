const Weather = (function(){
  const apiKey = "a04560b51103021d";
  const proxy = "https://colorful-aquarius.glitch.me";
  let isCelsius = true;
  let showIcon = false;
  let temp_c = 0;
  let temp_f = 0;

  function init(){
    getTemperature()
      .then(([t_c, t_f, icon_url]) => {
        temp_c = t_c;
        temp_f = t_f;
        const div = getOutputDiv(temp_c);

        setOutputDiv(div);
        placeIconInDiv(div, icon_url);
        placeTempInDiv(div, temp_c, "h1");
        events();
      })
      .catch(err => console.log(err));
  }

  function events(){
    document.querySelector(".temp-text").addEventListener("click", e => {
      e.target.innerHTML = isCelsius ? temp_f+" &#8457;" : temp_c+" &#8451;";

      if(!isCelsius){
        showIcon = !showIcon;
        document.querySelector(".weather-icon").style.display = showIcon ? "block" : "none";
      }
      
      isCelsius = !isCelsius;
    });
  }

  function getWeather(){
    return new Promise((resolve, reject) => {
      fetch(`https://api.wunderground.com/api/${apiKey}/conditions/q/autoip.json`)
        .then(res => res.json())
        .then(json => resolve(json))
        .catch(err => reject(err));
    });
  }

  function getTemperature(){
    return new Promise((resolve, reject) => {
      getWeather()
        .then(json => {
          console.log(json);
          resolve([
            json.current_observation.temp_c, 
            json.current_observation.temp_f,
            json.current_observation.icon_url
          ])
        })
        .catch(err => reject(err));
    });
  }

  function getOutputDiv(temp){
    let index = 13 - Math.floor((temp+30)/5.72);
    index = index < 0 ? 0 : index;
    index = index > 13 ? 13 : index;

    return document.getElementsByClassName("color")[index];
  }

  function placeTempInDiv(div, temp, tag){
    tag = tag ? tag : "h2";
    let tempDOM = document.createElement(tag);
    tempDOM.innerHTML = `${temp} &#8451;`;
    tempDOM.classList.add("temp-text", "no-select");

    div.append(tempDOM);
  }

  function placeIconInDiv(div, icon_url){
    let iconDOM = document.createElement("img");
    iconDOM.src = icon_url;
    iconDOM.classList.add("weather-icon");

    div.append(iconDOM);
  }

  function setOutputDiv(div){
    const divs = document.getElementsByClassName("color");

    for(let i = 0; i < divs.length; i++){
      if(divs[i] !== div) divs[i].classList.add("inactive");
    }

    div.classList.add("active");
  }

  return {
    init: init
  };
})(); 

Weather.init();