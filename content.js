// Функция для сбора данных о курсах из каталога Stepik
function collectCatalogData() {
  const courses = [];
  document.querySelectorAll('div.course-cards__item').forEach(card => {
    const title = card.querySelector('a.course-card__title')?.innerText.trim() || 'Нет названия';
    const description = card.querySelector('div.course-card__description')?.innerText.trim() || 'Нет описания';
    const price = card.querySelector('div.course-card__price')?.innerText.trim() || 'Бесплатно';
    const rating = card.querySelector('div.course-card__rating')?.innerText.trim() || 'Нет рейтинга';
    const reviews = card.querySelector('div.course-card__reviews')?.innerText.trim() || 'Нет отзывов';
    const level = card.querySelector('div.course-card__level')?.innerText.trim() || 'Неизвестно';

    courses.push({
      title,
      description,
      price,
      rating,
      reviews,
      level
    });
  });

  console.log('Собранные данные с каталога Stepik:', courses); // Отладочное сообщение
  return courses;
}

// Функция для сбора данных о курсе на другом сайте
function collectCourseData() {
  const courseTitle = document.querySelector('h1')?.innerText.trim() || 'Нет названия';
  const courseDescription = document.querySelector('meta[name="description"]')?.content || 'Нет описания';
  const coursePrice = document.querySelector('.price')?.innerText.trim() || 'Бесплатно';
  const ratingStars = document.querySelector('.rating')?.innerText.trim() || 'Нет рейтинга';
  const reviewsCount = document.querySelector('.reviews')?.innerText.trim() || 'Нет отзывов';
  const courseLevel = document.querySelector('.level')?.innerText.trim() || 'Неизвестно';

  return {
    title: courseTitle,
    description: courseDescription,
    price: coursePrice,
    rating: ratingStars,
    reviews: reviewsCount,
    level: courseLevel
  };
}

// Функция для ожидания появления элемента
function waitForElement(selector, callback) {
  const observer = new MutationObserver((mutations, obs) => {
    const element = document.querySelector(selector);
    if (element) {
      obs.disconnect(); // Останавливаем наблюдение
      callback(element);
    }
  });

  observer.observe(document, {
    childList: true,
    subtree: true
  });
}

// Проверяем, на каком сайте мы находимся
if (window.location.href.includes('stepik.org/catalog/')) {
  // Если это каталог Stepik, ждём 3 секунды и собираем данные
  setTimeout(() => {
    waitForElement('div.course-cards__item', () => {
      const catalogData = collectCatalogData();
      chrome.runtime.sendMessage({ action: 'collectCatalogData', data: catalogData });
    });
  }, 3000); // Задержка 3 секунды
} else if (window.location.href.includes('/course/')) {
  // Если это страница курса на другом сайте, собираем данные
  const courseData = collectCourseData();
  chrome.runtime.sendMessage({ action: 'collectCourseData', data: courseData });
}