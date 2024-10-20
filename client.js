document.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById('app');
    const nav = document.querySelector('nav');

    nav.addEventListener('click', (e) => {
        e.preventDefault();
        if (e.target.tagName === 'A') {
            const page = e.target.id;
            loadPage(page);
        }
    });

    function loadPage(page) {
        switch (page) {
            case 'home':
                showHomePage();
                break;
            case 'profile':
                showProfilePage();
                break;
            case 'matches':
                showMatchesPage();
                break;
            case 'events':
                showEventsPage();
                break;
            case 'logout':
                logout();
                break;
            default:
                showLoginPage();
        }
    }

    function showHomePage() {
        app.innerHTML = `
            <h2>Welcome to BroMatch</h2>
            <p>Find your perfect activity buddy!</p>
        `;
    }

    function showProfilePage() {
        app.innerHTML = `
            <h2>Your Profile</h2>
            <div class="form-group">
                <label for="name">Name:</label>
                <input type="text" id="name" name="name">
            </div>
            <div class="form-group">
                <label for="email">Email:</label>
                <input type="email" id="email" name="email">
            </div>
            <h3>Interests</h3>
            <div id="interests"></div>
            <button id="addInterest">Add Interest</button>
            <button id="saveProfile">Save Profile</button>
        `;

        const interests = ['Fitness', 'Beer', 'Going out', 'Jocko Willink'];
        const interestsContainer = document.getElementById('interests');

        interests.forEach(interest => {
            addInterestSlider(interest);
        });

        document.getElementById('addInterest').addEventListener('click', () => {
            const newInterest = prompt('Enter a new interest:');
            if (newInterest) {
                addInterestSlider(newInterest);
            }
        });

        document.getElementById('saveProfile').addEventListener('click', saveProfile);
    }

    function addInterestSlider(interest) {
        const slider = document.createElement('div');
        slider.classList.add('slider-container');
        slider.innerHTML = `
            <label for="${interest}">${interest}:</label>
            <input type="range" id="${interest}" name="${interest}" min="0" max="10" value="5">
            <span>5</span>
        `;
        interestsContainer.appendChild(slider);

        const input = slider.querySelector('input');
        const span = slider.querySelector('span');
        input.addEventListener('input', () => {
            span.textContent = input.value;
        });
    }

    function saveProfile() {
        // TODO: Implement profile saving logic
        alert('Profile saved!');
    }

    function showMatchesPage() {
        app.innerHTML = `
            <h2>Your Matches</h2>
            <div id="matchesContainer"></div>
        `;

        // TODO: Fetch and display actual matches
        const matches = [
            { name: 'John', interests: ['Fitness', 'Beer'] },
            { name: 'Mike', interests: ['Going out', 'Jocko Willink'] },
        ];

        const matchesContainer = document.getElementById('matchesContainer');
        matches.forEach(match => {
            const matchCard = document.createElement('div');
            matchCard.classList.add('profile-card');
            matchCard.innerHTML = `
                <h3>${match.name}</h3>
                <div class="badges">
                    ${match.interests.map(interest => `<span class="badge">${interest}</span>`).join('')}
                </div>
                <button>Connect</button>
            `;
            matchesContainer.appendChild(matchCard);
        });
    }

    function showEventsPage() {
        app.innerHTML = `
            <h2>Events</h2>
            <div id="eventsContainer"></div>
            <button id="createEvent">Create Event</button>
        `;

        // TODO: Fetch and display actual events
        const events = [
            { name: 'Gym Session', date: '2024-10-25', attendees: 3 },
            { name: 'Beer Tasting', date: '2024-11-01', attendees: 5 },
        ];

        const eventsContainer = document.getElementById('eventsContainer');
        events.forEach(event => {
            const eventCard = document.createElement('div');
            eventCard.classList.add('event-card');
            eventCard.innerHTML = `
                <h3>${event.name}</h3>
                <p>Date: ${event.date}</p>
                <p>Attendees: ${event.attendees}</p>
                <button>Join</button>
            `;
            eventsContainer.appendChild(eventCard);
        });

        document.getElementById('createEvent').addEventListener('click', createEvent);
    }

    function createEvent() {
        // TODO: Implement event creation logic
        alert('Event creation not implemented yet');
    }

    function showLoginPage() {
        app.innerHTML = `
            <h2>Login</h2>
            <div class="form-group">
                <label for="loginEmail">Email:</label>
                <input type="email" id="loginEmail" name="loginEmail">
            </div>
            <div class="form-group">
                <label for="loginPassword">Password:</label>
                <input type="password" id="loginPassword" name="loginPassword">
            </div>
            <button id="loginButton">Login</button>
            <p>Don't have an account? <a href="#" id="showSignup">Sign up</a></p>
        `;

        document.getElementById('loginButton').addEventListener('click', login);
        document.getElementById('showSignup').addEventListener('click', showSignupPage);
    }

    function showSignupPage() {
        app.innerHTML = `
            <h2>Sign Up</h2>
            <div class="form-group">
                <label for="signupName">Name:</label>
                <input type="text" id="signupName" name="signupName">
            </div>
            <div class="form-group">
                <label for="signupEmail">Email:</label>
                <input type="email" id="signupEmail" name="signupEmail">
            </div>
            <div class="form-group">
                <label for="signupPassword">Password:</label>
                <input type="password" id="signupPassword" name="signupPassword">
            </div>
            <button id="signupButton">Sign Up</button>
            <p>Already have an account? <a href="#" id="showLogin">Login</a></p>
        `;

        document.getElementById('signupButton').addEventListener('click', signup);
        document.getElementById('showLogin').addEventListener('click', showLoginPage);
    }

    function login() {
        // TODO: Implement login logic
        alert('Login not implemented yet');
    }

    function signup() {
        // TODO: Implement signup logic
        alert('Signup not implemented yet');
    }

    function logout() {
        // TODO: Implement logout logic
        alert('Logout not implemented yet');
        showLoginPage();
    }

    // Initial page load
    showLoginPage();
});