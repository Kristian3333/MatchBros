
function generateActivityGroups(users) {
    console.log('Generating activity groups for', users.length, 'users');
    
    const activities = [
        { name: 'Fitness', key: 'fitness' },
        { name: 'Beer', key: 'beer' },
        { name: 'Going Out', key: 'goingOut' }
    ];

    return activities.map(activity => {
        console.log('Processing activity:', activity.name);
        
        const sortedUsers = users
            .filter(user => user.interests && typeof user.interests[activity.key] === 'number')
            .map(user => ({
                name: user.name,
                interestLevel: user.interests[activity.key]
            }))
            .sort((a, b) => b.interestLevel - a.interestLevel);

        console.log('Sorted users for', activity.name, ':', sortedUsers.length);

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