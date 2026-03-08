const fs = require('fs');

try {
    const eventData = fs.readFileSync('event_list.json', 'utf8');
    const challengeData = fs.readFileSync('challenge_list.json', 'utf8');
    const events = JSON.parse(eventData);
    const challenges = JSON.parse(challengeData);

    const weeklyEvent = events[Math.floor(Math.random() * events.length)];
    
    const flattenedChallenges = challenges.flatMap(cat => 
        cat.challenges.map(item => ({
            ...item,
            categoryName: cat.categoryName,
            maxPicks: cat.maxPicks
        }))
    );

    const shuffledPool = flattenedChallenges.sort(() => 0.5 - Math.random());
    const selectedChallenges = [];
    const categoryTally = {};

    for (const item of shuffledPool) {
        if (selectedChallenges.length >= 5) break;

        const currentCount = categoryTally[item.categoryName] || 0;

        if (currentCount < item.maxPicks) {
            selectedChallenges.push(item);
            categoryTally[item.categoryName] = currentCount + 1;
        }
    }

    const weeklyChallenges = flattenedChallenges
        .sort(() => 0.5 - Math.random())
        .slice(0, 5);

    const weeklySelection = {
      event: weeklyEvent,
      challenges: weeklyChallenges
    }
  
    fs.writeFileSync('latest.json', JSON.stringify(weeklySelection, null, 2));
    
    console.log("Weekly challenge successfully generated");
} catch (error) {
    console.error("Something fucked up:", error);
    process.exit(1);
}
