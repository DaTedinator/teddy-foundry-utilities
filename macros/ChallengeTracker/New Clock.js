//REQUIRES CHALLENGE TRACKER MODULE
//CONSTANTS
const COLOR = {
	on: "dc",
	off: "b0",
	black: [false,false,false],
	red: [true,false,false],
	green: [false,true,false],
	blue: [false,false,true],
	yellow: [true,true,false],
	magenta: [true,false,true],
	turquoise: [false,true,true],
	white: [true,true,true]
},
BASE_FRAME_WIDTH = "thin",
BASE_SIZE = 100,
BASE_WINDOWED = false;

//OPTIONS

const choices = {
	clockName: {
		type: "text",
		headingLevel: 3
	},
	Pips: {
		type: "heading",
		headingLevel: 3
	},
	outerPips: {
		type: "number",
		headingLevel: 0,
		value: 4
	},
	innerPips: {
		type: "number",
		headingLevel: 0,
		value: 0
	},
	clockType: {
		type: "dropdown",
		options: [
			"Bad",
			"Good",
			"Neutral",
			"Project",
			"World",
			"Other"
		]
	}
}

function makeClock(choices) {
	console.log(choices);
	
	let name = choices.clockName,
		outerPipCount = choices.outerPips,
		innerPipCount = choices.innerPips,
		type = choices.clockType.toLowerCase(),
		frameWidth = BASE_FRAME_WIDTH,
		size = BASE_SIZE,
		windowed = BASE_WINDOWED,
		outerColor = "black",
		innerColor = "black",
		prefix = "Other"
	
	switch (type) {
		case "bad":
			outerColor = "red";
			innerColor = "green";
			prefix = "Job";
			break;
		case "good":
			outerColor = "green";
			innerColor = "red";
			prefix = "Job";
			break;
		case "neutral":
			outerColor = "yellow";
			innerColor = "blue";
			prefix = "Job";
			break;
		case "project":
			outerColor = "turquoise";
			innerColor = "green";
			prefix = choices.clockType;
			break;
		case "world":
			outerColor = "magenta";
			innerColor = "yellow";
			prefix = choices.clockType;
			break;
		case "other":
			outerColor = "blue";
			innerColor = "white";
			prefix = choices.clockType;
			break;
	}
	
	let outerOn = "#", outerOff = "#", innerOn = "#", innerOff = "#";
	
	for (code of COLOR[outerColor]) {
		outerOn += code ? COLOR.on : "00";
		outerOff += code ? COLOR.off : "00";
	}
	outerOn += "FF";
	outerOff += "66";
	
	for (code of COLOR[innerColor]) {
		innerOn += code ? COLOR.on : "00";
		innerOff += code ? COLOR.off : "00";
	}
	innerOn += "FF";
	innerOff += "66";
	
	ChallengeTracker.open(parseInt(outerPipCount), parseInt(innerPipCount), {
		title: `${prefix}: ${name}`,
		outerColor: outerOn,
		outerBackgroundColor: outerOff,
		innerColor: innerOn,
		innerBackgroundColor: innerOff,
		frameWidth: frameWidth,
		size: size,
		windowed: windowed,
		persist: true
	})
}

makeClock(await tfu.dialog.choice("New Clock", choices));