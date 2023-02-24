const canvas = document.querySelector("canvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.backgroundColor = "gray";

let ctx = canvas.getContext("2d");

//array to store all dots
let dotsArr = [];

//min distance required to connect dots
const minDistance = 101;

//function to get a random color
function getRandomColor() {
    let r = Math.floor(Math.random() * 256);
    let g = Math.floor(Math.random() * 256);
    let b = Math.floor(Math.random() * 256);
    return "rgb(" + r + ", " + g + ", " + b + ")";
}

//function to add between 1 to 10 dots to the array
function addDot(){
	//spawn random number between 1 to 10;
	let dots = Math.floor(Math.random() * 10) + 1;
	for (let i = 0; i < dots; i++){
		let x = Math.random() * innerWidth;
		let y = Math.random() * innerHeight;
		//make sure they do not get created outside the canvas bounds
		while (x < 30 || x > innerWidth - 30 || y < 30 || y > innerHeight - 30) {
			x = Math.random() * innerWidth;
			y = Math.random() * innerHeight;
		}
		let dot = {
			x: x,
			y: y,
			radius: Math.floor(Math.random() * (20 - 10 + 1)) + 10, //conventional way of writing random numbers so that the result is self-explanatory
			dx: (Math.random() - 0.5) * 3, //random number between -1.5 and 1.5
			dy: (Math.random() - 0.5) * 3, //random number between -1.5 and 1.5
			disappearTime: Math.floor(Math.random() * (5 - 1 + 1)) + 1,
			color: getRandomColor()
		};

		//makes the dot disappear at a random time between 1 to 5 seconds
		setTimeout(() => {
			dotsArr.splice(dotsArr.indexOf(dot), 1);
		}, dot.disappearTime * 1000);

		//if there are way too many dots, time to purge
		if(dotsArr.length > 1000){
			dotsArr = [];
		};
		
		//add the dot to the array
		dotsArr.push(dot);
	}
}
//add new dots every 0.5 seconds
setInterval(addDot, 500); 

//function to draw the dots and the lines on the canvas
function draw(){
	//for every dot in the array, draw it on the canvas
    for (let i = 0; i < dotsArr.length; i++){
        let dot = dotsArr[i];
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = dot.color;
        ctx.fill();
    }

    ctx.beginPath();
    for(let i = 0; i < dotsArr.length; i++){
        let l1 = dotsArr[i];
        ctx.moveTo(l1.x, l1.y);
        for(let j = 0; j < dotsArr.length; j++){
            let l2 = dotsArr[j];
			//if the distance is less than minDistance, draw it and have it be the color of the connecting dots
            if(distance(l1, l2) < minDistance) {
                ctx.lineTo(l2.x, l2.y);
            }
        }
    }
	ctx.strokeStyle = "white";
    ctx.stroke();
}

//function to move the dots
function update(){
    for(let i = 0; i < dotsArr.length; i++){
        let s = dotsArr[i];
        s.x += s.dx;
        s.y += s.dy;

        //bounce the dots off the walls
        if (s.x > innerWidth - s.radius|| s.x < 0 + s.radius) {
            s.dx = -s.dx;
        }
        if (s.y > innerHeight - s.radius|| s.y  < 0 + s.radius) {
            s.dy = -s.dy;
        }
    }
}

//function to calculate distance between two dots using Pythagora's theorem
//square root of the sum of the squares of the horizontal and vertical distances
function distance(point1, point2){
	let dx = 0;
	let dy = 0;

	dx = point2.x - point1.x;
	dx = dx * dx;
	dy = point2.y - point1.y;
	dy = dy * dy;

	return Math.sqrt(dx + dy);
}

//where the magic happens
function animation(){
	requestAnimationFrame(animation);
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	update();
	draw();
}

animation();
