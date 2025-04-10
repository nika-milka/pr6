document.addEventListener('DOMContentLoaded', () => {
    const refreshBtn = document.getElementById('refresh-data');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', fetchData);
      fetchData(); // Загрузить данные при открытии страницы
    }
  });
  
  async function fetchData() {
    try {
      const response = await fetch('/data', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        displayData(data);
      } else {
        throw new Error('Ошибка загрузки данных');
      }
    } catch (error) {
      console.error('Ошибка:', error);
      document.getElementById('data-info').textContent = 'Ошибка загрузки данных';
    }
  }
  
  function displayData(data) {
    const dataInfo = document.getElementById('data-info');
    const cacheInfo = document.getElementById('cache-info');
    
    if (dataInfo) {
      dataInfo.innerHTML = `
        <h3>Данные:</h3>
        <ul>
          ${data.data.items.map(item => `
            <li>${item.name}: ${item.value.toFixed(4)}</li>
          `).join('')}
        </ul>
        <p>Обновлено: ${new Date(data.data.updatedAt).toLocaleString()}</p>
      `;
    }
    
    if (cacheInfo) {
      cacheInfo.textContent = data.cached 
        ? `Данные из кэша (актуальны на ${new Date(data.timestamp).toLocaleString()})`
        : 'Данные только что сгенерированы';
    }
  }