const { User } = require('./db');

const findMatches = async (user) => {
    const matches = await User.find({
        _id: { $ne: user._id },
        location: {
            $near: {
                $geometry: user.location,
                $maxDistance: 50000, // 50 km
            },
        },
    }).limit(20);

    return matches.map(match => {
        const score = calculateMatchScore(user, match);
        return { ...match.toObject(), score };
    }).sort((a, b) => b.score - a.score);
};

const calculateMatchScore = (user1, user2) => {
    let score = 0;
    const interests1 = new Map(user1.interests.map(i => [i.name, i.rating]));
    const interests2 = new Map(user2.interests.map(i => [i.name, i.rating]));

    for (const [interest, rating1] of interests1) {
        if (interests2.has(interest)) {
            const rating2 = interests2.get(interest);
            score += 10 - Math.abs(rating1 - rating2);
        }
    }

    return score;
};

module.exports = { findMatches };