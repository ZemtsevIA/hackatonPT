// background.js

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'collectCatalogData') {
    // Обработка данных с каталога Stepik
    console.log('Данные получены с каталога Stepik:', message.data);

    message.data.forEach(course => {
      fetch('http://localhost:3000/add_course', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(course)
      })
      .then(response => response.json())
      .then(data => {
        console.log('Ответ от backend:', data);
      })
      .catch(error => {
        console.error('Ошибка при отправке данных:', error);
      });
    });
  } else if (message.action === 'collectCourseData') {
    // Обработка данных с курса на другом сайте
    console.log('Данные получены с курса на другом сайте:', message.data);

    fetch('http://localhost:3000/add_course', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(message.data)
    })
    .then(response => response.json())
    .then(data => {
      console.log('Ответ от backend:', data);
    })
    .catch(error => {
      console.error('Ошибка при отправке данных:', error);
    });
  }
});