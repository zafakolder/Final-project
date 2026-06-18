// src/scripts/components/card.js

// Функция создания карточки
// Принимает:
// - cardData: объект карточки с сервера
// - userId: идентификатор текущего пользователя
// - onLikeClick: функция-колбэк, которая принимает (cardId, isLiked) и возвращает Promise с обновлённой карточкой
// - onDeleteClick: колбэк для удаления, принимает (cardId, cardElement)
// - onInfoClick: колбэк для открытия статистики, принимает cardId
// - onImageClick: колбэк для открытия попапа с изображением, принимает (link, name)
export function createCard(
  cardData,
  userId,
  onLikeClick,
  onDeleteClick,
  onInfoClick,
  onImageClick
) {
  // Клонируем шаблон
  const cardTemplate = document.querySelector('#card-template');
  const cardElement = cardTemplate.content.querySelector('.card').cloneNode(true);

  // Находим элементы внутри карточки
  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const likeButton = cardElement.querySelector('.card__like-button');
  const likeCount = cardElement.querySelector('.card__like-count');
  const deleteButton = cardElement.querySelector('.card__delete-button');
  const infoButton = cardElement.querySelector('.card__control-button_type_info');

  // Заполняем данными
  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;

  // Устанавливаем начальное состояние лайка и счётчик
  const isLiked = cardData.likes.some(user => user._id === userId);
  if (isLiked) {
    likeButton.classList.add('card__like-button_is-active');
  }
  likeCount.textContent = cardData.likes.length;

  // Управление кнопкой удаления (показываем только для своих карточек)
  if (cardData.owner._id === userId) {
    deleteButton.style.display = 'block'; // или убираем display: none
  } else {
    deleteButton.remove(); // полностью удаляем из DOM
  }

  // ---- Обработчик лайка ----
  likeButton.addEventListener('click', () => {
    // Определяем текущее состояние (лайкнут или нет)
    const isCurrentlyLiked = likeButton.classList.contains('card__like-button_is-active');
    // Вызываем колбэк, который возвращает промис с обновлённой карточкой
    onLikeClick(cardData._id, isCurrentlyLiked)
      .then(updatedCard => {
        // Обновляем UI на основе ответа сервера
        const isLikedNow = updatedCard.likes.some(user => user._id === userId);
        likeButton.classList.toggle('card__like-button_is-active', isLikedNow);
        likeCount.textContent = updatedCard.likes.length;
      })
      .catch(err => console.log(err));
  });

  // ---- Обработчик удаления ----
  deleteButton.addEventListener('click', () => {
    onDeleteClick(cardData._id, cardElement);
  });

  // ---- Обработчик информации ----
  if (infoButton) {
    infoButton.addEventListener('click', () => {
      onInfoClick(cardData._id);
    });
  }

  // ---- Обработчик клика по изображению ----
  cardImage.addEventListener('click', () => {
    onImageClick(cardData.link, cardData.name);
  });

  return cardElement;
}