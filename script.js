class Task{
    constructor(text, date = "", finished = 0){
        this.text = text;
        this.date = date;
        this.finished = finished;
    }
}

class ToDoList {
    constructor(tasks = [])
    {
        this.tasks = tasks;   
    }

    createHtmlElement(_type, _class, _id = -1)
    {
        var element = document.createElement(_type,);

        if(_class != "")
            element.className = _class;

        if(_id >= 0)
            element.id = _id;

        return element;
    }

    draw()
    {
        let con = document.getElementById("container");
        con.innerHTML = "";

        let id = 0;
        for(let task of this.tasks)
        {
            let _div = this.createHtmlElement("div", "entry", id);

            let _checkbox = this.createHtmlElement("div", "checkbox");
            _checkbox.onclick = function(event) {
                cross(event.target.parentElement);
            }


            let _info = this.createHtmlElement("div", "info");

            let _text = this.createHtmlElement("div", "text");
            let searchbar = document.getElementById("searchBar");
            if(searchbar.value != "" && searchbar.value.length >= 2)
            {
                let textPrompt = searchbar.value;
                let position = task.text.search(new RegExp(textPrompt, "i"));
                if(position < 0)
                    continue;

                let span = this.createHtmlElement("span", "HL");
                let hltext = task.text.substr(position, searchbar.value.length);
                span.append(hltext);
                _text.append(task.text.substr(0, position));
                _text.append(span);
                _text.append(task.text.substr(position + searchbar.value.length, task.text.length));
            }
            else
                _text.innerText = task.text;

            _text.addEventListener("click", (e) => {
                let entry = e.target.parentElement.parentElement;
                let id = parseInt(entry.getAttribute("id"));

                if(todo.tasks[id].finished == 0)
                {
                    let inputField = document.createElement("input");
                    let text = _text.innerText;
                    inputField.value = text;
                    inputField.addEventListener("focusout", (e) => {
                        saveChanges(e, "text");
                    });
            
                    e.target.replaceWith(inputField);
                    inputField.focus();
                }
            });

            let _date = this.createHtmlElement("div", "date");
            _date.innerText = task.date;
            _date.addEventListener("click", (e) => {
                let entry = e.target.parentElement.parentElement;
                let id = parseInt(entry.getAttribute("id"));

                if(todo.tasks[id].finished == 0)
                {
                    let inputField = document.createElement("input");
                    inputField.type = "date";
                    let text = _date.innerText;
                    inputField.value = text;
                    inputField.addEventListener("focusout", (e) => {
                        saveChanges(e, "date");
                    });
            
                    e.target.replaceWith(inputField);
                    inputField.focus();
                }
            });


            let _line = this.createHtmlElement("div", "line");


            let _removeB = this.createHtmlElement("div", "removeB");
            _removeB.onclick = function(event) {
                todo.deleteElement(event.target.parentElement.getAttribute("id"));
            }

            _info.append(_text);
            _info.append(_date);
            _info.append(_line);

            _div.append(_checkbox);
            _div.append(_info);
            _div.append(_removeB);
            con.append(_div);

            setColors(_div, task.finished);

            id = id + 1;
        }

        this.save();
    }

    addElement(text, date)
    {
        this.tasks.push(new Task(text, date));
    }

    deleteElement(idx)
    {
        this.tasks.splice(idx, 1);
        this.draw();
    }

    save()
    {
        const json = JSON.stringify(this.tasks);      
        localStorage.setItem("todo", json);
    }
}

var todo = new ToDoList();
var currentDate = new Date(); 

function start()
{
    if(localStorage.getItem("todo"))
    {
        let json = localStorage.getItem("todo");
        let tasks = JSON.parse(json);
        todo.tasks = tasks;
    }

    todo.draw();
}


function addElement()
{
    let textF = document.getElementById("textField");
    let dateF = document.getElementById("dateField");
    let text = textF.value;
    let date = dateF.value;

    textF.value = "";
    dateF.value = "";

    if(date != "")
    {
        const date_elements = date.split("-");
        let day = parseInt(date_elements[2]);
        let month = parseInt(date_elements[1]);
        let year = parseInt(date_elements[0]);

        date = day + "-" + month + "-" + year;

        if(year == currentDate.getFullYear())
        {
            if(month == currentDate.getMonth() + 1)
            {
                if(day < currentDate.getDate())
                    return;
            }
            else if(month < currentDate.getMonth())
                return;
        }
        else if(year < currentDate.getFullYear())
            return;
    }

    if(text.length < 3 || text.length > 255)
    {
        textF.value = "Nie poprawna ilosc znakow";
        return;
        // alert("Task musi miec przynajmniej 3 znaki!");   
    }

    todo.addElement(text, date);
    todo.draw();
}

function focusText(text)
{
    document.getElementById(text).select()
}

function cross(e)
{
    let entry = e;
    let line = entry.getElementsByClassName("line")[0];

    let info = entry.querySelector(".info");
    let checkbox = entry.querySelector(".checkbox");

    if(todo.tasks[e.getAttribute("id")].finished == 1)
    {
        checkbox.style.backgroundColor = "rgb(218, 217, 225)";
        info.style.color = 'rgb(230, 230, 230)';
        line.style.visibility = "hidden";
        todo.tasks[e.getAttribute("id")].finished = 0;
    }
    else
    {
        checkbox.style.backgroundColor = "rgb(95, 83, 154)";
        info.style.color = "rgb(161, 159, 159)";
        line.style.visibility = "visible";
        todo.tasks[e.getAttribute("id")].finished = 1;
    }

    todo.save();
}

function setColors(e, finished) {

    let entry = e;
    let line = entry.getElementsByClassName("line")[0];

    let info = entry.querySelector(".info");
    let checkbox = entry.querySelector(".checkbox");

    if(finished == 0)
    {
        checkbox.style.backgroundColor = "rgb(218, 217, 225)";
        info.style.color = 'rgb(230, 230, 230)';
        line.style.visibility = "hidden";
    }
    else
    {
        checkbox.style.backgroundColor = "rgb(95, 83, 154)";
        info.style.color = "rgb(161, 159, 159)";
        line.style.visibility = "visible";
    }
}

function changedSearchPrompt(){
    todo.draw();
}

function saveChanges(e, type) {
    let entry = e.target.parentElement.parentElement;
    let id = parseInt(entry.getAttribute("id"));

    let text = e.target.value;
    if(type == "text")
    {
        if(text.length >= 3)
            todo.tasks[id].text = text;
    }
    else
    {
        if(text != "")
        {    
            const date_elements = text.split("-");
            let day = parseInt(date_elements[2]);
            let month = parseInt(date_elements[1]);
            let year = parseInt(date_elements[0]);

            text = day + "-" + month + "-" + year;

            if(year == currentDate.getFullYear())
            {
                if(month == currentDate.getMonth() + 1)
                {
                    if(day < currentDate.getDate())
                        return todo.draw();
                }
                else if(month < currentDate.getMonth())
                    return todo.draw();
            }
            else if(year < currentDate.getFullYear())
                return todo.draw();

            todo.tasks[id].date = text;
        }
    }

    todo.draw();
}