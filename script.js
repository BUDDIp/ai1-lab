let map;
let marker;
let width;
let height;

let placedCorrectly = 0;

function showNotification()
{
    Notification.requestPermission();

    if(Notification.permission === "granted")
    {
        const notification = new Notification("Congratulations! You made it!");
    }
}

function startHTML()
{
    map = L.map('map').setView([53.430127, 14.564802], 18);
    // L.tileLayer.provider('OpenStreetMap.DE').addTo(map);
    L.tileLayer.provider('Esri.WorldImagery').addTo(map);
    marker = L.marker([53.430127, 14.564802]).addTo(map);
    marker.bindPopup("<strong>Hello!</strong><br>This is a popup.");

    let canvas = document.getElementById("rasterMap");
    let dimensions = map.getSize();
    width = dimensions.x;
    height = dimensions.y;
    canvas.width = width;
    canvas.height = height;

    // Set target behaviour
    let targets = document.querySelectorAll(".target");

    for(let target of targets)
    {
        target.style.border = "1px dashed red";

        target.style.width = width/4 + "px";
        target.style.height = height/4 + "px";

        target.addEventListener("dragenter", function (event){
            this.style.border = "1px solid #252525";
        });
        target.addEventListener("dragexit", function (event){
            this.style.border = "1px dashed red";
        });
        target.addEventListener("drop", function (event){
            let myPiece = document.querySelector("#" + event.dataTransfer.getData("text"));

            // Sprawdz czy miejsce jest puste
            if(this.innerHTML === "") {
                this.style.border = "none";
                this.appendChild(myPiece);

                // Sprawdz czy element jest na swoim miejscu
                if(myPiece.id.slice(1) === this.id.slice(1))
                {
                    myPiece.draggable = false;
                    this.style.border = "0 dashed red";
                    placedCorrectly++;

                    console.log("Poprawnie, umieszczono " + placedCorrectly.toString() + " z 16 puzzli");
                    if(placedCorrectly === 16)
                    {
                        console.log("Ukonczono!");
                        showNotification();
                    }
                }
            }

        }, false    );
        target.addEventListener("dragover",function (event){
           event.preventDefault();
        });
    }
}
function getLocation()
{
    if (! navigator.geolocation) {
        console.log("No geolocation.");
    }

    navigator.geolocation.getCurrentPosition(position => {
        console.log(position);
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;

        map.setView([lat, lon]);
    }, positionError => {
        console.error(positionError);
    });
}

function saveMapAsImage()
{
    leafletImage(map, function (err, canvas) {
        // here we have the canvas
        let rasterMap = document.getElementById("rasterMap");
        let rasterContext = rasterMap.getContext("2d");

        rasterContext.drawImage(canvas, 0, 0, width, height);

        sliceImage();
    });
}

function sliceImage()
{
    // Wyczysc kontener
    const container = document.getElementById("pomieszane");
    container.innerHTML = "";

    // Okresl rozmiary czesci
    const sw = width / 4;
    const sh = height / 4;

    // zapisz informacje o kazdym elemencie obrazu w tablicy
    const arrayOfImages = [];
    for (let i = 0; i < 4; i++) {
        const offset_y = sh * i;

        for (let j = 0; j < 4; j++) {
            // utworz element canvas

            const offset_x = sw * j;

            const info = ["C" + (i * 4 + j), offset_x, offset_y];
            arrayOfImages.push(info);
        }
    }

    //shuffle
    let size = arrayOfImages.length;

    for(let i  = 0; i < size; i++)
    {
         let rand = Math.floor(Math.random() * size);
         const temp = arrayOfImages[i];
         arrayOfImages[i] = arrayOfImages[rand];
         arrayOfImages[rand] = temp;
    }

    // Ryswoanie elementow
    leafletImage(map, function (err, canvas) {
        for(let i = 0; i < size; i++)
        {
            const pieceInfo = arrayOfImages[i];
            const id = pieceInfo[0];
            const offset_x = pieceInfo[1];
            const offset_y = pieceInfo[2];


            const image = document.createElement("canvas");
            image.width = width;
            image.height = height;
            image.classList.add("piece");
            image.id = id;
            image.draggable = true;
            image.style.width = sw + "px";
            image.style.height = sh + "px";

            let rasterContext = image.getContext("2d");

            rasterContext.drawImage(canvas, offset_x, offset_y, sw, sh, 0, 0, width, height);

            container.append(image);

            image.addEventListener("dragstart", function (event)
            {
                event.dataTransfer.setData("text", this.id)
            })
        }
    });
}