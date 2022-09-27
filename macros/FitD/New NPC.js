const choices = await tfu.dialog.choice("New NPC", {
	Name: {
		type: "text",
		headingLevel: 2
	},
	Role: {
		type: "text",
		headingLevel: 2
	}
});

if (choices.Name == "") delete choices.Name;
if (choices.Role == "") delete choices.Role;

let approved = false,
	cancelled = false,
	sanityCheck = 0;

while ( (approved === false) && (cancelled === false) && (sanityCheck < 100) ) {
	sanityCheck++;

	let details = await tfu.npc.generateDetails(tfu.fitd.npcTables, choices);
	const vitals = tfu.npc.makeVitals(details, tfu.fitd.npcVitalDetails, false),
		  biography = tfu.fitd.generateBiography(details, false),
		  content = vitals + "<br>" + biography;
	
	const approval = await tfu.dialog.choice("Is this NPC acceptable?", {
		"NPC Details":{
			type: "displaytext",
			headingLevel:2,
			content:content
		},
		"Accept": {
			type: "button"
		},
		"Regenerate": {
			type: "button"
		}
	})
	
	switch (approval.button) {
		case "Accept":
			approved = true;
			break;
		case "Regenerate":
			break;
		default:
			cancelled = true;
	}

	if(approved) {
		await tfu.fitd.generateNPC(details);
		tfu.organize("actors","##");
	}
}