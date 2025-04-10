document.addEventListener('DOMContentLoaded', () => {
    checkAuthStatus();
    
    // Обработчики форм
    document.getElementById('register-form')?.addEventListener('submit', handleRegister);
    document.getElementById('login-form')?.addEventListener('submit', handleLogin);
    document.getElementById('logout-btn')?.addEventListener('click', handleLogout);
  });
  
  async function checkAuthStatus() {
    try {
      const response = await fetch('/profile', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        showAuthenticatedUI(data.username);
      } else {
        showUnauthenticatedUI();
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      showUnauthenticatedUI();
    }
  }
  
  async function handleRegister(e) {
    e.preventDefault();
    const username = document.getElementById('reg-username').value;
    const password = document.getElementById('reg-password').value;
    
    try {
      const response = await fetch('/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include'
      });
      
      if (response.ok) {
        alert('Регистрация успешна! Теперь вы можете войти.');
        document.getElementById('reg-username').value = '';
        document.getElementById('reg-password').value = '';
      } else {
        const error = await response.json();
        alert(`Ошибка регистрации: ${error.error}`);
      }
    } catch (error) {
      alert('Ошибка сети при регистрации');
    }
  }
  
  async function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    
    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        showAuthenticatedUI(username);
      } else {
        const error = await response.json();
        alert(`Ошибка входа: ${error.error}`);
      }
    } catch (error) {
      alert('Ошибка сети при входе');
    }
  }
  
  async function handleLogout() {
    try {
      const response = await fetch('/logout', {
        method: 'POST',
        credentials: 'include'
      });
      
      if (response.ok) {
        showUnauthenticatedUI();
        window.location.href = '/';
      } else {
        alert('Ошибка при выходе из системы');
      }
    } catch (error) {
      alert('Ошибка сети при выходе');
    }
  }
  
  function showAuthenticatedUI(username) {
    const authForms = document.getElementById('auth-forms');
    const profileContent = document.getElementById('profile-content');
    const profileInfo = document.getElementById('profile-info');
    
    if (authForms) authForms.style.display = 'none';
    if (profileContent) profileContent.style.display = 'block';
    if (profileInfo) profileInfo.textContent = `Вы вошли как: ${username}`;
  }
  
  function showUnauthenticatedUI() {
    const authForms = document.getElementById('auth-forms');
    const profileContent = document.getElementById('profile-content');
    
    if (authForms) authForms.style.display = 'block';
    if (profileContent) profileContent.style.display = 'none';
  }