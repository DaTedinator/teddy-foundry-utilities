const choices = await tfu.dialog.choice("New Clock", {
	clockName: {
		type:"text",
		headingLevel:2
	},
	type: {
		type:"dropdown",
		options: [
			"job / good",
			"job / bad",
			"long-term project",
			"other"
		],
		headingLevel:3
	},
	size: {
		type:"dropdown",
		options: [
			4,
			6,
			8,
			10,
			12
		],
		headingLevel:3
	}
})

const clockName = choices.clockName,
      size = choices.size,
      type = choices.type.split(" / ")[0],
      subtype = choices.type.split(" / ")[1];

console.log(size);

await tfu.fitd.generateClock(clockName,size,type,subtype);