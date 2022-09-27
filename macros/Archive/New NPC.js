let vitalDetails = [
    "Age",
    "Gender",
    "Sexuality",
    "Hair",
    "Facial Hair",
    "Heritage",
    "Tycherosi Tell",
    "Skin",
    "Clothing",
    "First Look",
]

let tables = {
	"Name": ["Given Name", "Surname"],
    "Role":"Profession",
	"Age":true,
	"Gender":true,
	"Sexuality":true,
	"Hair": ["Hair", "Hair Color"],
	"Facial Hair": {
		"odds": .5,
		"conditions": {
			"Gender": {
				"not": "Woman"
			}
		}
	},
	"Heritage":true,
	"Tycherosi Tell": {
		"table": "Demon Feature",
		"conditions": {
			"Heritage": {
				"is":"Tycheros"
			}
		}
	},
	"Skin":true,
	"Clothing": true,
	"First Look":true,
	"Goal":"Character Goal",
    "Background":"Profession",
    "Trait":true,
    "Revealed Aspect":true,
    "Preferred Method":true
}

let dialogChoices = {
	Name: {
		type: "text",
		headingLevel: 2
	},
	Role: {
		type: "text",
		headingLevel: 2
	}
}

let choices = await tfu.dialog.choice("New NPC", dialogChoices);

if (choices.Name == "") delete choices.Name;
if (choices.Role == "") delete choices.Role;

let npc = await tfu.fitd.generateNPC(choices, vitalDetails, tables);