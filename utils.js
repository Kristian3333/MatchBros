function calculateSimilarity(user1, user2) {
    const interests = ['fitness', 'goingOut', 'timFerriss', 'chess', 'entrepreneurship', 'gaming', 'andrewHuberman'];
    let sumOfSquares = 0;
    let totalWeight = 0;

    interests.forEach(interest => {
        const weight = (user1.interests[interest] + user2.interests[interest]) / 20; // Higher weight for shared high interests
        const diff = user1.interests[interest] - user2.interests[interest];
        sumOfSquares += weight * diff * diff;
        totalWeight += weight;
    });

    return 1 - Math.sqrt(sumOfSquares / totalWeight) / 10; // Normalize to 0-1 range
}

function findBestMatches(user, allUsers, numMatches = 5) {
    const otherUsers = allUsers.filter(u => u._id.toString() !== user._id.toString());
    const usersWithSimilarity = otherUsers.map(otherUser => ({
        ...otherUser.toObject(),
        similarity: calculateSimilarity(user, otherUser)
    }));

    return usersWithSimilarity
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, numMatches);
}

function generateActivityGroups(users, numActivities = 5, usersPerActivity = 3) {
    const allPairs = [];
    for (let i = 0; i < users.length; i++) {
        for (let j = i + 1; j < users.length; j++) {
            allPairs.push({
                user1: users[i],
                user2: users[j],
                similarity: calculateSimilarity(users[i], users[j])
            });
        }
    }

    allPairs.sort((a, b) => b.similarity - a.similarity);

    const activities = Array.from({ length: numActivities }, (_, i) => ({
        name: `Activity ${i + 1}`,
        members: []
    }));

    const assignedUsers = new Set();

    allPairs.forEach(pair => {
        if (assignedUsers.size >= users.length) return;

        const availableActivities = activities.filter(activity => activity.members.length < usersPerActivity);
        if (availableActivities.length === 0) return;

        const activity = availableActivities[0];

        if (!assignedUsers.has(pair.user1._id.toString())) {
            activity.members.push({ name: pair.user1.name, id: pair.user1._id });
            assignedUsers.add(pair.user1._id.toString());
        }
        if (!assignedUsers.has(pair.user2._id.toString()) && activity.members.length < usersPerActivity) {
            activity.members.push({ name: pair.user2.name, id: pair.user2._id });
            assignedUsers.add(pair.user2._id.toString());
        }
    });

    // Assign any remaining users to activities with space
    users.forEach(user => {
        if (!assignedUsers.has(user._id.toString())) {
            const availableActivity = activities.find(activity => activity.members.length < usersPerActivity);
            if (availableActivity) {
                availableActivity.members.push({ name: user.name, id: user._id });
                assignedUsers.add(user._id.toString());
            }
        }
    });

    return activities.filter(activity => activity.members.length > 0);
}

module.exports = { calculateSimilarity, findBestMatches, generateActivityGroups };