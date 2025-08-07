// Data for the courses
const courses = [
    { id: 1, title: 'Introduction to Programming', logo: '💻', ytLink: 'https://www.youtube.com/embed/n4D37-B3L_4' },
    { id: 2, title: 'Data Structures and Algorithms', logo: '🧠', ytLink: 'https://www.youtube.com/embed/g8f0B8a5L0w' },
    { id: 3, title: 'Web Development Basics', logo: '🌐', ytLink: 'https://www.youtube.com/embed/Q33KBiD_c3Q' },
    { id: 4, title: 'Database Management Systems', logo: '💾', ytLink: 'https://www.youtube.com/embed/C-kS-l4yO2s' },
    { id: 5, title: 'Operating Systems', logo: '⚙️', ytLink: 'https://www.youtube.com/embed/vLdE5g9sJpY' },
    { id: 6, title: 'Computer Networks', logo: '🔗', ytLink: 'https://www.youtube.com/embed/v91_g5uM0G4' },
];

// Get elements from the DOM
const appContainer = document.getElementById('app-container');
const loginPage = document.getElementById('login-page');
const dashboardPage = document.getElementById('dashboard-page');
const courseDetailPage = document.getElementById('course-detail-page');

const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password'); // New password input
const loginButton = document.getElementById('login-button');
const logoutButton = document.getElementById('logout-button');
const userNameDisplay = document.getElementById('user-name-display');
const courseCardsContainer = document.getElementById('course-cards');
const backButton = document.getElementById('back-button');

const courseTitle = document.getElementById('course-title');
const youtubeLink = document.getElementById('youtube-link');
const commentsList = document.getElementById('comments-list');
const commentForm = document.getElementById('comment-form');
const commentInput = document.getElementById('comment-input');

let currentUser = null;
let currentCourseId = null;

// Function to render the correct page based on login status
function renderPage() {
    currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        loginPage.classList.add('hidden');
        dashboardPage.classList.remove('hidden');
        userNameDisplay.textContent = currentUser;
        renderCourseCards();
    } else {
        loginPage.classList.remove('hidden');
        dashboardPage.classList.add('hidden');
        courseDetailPage.classList.add('hidden');
    }
}

// Function to render the course cards on the dashboard
function renderCourseCards() {
    courseCardsContainer.innerHTML = '';
    courses.forEach(course => {
        const card = document.createElement('div');
        card.classList.add('card', 'p-6', 'bg-gray-50', 'rounded-xl', 'shadow-md', 'flex', 'flex-col', 'items-center', 'text-center', 'cursor-pointer', 'border', 'border-gray-200');
        card.innerHTML = `
            <div class="text-5xl mb-4">${course.logo}</div>
            <h3 class="text-xl font-bold text-gray-800">${course.title}</h3>
        `;
        card.addEventListener('click', () => {
            showCourseDetail(course.id);
        });
        courseCardsContainer.appendChild(card);
    });
}

// Function to show the course detail page
function showCourseDetail(id) {
    currentCourseId = id;
    dashboardPage.classList.add('hidden');
    courseDetailPage.classList.remove('hidden');
    
    const course = courses.find(c => c.id === id);
    courseTitle.textContent = course.title;
    youtubeLink.innerHTML = `<iframe class="w-full h-full" src="${course.ytLink}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    
    renderComments();
}

// Function to render comments for the current course
function renderComments() {
    commentsList.innerHTML = '';
    const comments = JSON.parse(localStorage.getItem(`course_${currentCourseId}_comments`)) || [];
    
    if (comments.length === 0) {
        commentsList.innerHTML = '<p class="text-gray-500 italic">No comments yet. Be the first!</p>';
    } else {
        comments.forEach(comment => {
            const commentDiv = document.createElement('div');
            commentDiv.classList.add('p-4', 'bg-gray-100', 'rounded-lg');
            commentDiv.innerHTML = `
                <p class="font-semibold text-indigo-600">${comment.author}</p>
                <p class="text-gray-800">${comment.text}</p>
            `;
            commentsList.appendChild(commentDiv);
        });
    }
}

// Login
loginButton.addEventListener('click', () => {
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    
    if (username === 'user' && password === 'pass') {
        localStorage.setItem('currentUser', username);
        renderPage();
    } else {
        alert('Invalid username or password.');
    }
});

// Logout
logoutButton.addEventListener('click', () => {
    localStorage.removeItem('currentUser');
    renderPage();
});

// Back button
backButton.addEventListener('click', () => {
    courseDetailPage.classList.add('hidden');
    dashboardPage.classList.remove('hidden');
    currentCourseId = null;
});

// Comment submit
commentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const commentText = commentInput.value.trim();
    if (commentText) {
        const commentsKey = `course_${currentCourseId}_comments`;
        const comments = JSON.parse(localStorage.getItem(commentsKey)) || [];
        
        const newComment = {
            author: currentUser,
            text: commentText,
            timestamp: new Date().toISOString()
        };
        
        comments.push(newComment);
        localStorage.setItem(commentsKey, JSON.stringify(comments));
        
        commentInput.value = '';
        renderComments();
    }
});

// Initial render
document.addEventListener('DOMContentLoaded', renderPage);
