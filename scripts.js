const usersData = JSON.parse(localStorage.getItem('usersData')) || [];
const adminUsername = 'admin';
const adminPassword = 'admin123';
const currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

function saveUserData() {
    localStorage.setItem('usersData', JSON.stringify(usersData));
}

function saveCurrentUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
}

// Load notes for the current user
function loadUserNotes() {
    const notesContainer = document.getElementById('notesContainer');
    if (currentUser) {
        const userNotes = currentUser.notes || [];
        if (userNotes.length === 0) {
            notesContainer.innerHTML = '<p>No notes saved yet.</p>';
        } else {
            userNotes.forEach((note, index) => {
                const noteItem = document.createElement('div');
                noteItem.className = 'note-item';
                noteItem.innerHTML = `
                    <h5>${note.title}</h5>
                    <p>${note.content}</p>
                    <button class="btn btn-danger" onclick="deleteNote(${index})">Delete</button>
                `;
                notesContainer.appendChild(noteItem);
            });
        }
    }
}

// Delete user notes
function deleteNote(index) {
    currentUser.notes.splice(index, 1);
    saveCurrentUser(currentUser);
    loadUserNotes();
}

// Login handler
document.getElementById('loginForm')?.addEventListener('submit', function (event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === adminUsername && password === adminPassword) {
        // Admin login
        window.location.href = 'admin-dashboard.html';
    } else {
        // Regular user login
        const user = usersData.find(user => user.username === username && user.password === password);
        if (user) {
            saveCurrentUser(user);
            window.location.href = 'notes.html';
        } else {
            alert('Invalid credentials!');
        }
    }
});

// Sign up handler
document.getElementById('signupForm')?.addEventListener('submit', function (event) {
    event.preventDefault();

    const username = document.getElementById('newUsername').value;
    const password = document.getElementById('newPassword').value;

    if (usersData.find(user => user.username === username)) {
        alert('Username already exists!');
    } else {
        const newUser = {
            username,
            password,
            notes: [] // Each user has their own notes
        };
        usersData.push(newUser);
        saveUserData();
        saveCurrentUser(newUser);
        window.location.href = 'notes.html';
    }
});

// Initialize user data
if (currentUser) {
    loadUserNotes();
}
