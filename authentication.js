// Global authentication handler
window.handleGoogleSignIn = async (response) => {
    console.log('Google Sign-In response received:', response);
    
    try {
        // Decode the JWT token to get user info
        const payload = decodeJWT(response.credential);
        console.log('User authenticated:', payload.name, payload.email);
        
        // Store user info in sessionStorage
        sessionStorage.setItem('userName', payload.name);
        sessionStorage.setItem('userEmail', payload.email);
        sessionStorage.setItem('isAuthenticated', 'true');
        
        // Redirect to dashboard
        window.location.href = 'dashboard.html';
        
    } catch (error) {
        console.error('Authentication error:', error);
        alert('Authentication failed. Please try again.');
    }
};

// Helper function to decode JWT
function decodeJWT(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}

// Check authentication status on page load
function checkAuth() {
    const isAuthenticated = sessionStorage.getItem('isAuthenticated');
    if (isAuthenticated === 'true' && window.location.pathname.endsWith('index.html')) {
        // If already authenticated and on login page, redirect to dashboard
        window.location.href = 'dashboard.html';
    } else if (isAuthenticated !== 'true' && window.location.pathname.endsWith('dashboard.html')) {
        // If not authenticated and on dashboard, redirect to login
        window.location.href = 'index.html';
    }
}

// Logout function
function logout() {
    sessionStorage.clear();
    if (typeof google !== 'undefined' && google.accounts && google.accounts.id) {
        google.accounts.id.disableAutoSelect();
    }
    window.location.href = 'index.html';
}

// Check authentication when page loads
window.addEventListener('load', checkAuth);
