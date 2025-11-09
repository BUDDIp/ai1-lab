const WeatherApp = class {
    constructor(key) 
    {
        this.key = key;

        this.container = document.getElementById("container");
        this.currentWeather = "";
        this.forecastWeather = "";
        this.weatherRequest = 'https://api.openweathermap.org/data/2.5/weather?appid=ed4cd86be9f900b86179827780e6980d&q={query}&lang=pl&units=metric';
        this.forecastRequest = 'https://api.openweathermap.org/data/2.5/forecast?appid=ed4cd86be9f900b86179827780e6980d&q={query}&lang=pl&units=metric';
    }

    getCurrentWeather(query)
    {
        let url = this.weatherRequest.replace("{query}", query);

        let xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", url);
        xmlhttp.addEventListener("load", () => {
            this.currentWeather = JSON.parse(xmlhttp.response);
            if(this.forecastWeather)
            {
                console.log(this.forecastWeather);
                this.drawWeather();
            }
        })
        xmlhttp.send();
    }

    getForecastWeather(query)
    {
        let url = this.forecastRequest.replace("{query}", query);

        fetch(url)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                this.forecastWeather = data;
                if(this.currentWeather)
                {
                    console.log(this.forecastWeather);
                    this.drawWeather();
                }
            });
    }

    drawWeather()
    {
        this.container.innerHTML = "";

        if(this.currentWeather)
        {
            // Date
            let currentDate = new Date();
            let currentDateString = currentDate.toLocaleDateString();

            // Time
            let currentTimeString = currentDate.toLocaleTimeString().slice(0,5);

            // Image
            let image = this.currentWeather.weather[0].icon;

            // Desc
            let desc = this.currentWeather.weather[0].description;

            // Temp
            let temp = this.currentWeather.main.temp

            // Feel
            let feel = this.currentWeather.main.feels_like;


            this.createFirstWeatherElement(currentDateString, currentTimeString, image, desc, temp, feel);
        }

        if(this.forecastWeather)
        {
            let elements = this.forecastWeather.list;

            for(let element of elements)
            {
                // Date
                let currentDate = new Date(element.dt_txt);
                let currentDateString = currentDate.toLocaleDateString();

                // Time
                let currentTimeString = currentDate.toLocaleTimeString().slice(0,5);

                // Image
                let image = element.weather[0].icon;

                // Desc
                let desc = element.weather[0].description;

                // Temp
                let temp = element.main.temp

                // Feel
                let feel = element.main.feels_like;


                this.createWeatherElement(currentDateString, currentTimeString, image, desc, temp, feel);
            }
        }
    }

    getWeather(query)
    {
        this.getCurrentWeather(query);
        this.getForecastWeather(query);
    }

    createWeatherElement(date, time, image, desc, temp, feel)
    {
        //Kontener
        let element = document.createElement("div");
        element.classList.add("weatherContainer");

        //Data
        let dateContainer = document.createElement("p");
        dateContainer.innerText = date;

        //Godzina
        let timeContainer = document.createElement("p");
        timeContainer.innerText = time;

        //Ikona
        let icon = document.createElement("img");
        icon.src = "https://openweathermap.org/img/wn/" + image + "@2x.png";

        //Opis
        let description = document.createElement("p");
        description.innerText = desc;
        description.style.textAlign = "center";

        //Temperatura
        let temperatura = document.createElement("p");
        temperatura.classList.add("temp");
        temperatura.innerText = temp + " °C";

        //Odczuwalna
        let odczuwalna = document.createElement("p");
        odczuwalna.innerText = "Odczuwalna: " + feel + " °C";
        odczuwalna.style.fontSize = "0.8em";


        //dodawanie elementow
        element.append(dateContainer);
        element.append(timeContainer);
        element.append(icon);
        element.append(description);
        element.append(temperatura);
        element.append(odczuwalna);
        this.container.append(element);
    }

    createFirstWeatherElement(date, time, image, desc, temp, feel)
    {
        //Kontener
        let element = document.createElement("div");
        element.classList.add("weatherContainer");
        element.id = "firstElement";


        //Date and time Kontener
        let dateCon = document.createElement("div");

        //Date and time Kontener
        let iconCon = document.createElement("div");

        //Date and time Kontener
        let tempCon = document.createElement("div");

        //Data
        let dateContainer = document.createElement("p");
        dateContainer.innerText = date;

        //Godzina
        let timeContainer = document.createElement("p");
        timeContainer.innerText = time;

        //Ikona
        let icon = document.createElement("img");
        icon.src = "https://openweathermap.org/img/wn/" + image + "@2x.png";
        icon.style.width = "50%";

        //Opis
        let description = document.createElement("p");
        description.innerText = desc;
        description.style.textAlign = "center";

        //Temperatura
        let temperatura = document.createElement("p");
        temperatura.classList.add("temp");
        temperatura.innerText = temp + " °C";

        //Odczuwalna
        let odczuwalna = document.createElement("p");
        odczuwalna.innerText = "Odczuwalna: " + feel + " °C";
        odczuwalna.style.fontSize = "0.8em";


        //dodawanie elementow
        dateCon.append(dateContainer);
        dateCon.append(timeContainer);

        iconCon.append(icon);
        iconCon.append(description);

        tempCon.append(temperatura);
        tempCon.append(odczuwalna);

        element.append(dateCon);
        element.append(tempCon);
        element.append(iconCon);

        this.container.append(element);
    }
}

document.weatherApp = new WeatherApp("ed4cd86be9f900b86179827780e6980d");
document.querySelector("header #inputContainer input").value = "Szczecin";
document.querySelector("header #inputContainer button").addEventListener("click", () => {
    let query = document.querySelector("header #inputContainer input").value;
    document.weatherApp.getWeather(query);
});