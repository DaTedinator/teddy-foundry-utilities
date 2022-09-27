let rollResult = await tfu.dialog.choice("Roll Result", {
    position: {
        type: "radio",
        headingLevel: 4,
        options: [
            "Controlled",
            "Risky",
            "Desperate"
        ]
    }, 
    effect: {
        type: "radio",
        headingLevel: 4,
        options: [
            "Zero",
            "Limited",
            "Standard",
            "Great",
            "Extreme"
        ]
    },
    Failure: {
        type: "button"
    },
    Partial: {
        label: "Partial Success",
        type: "button"
    },
    Success: {
        type: "button"
    },
    Critical: {
        type: "button"
    }
})

const [position, effect, result] = [rollResult.position, rollResult.effect, rollResult.button];

const heading = `<h1>${rollResult.button}</h1>\n`
const subheading = `<h3>${rollResult.position} / ${rollResult.effect}</h3>\n`
const text = tfu.fitd.interpretRollResult(position, effect, result)

const messageContentArray = [
    heading,
    subheading,
    text
];

await ChatMessage.create({content:messageContentArray.join("")})