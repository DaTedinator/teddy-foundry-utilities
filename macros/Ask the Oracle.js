function rollTable(name) {
    const table = game.tables.getName(name);
    table.draw();
  }
  
  const myDialog = new Dialog({
    title: "Ask the Oracle",
    content: `Choose Likelihood`,
    buttons: {
      almostCertain: {
        label: "Almost Certain",
        callback: () => {rollTable("Ask: Almost Certain")}
      },
      likely: {
        label: "Likely",
        callback: () => {rollTable("Ask: Likely")}
      },
      fiftyFifty: {
        label: "50/50",
        callback: () => {rollTable("Ask: 50/50")}
      },
      unlikely: {
        label: "Unlikely",
        callback: () => {rollTable("Ask: Unlikely")}
      },
      smallChance: {
        label: "Small Chance",
        callback: () => {rollTable("Ask: Small Chance")}
      }
    }
  }).render(true);