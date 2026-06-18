// src/scripts/index.js

// ========== Импорт стилей ==========
import '../styles/index.css';

// ========== Импорт модулей ==========
import {
  getUserInfo,
  getCardList,
  setUserInfo,
  setUserAvatar,
  addCard,
  deleteCard,
  changeLikeCardStatus,
} from './components/api.js';

import { createCard } from './components/card.js';
import { openModal, closeModal, setupModalOverlayClicks } from './components/modal.js';
import { enableValidation, clearValidation } from './components/validation.js';

// ========== Настройка валидации ==========
const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__input-error_active',
};

// Включаем валидацию для всех форм
enableValidation(validationConfig);

// Настраиваем закрытие попапов по клику на оверлей
setupModalOverlayClicks();

// ========== DOM-элементы ==========
const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
const profileAvatar = document.querySelector('.profile__avatar');

const cardsContainer = document.querySelector('.places');

// Попапы
const editProfilePopup = document.querySelector('#edit-profile-popup');
const addCardPopup = document.querySelector('#add-card-popup');
const avatarPopup = document.querySelector('#avatar-popup');
const imagePopup = document.querySelector('#image-popup');
const deletePopup = document.querySelector('#delete-popup');
const infoPopup = document.querySelector('#info-popup');

// Формы
const editProfileForm = document.forms['edit-profile'];
const addCardForm = document.forms['new-place'];
const avatarForm = document.forms['avatar'];
const deleteForm = document.forms['remove-card'];

// Поля форм
const nameInput = editProfileForm.elements.name;
const jobInput = editProfileForm.elements.description;
const avatarInput = avatarForm.elements.avatar;
const cardNameInput = addCardForm.elements['place-name'];
const cardLinkInput = addCardForm.elements.link;

// Элементы для информации о карточке
const infoList = document.querySelector('.popup-info__list');
const infoUserList = document.querySelector('.popup-info__users-list');
const infoTitle = document.querySelector('.popup__title', infoPopup);
const infoDefinitionTemplate = document.querySelector('#popup-info-definition-template');
const infoUserPreviewTemplate = document.querySelector('#popup-info-user-preview-template');

// Элементы для просмотра изображения
const popupImage = document.querySelector('.popup__image');
const popupCaption = document.querySelector('.popup__caption');

// ========== Переменные состояния ==========
let currentUserId = null;
let currentCardIdForDelete = null;
let currentCardElementForDelete = null;

// ========== Вспомогательные функции ==========
// Форматирование даты
function formatDate(date) {
  return date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// Создание строки статистики
function createInfoString(key, value) {
  const template = infoDefinitionTemplate.content.cloneNode(true);
  const dt = template.querySelector('.popup-info__definition-term');
  const dd = template.querySelector('.popup-info__definition-description');
  dt.textContent = key;
  dd.textContent = value;
  return template;
}

// Создание превью пользователя


// Отрисовка карточки
function renderCard(cardData, userId) {
  const cardElement = createCard(
    cardData,
    userId,
    handleLike,
    handleDelete,
    handleInfoClick,
    handleImageClick
  );
  cardsContainer.prepend(cardElement); // новые карточки добавляем в начало
}

// ========== Обработчики событий ==========

// Лайк
function handleLike(cardId, likeButton, likeCount) {
  const isLiked = likeButton.classList.contains('card__like-button_is-active');
  changeLikeCardStatus(cardId, !isLiked)
    .then((updatedCard) => {
      likeButton.classList.toggle('card__like-button_is-active');
      likeCount.textContent = updatedCard.likes.length;
    })
    .catch((err) => console.log(err));
}

// Удаление (вызов попапа подтверждения)
function handleDelete(cardId, cardElement) {
  currentCardIdForDelete = cardId;
  currentCardElementForDelete = cardElement;
  openModal(deletePopup);
}

// Обработчик подтверждения удаления
deleteForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  const submitButton = deleteForm.querySelector('.popup__button');
  const originalText = submitButton.textContent;
  submitButton.textContent = 'Удаление...';
  submitButton.disabled = true;

  deleteCard(currentCardIdForDelete)
    .then(() => {
      if (currentCardElementForDelete) {
        currentCardElementForDelete.remove();
        currentCardElementForDelete = null;
      }
      closeModal(deletePopup);
    })
    .catch((err) => console.log(err))
    .finally(() => {
      submitButton.textContent = originalText;
      submitButton.disabled = false;
    });
});

