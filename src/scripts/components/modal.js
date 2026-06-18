// src/scripts/components/modal.js

export function openModal(popup) {
  popup.classList.add('popup_is-opened');
  document.addEventListener('keydown', handleEscape);
}

export function closeModal(popup) {
  popup.classList.remove('popup_is-opened');
  document.removeEventListener('keydown', handleEscape);
}

function handleEscape(evt) {
  if (evt.key === 'Escape') {
    const openedPopup = document.querySelector('.popup_is-opened');
    if (openedPopup) {
      closeModal(openedPopup);
    }
  }
}

// Настройка закрытия по клику на оверлей
export function setupModalOverlayClicks() {
  document.addEventListener('click', (evt) => {
    if (evt.target.classList.contains('popup')) {
      closeModal(evt.target);
    }
  });
}