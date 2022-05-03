
let xSize = 10;
let ySize = 10;

let mapstring = 
("WWWWWWWWWW"+
"WFFFFFFFFW"+
"WFFFFFFFFW"+
"WFFFFFFFFW"+
"WFFFFFFFFW"+
"WFFFFFFFFW"+
"WFFFFFFFFW"+
"WFFFFFFFFW"+
"WFFFFFFFFW"+
"WWWWWWWWWW").split("").reverse();

const map = mapGen();

function mapGen() {
	var temp = [];
	for (let indexY = 0; indexY < ySize; indexY++) {
		var element = [];
		for (let indexX = 0; indexX < xSize; indexX++) {
			element[indexX] = mapstring.pop();
		}
		temp[indexY] = element;
	}
	return temp;
}


document.getElementById("Sokoban").innerHTML = "<div id=\"grid\"></div>";

let grid = document.getElementById("grid");

let moves = 0;

let highScores = function() {
	let element = document.createElement("div");
	element.id = "highscores";
	element.innerHTML = "<h1>Local Highscores!</h1><ol><li>asdasdasd</li></ol>";

	document.body.appendChild(element);
	return element;
}();


Gridify(tileMap01.mapGrid, "row", grid, false);

document.addEventListener("keydown",  
function(e) {
	if (e.key == "ArrowLeft" || e.key == "ArrowRight" || e.key == "ArrowUp" || e.key == "ArrowDown") {
		e.preventDefault();
		if(MovePlayer(e.key)) {
			moves++;
		}
	}

	if (document.getElementsByClassName(Entities.BlockDone).length == 6) {
		
		let restart = window.confirm(`You have won! It took you ${moves} moves, well done.`);
	}
})

function Gridify(array, divClass, parentDiv, addValue){
	parentDiv.innerHTML="";
	let id = 0;

	array.forEach(value => {
		let newElement = document.createElement("div");
		newElement.className = divClass;
		
		if(addValue) {
			//newElement.setAttribute("value", value);
			newElement.id = `${parentDiv.id}c${id}`;
			SetTile(newElement, value);
			
		}
		else {
			newElement.id = `r${id}`;
			Gridify(value, "tile", newElement, true);
		}
		parentDiv.appendChild(newElement);
		id++;
	});
}
function SetTile(element, value) {
	if (value == " " || value == "P" || value == "B") {
		element.className = Tiles.Space;
		if (value == "P") {
			SetEntity(element, Entities.Character);
		}
		else if (value == "B") {
			SetEntity(element, Entities.Block);
		}
	}
	else if (value == "W") {
		element.className = Tiles.Wall;
	}
	else if (value == "G") {
		element.className = Tiles.Goal;
	}
}
function SetEntity(element, value) {
	if (value == Entities.Character) {
		element.innerHTML = `<img src=\"100.png\" id=\"${Entities.Character}\" class=\"${Entities.Character}\">`;
	}
	else if (value == Entities.Block || value == Entities.BlockDone) {
		if (element.className == Tiles.Goal) {
			element.innerHTML = `<img src=\"202.png\" class=\"${Entities.BlockDone}\">`;
			return;
		}
		element.innerHTML = `<img src=\"201.png\" class=\"${Entities.Block}\">`;
	}
	else {
		element.innerHTML = "";
	}
}

function MovePlayer(direction) {
	let playerElement = document.getElementById(Entities.Character).parentElement;

	let targetElement = FindTarget(direction, playerElement);

	if (ValidateMove(targetElement, true, direction)) {
		if (targetElement.hasChildNodes()) {
			MoveEntity(direction, targetElement);
		}
		MoveEntity(direction, playerElement);
		return true;
	}
	return false;
}
function MoveEntity(direction, sourceElement) {
	let targetElement = FindTarget(direction, sourceElement);
	let entity = sourceElement.firstElementChild.className;

	SetEntity(targetElement, entity);
	SetEntity(sourceElement, "");
}
function ValidateMove(targetElement, isPlayer, direction) {
	if (targetElement.className == Tiles.Space || targetElement.className == Tiles.Goal) {
		if (targetElement.childElementCount == 0) {
			return true;
		}
		else if (isPlayer) {
			let targetOfTarget = FindTarget(direction, targetElement);
			return ValidateMove(targetOfTarget, false, direction);
		}
	}
	return false;
}
function FindTarget(direction, sourceElement) {
	let columnStart = sourceElement.id.indexOf("c");
	let row = sourceElement.id.substring(1,columnStart);
	let column = sourceElement.id.substring(columnStart+1, sourceElement.id.length);
	
	switch (direction) {
		case "ArrowLeft":
			column--;
			break;
		case "ArrowRight":
			column++;
			break;
		case "ArrowUp":
			row--;
			break;
		case "ArrowDown":
			row++;
			break;
		default:
			break;
	}
	return document.getElementById(`r${row}c${column}`);
}