// Информация о карточке (дополнительное задание)
function handleInfoClick(cardId) {
  getCardList()
    .then((cards) => {
      const cardData = cards.find((c) => c._id === cardId);
      if (!cardData) throw new Error('Карточка не найдена');

      // Очищаем контейнеры
      infoList.innerHTML = '';
      infoUserList.innerHTML = '';

      // Заголовок
      infoTitle.textContent = `Статистика карточки «${cardData.name}»`;

	infoList.append(createInfoString('Описание:', cardData.name));	

      // Информация: дата, количество лайков, автор
      const createdDate = formatDate(new Date(cardData.createdAt));
      infoList.append(createInfoString('Дата создания:', createdDate));
      infoList.append(createInfoString('Количество лайков:', cardData.likes.length));
      infoList.append(createInfoString('Автор:', cardData.owner.name));

      // Список пользователей, лайкнувших карточку
if (cardData.likes.length === 0) {
  const emptyMessage = document.createElement('p');
  emptyMessage.textContent = 'Пока никто не лайкнул';
  emptyMessage.className = 'popup-info__empty-message';
  infoUserList.append(emptyMessage);
} else {
  cardData.likes.forEach((user) => {
    const userItem = document.createElement('span');
    userItem.className = 'popup-info__user-item';
    userItem.textContent = user.name;
    infoUserList.append(userItem);
  });
      }

      openModal(infoPopup);
    })
    .catch((err) => console.log(err));
}

// Открытие изображения
function handleImageClick(link, name) {
  popupImage.src = link;
  popupImage.alt = name;
  popupCaption.textContent = name;
  openModal(imagePopup);
}

// ========== Обработчики отправки форм ==========

// Редактирование профиля
editProfileForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  const submitButton = editProfileForm.querySelector('.popup__button');
  const originalText = submitButton.textContent;
  submitButton.textContent = 'Сохранение...';
  submitButton.disabled = true;

  const name = nameInput.value;
  const about = jobInput.value;

  setUserInfo({ name, about })
    .then((userData) => {
      profileTitle.textContent = userData.name;
      profileDescription.textContent = userData.about;
      closeModal(editProfilePopup);
    })
    .catch((err) => console.log(err))
    .finally(() => {
      submitButton.textContent = originalText;
      submitButton.disabled = false;
    });
});

// Обновление аватара
avatarForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  const submitButton = avatarForm.querySelector('.popup__button');
  const originalText = submitButton.textContent;
  submitButton.textContent = 'Сохранение...';
  submitButton.disabled = true;

  const avatarUrl = avatarInput.value;

  setUserAvatar(avatarUrl)
    .then((userData) => {
      profileAvatar.src = userData.avatar;
      closeModal(avatarPopup);
      avatarForm.reset();
    })
    .catch((err) => console.log(err))
    .finally(() => {
      submitButton.textContent = originalText;
      submitButton.disabled = false;
    });
});

// Добавление карточки
addCardForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  const submitButton = addCardForm.querySelector('.popup__button');
  const originalText = submitButton.textContent;
  submitButton.textContent = 'Создание...';
  submitButton.disabled = true;

  const name = cardNameInput.value;
  const link = cardLinkInput.value;

  addCard({ name, link })
    .then((newCard) => {
      renderCard(newCard, currentUserId);
      closeModal(addCardPopup);
      addCardForm.reset();
    })
    .catch((err) => console.log(err))
    .finally(() => {
      submitButton.textContent = originalText;
      submitButton.disabled = false;
    });
});

// ========== Открытие попапов с очисткой валидации ==========

// Редактирование профиля
document.querySelector('.profile__edit-button').addEventListener('click', () => {
  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDescription.textContent;
  clearValidation(editProfileForm, validationConfig);
  openModal(editProfilePopup);
});

// Добавление карточки
document.querySelector('.profile__add-button').addEventListener('click', () => {
  addCardForm.reset();
  clearValidation(addCardForm, validationConfig);
  openModal(addCardPopup);
});

// Обновление аватара (клик по аватару)
profileAvatar.addEventListener('click', () => {
   if (avatarPopup && avatarForm && typeof openModal === 'function' && typeof clearValidation === 'function') {
    avatarForm.reset();
    clearValidation(avatarForm, validationConfig);
    openModal(avatarPopup);
  } else {
    console.error('Одна из переменных не определена!');
  }
});
// Закрытие по клику на крестик
document.querySelectorAll('.popup__close').forEach((button) => {
  button.addEventListener('click', () => {
    const popup = button.closest('.popup');
    if (popup) closeModal(popup);
  });
});
// ========== Инициализация приложения ==========
Promise.all([getCardList(), getUserInfo()])
  .then(([cards, userData]) => {
    currentUserId = userData._id;

    // Заполняем профиль
    profileTitle.textContent = userData.name;
    profileDescription.textContent = userData.about;
    profileAvatar.src = userData.avatar;

    // Рендерим карточки (в обратном порядке, чтобы новые были сверху)
    cards.reverse().forEach((card) => renderCard(card, currentUserId));
  })
  .catch((err) => console.log(err));