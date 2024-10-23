
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

function generateSimilarityGroups(users, groupSize) {
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
        const groups = [];
        const usersWithInterest = users
            .filter(user => user.interests && user.interests[activity.key] > 0)
            .map(user => ({
                name: user.name,
                interestLevel: user.interests[activity.key],
                interests: user.interests
            }));

        // Sort users by interest level in the specific activity
        usersWithInterest.sort((a, b) => b.interestLevel - a.interestLevel);

        // Create groups based on similarity
        let remainingUsers = [...usersWithInterest];
        while (remainingUsers.length >= groupSize) {
            // Take the user with highest interest as the base for the new group
            const baseUser = remainingUsers[0];
            remainingUsers = remainingUsers.slice(1);

            // Find the most similar users to the base user
            const mostSimilarUsers = remainingUsers
                .map(user => ({
                    ...user,
                    similarity: calculateSimilarity(
                        { interests: baseUser.interests },
                        { interests: user.interests }
                    )
                }))
                .sort((a, b) => b.similarity - a.similarity)
                .slice(0, groupSize - 1);

            // Create the group
            if (mostSimilarUsers.length === groupSize - 1) {
                groups.push([baseUser, ...mostSimilarUsers]);
                // Remove the selected users from remaining users
                remainingUsers = remainingUsers.filter(user => 
                    !mostSimilarUsers.some(selectedUser => selectedUser.name === user.name)
                );
            }
        }

        return {
            name: activity.name,
            groups: groups
        };
    }).filter(activity => activity.groups.length > 0);
}

module.exports = {
    calculateSimilarity,
    findBestMatches,
    generateActivityGroups,
    generateSimilarityGroups
};