const clocks = game.users.contents[0].flags["challenge-tracker"];

for (const clockId in clocks) {
	const clock = ChallengeTracker.getById(clockId);
	
	if ((clock.innerCurrent === clock.innerTotal && clock.innerCurrent !== 0) || (clock.outerCurrent === clock.outerTotal && clock.outerCurrent !== 0)) {
		ChallengeTracker.closeById(clockId);
		ChallengeTracker.deleteById(clockId);
	}
}