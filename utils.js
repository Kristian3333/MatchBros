function generateActivityGroups(users) {
    const activities = [
        { name: 'Fitness', key: 'fitness' },
        { name: 'Beer', key: 'beer' },
        { name: 'Going Out', key: 'goingOut' }
    ];

    return activities.map(activity => {
        const sortedUsers = users
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

module.exports = { generateActivityGroups };