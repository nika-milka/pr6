document.addEventListener('DOMContentLoaded', () => {
    // Восстановление темы из localStorage
    const savedTheme = localStorage.getItem('theme') || 'light-theme';
    document.body.className = savedTheme;
    
    // Обработчик кнопки переключения темы
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', toggleTheme);
    }
  });
  
  function toggleTheme() {
    const currentTheme = document.body.className;
    const newTheme = currentTheme === 'light-theme' ? 'dark-theme' : 'light-theme';
    
    document.body.className = newTheme;
    localStorage.setItem('theme', newTheme);
  }