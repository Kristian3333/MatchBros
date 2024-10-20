// utils.js

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

function generateActivityGroups(users) {
    const activities = [
        { name: 'Fitness', key: 'fitness' },
        { name: 'Going Out', key: 'goingOut' },
        { name: 'Tim Ferriss', key: 'timFerriss' },
        { name: 'Chess', key: 'chess' },
        { name: 'Entrepreneurship', key: 'entrepreneurship' },
        { name: 'Gaming', key: 'gaming' },
        { name: 'Andrew Huberman', key: 'andrewHuberman' }
    ];

    return activities.map(activity => {
        const sortedUsers = users
            .filter(user => user.interests && typeof user.interests[activity.key] === 'number')
            .map(user => ({
                name: user.name,
                interestLevel: user.interests[activity.key]
            }))
            .sort((a, b) => b.interestLevel - a.interestLevel);

        const groups = [];
        for (let i = 0; i < sortedUsers.length; i += 3) {
            groups.push(sortedUsers.slice(i, i + 3));
        }

        return {
            name: activity.name,
            groups: groups
        };
    });
}

module.exports = { calculateSimilarity, findBestMatches, generateActivityGroups };