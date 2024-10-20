import { useState } from 'react';
import React from 'react';

const activities = [
  { id: 'fitness', name: 'Fitness' },
  { id: 'beer', name: 'Beer' },
  { id: 'goingOut', name: 'Going Out' },
  { id: 'jockoWillink', name: 'Jocko Willink' },
  // Add more activities as needed
];

export default function Home() {
  const [name, setName] = useState('');
  const [preferences, setPreferences] = useState(
    activities.reduce((acc, activity) => {
      acc[activity.id] = 0; // Initialize each activity rating to 0
      return acc;
    }, {})
  );
  const [submitted, setSubmitted] = useState(false);
  const [users, setUsers] = useState([]);

  // Function to update each activity's rating
  const handlePreferenceChange = (activityId, value) => {
    setPreferences((prev) => ({
      ...prev,
      [activityId]: value,
    }));
  };

  // Handle submission of the form (name + preferences)
  const handleSubmit = (event) => {
    event.preventDefault();
    const newUser = { name, preferences };
    setUsers((prevUsers) => [...prevUsers, newUser]); // Save the user's data
    setSubmitted(true); // Mark the form as submitted
  };

  // Handle event creation (match users with similar preferences)
  const handleCreateEvent = () => {
    const threshold = 4; // Define a similarity threshold for matching
    const matchedUsers = users.filter((user) => {
      return Object.keys(preferences).some(
        (activity) =>
          Math.abs(user.preferences[activity] - preferences[activity]) <= threshold
      );
    });
    alert(`Event created! Inviting: ${matchedUsers.map((u) => u.name).join(', ')}`);
  };

  return (
    <div>
      <title>Find Your Activity Buddy</title>
      <meta name="description" content="Find workout partners or activity buddies" />

      <main style={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* Left Section - Preferences Form */}
        <section style={{ flex: 1 }}>
          <h1>Find Your Activity Buddy</h1>
          {!submitted ? (
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
                required
              />
              <h2>Rate Your Interests:</h2>
              {activities.map((activity) => (
                <div key={activity.id}>
                  <label>{activity.name}</label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={preferences[activity.id]}
                    onChange={(e) =>
                      handlePreferenceChange(activity.id, parseInt(e.target.value))
                    }
                  />
                  <span>{preferences[activity.id]}</span>
                </div>
              ))}
              <button type="submit">Submit Preferences</button>
            </form>
          ) : (
            <div>
              <h2>Your Preferences</h2>
              <p>Name: {name}</p>
              {activities.map((activity) => (
                <div key={activity.id}>
                  <strong>{activity.name}</strong>: {preferences[activity.id]}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Right Section - Event Creation */}
        <section style={{ flex: 1, marginLeft: '20px' }}>
          <h2>Create an Event</h2>
          <button onClick={handleCreateEvent}>Create Event with Matched Users</button>

          <h3>Users:</h3>
          {users.map((user, index) => (
            <div key={index}>
              <p>
                <strong>{user.name}</strong>
              </p>
              {activities.map((activity) => (
                <div key={activity.id}>
                  {activity.name}: {user.preferences[activity.id]}
                </div>
              ))}
            </div>
          ))}
        </section>
      </main>

      <footer>
        © 2024 Find Your Activity Buddy
      </footer>
    </div>
  );
}