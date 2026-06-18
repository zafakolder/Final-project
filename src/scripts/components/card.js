// src/scripts/components/card.js

// Функция создания карточки
export function createCard(
  cardData,
  userId,
  handleLike,
  handleDelete,
  handleInfoClick,
  handleImageClick
) {
  const cardTemplate = document.querySelector('#card-template');
  const cardElement = cardTemplate.content.querySelector('.card').cloneNode(true);

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
  likeCount.textContent = cardData.likes.length;

  // Проверяем, лайкнул ли текущий пользователь
  const isLiked = cardData.likes.some((user) => user._id === userId);
  if (isLiked) {
    likeButton.classList.add('card__like-button_is-active');
  }

  // Управление кнопкой удаления
  if (cardData.owner._id === userId) {
    deleteButton.style.display = 'block'; // или убираем скрытие
  } else {
    deleteButton.remove(); // полностью удаляем из DOM
  }

  // Обработчики событий
  likeButton.addEventListener('click', (evt) => {
    handleLike(cardData._id, likeButton, likeCount);
  });

  deleteButton.addEventListener('click', () => {
    handleDelete(cardData._id, cardElement);
  });

  infoButton.addEventListener('click', () => {
    handleInfoClick(cardData._id);
  });

  cardImage.addEventListener('click', () => {
    handleImageClick(cardData.link, cardData.name);
  });

  return cardElement;
}

// Функция обновления состояния лайка (вызывается из index.js после ответа сервера)
export function updateLikeState(likeButton, likeCount, cardData) {
  const isLiked = cardData.likes.some((user) => user._id === userId); // userId нужно передавать или хранить глобально
  // Но лучше передавать userId в updateLikeState или хранить в замыкании.
  // В нашем случае мы будем передавать isLiked из index.js
}