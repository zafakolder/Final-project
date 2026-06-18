// src/scripts/components/validation.js

export function enableValidation(config) {
  const forms = document.querySelectorAll(config.formSelector);
  forms.forEach((form) => {
    setEventListeners(form, config);
  });
}

export function clearValidation(form, config) {
  const inputs = form.querySelectorAll(config.inputSelector);
  const button = form.querySelector(config.submitButtonSelector);
  inputs.forEach((input) => {
    hideInputError(form, input, config);
  });
  disableSubmitButton(button, config);
}

function setEventListeners(form, config) {
  const inputs = form.querySelectorAll(config.inputSelector);
  const button = form.querySelector(config.submitButtonSelector);
  toggleButtonState(inputs, button, config);
  inputs.forEach((input) => {
    input.addEventListener('input', () => {
      checkInputValidity(form, input, config);
      toggleButtonState(inputs, button, config);
    });
  });
}

function checkInputValidity(form, input, config) {
  if (input.validity.valid) {
    hideInputError(form, input, config);
  } else {
    showInputError(form, input, input.validationMessage, config);
  }

  // Кастомное сообщение для полей с pattern
  if (input.type === 'text' && input.hasAttribute('pattern')) {
    if (!input.validity.patternMismatch) return;
    const errorElement = form.querySelector(`.${input.id}-error`);
    if (errorElement) {
      errorElement.textContent = 'Разрешены только латинские, кириллические буквы, дефис и пробелы';
    }
  }
}

function showInputError(form, input, errorMessage, config) {
  const errorElement = form.querySelector(`.${input.id}-error`);
  if (errorElement) {
    input.classList.add(config.inputErrorClass);
    errorElement.textContent = errorMessage;
    errorElement.classList.add(config.errorClass);
  }
}

function hideInputError(form, input, config) {
  const errorElement = form.querySelector(`.${input.id}-error`);
  if (errorElement) {
    input.classList.remove(config.inputErrorClass);
    errorElement.textContent = '';
    errorElement.classList.remove(config.errorClass);
  }
}

function hasInvalidInput(inputs) {
  // Превращаем NodeList в массив, чтобы использовать .some()
  return Array.from(inputs).some((input) => !input.validity.valid);
}

function toggleButtonState(inputs, button, config) {
  if (hasInvalidInput(inputs)) {
    disableSubmitButton(button, config);
  } else {
    enableSubmitButton(button, config);
  }
}

function disableSubmitButton(button, config) {
  button.classList.add(config.inactiveButtonClass);
  button.disabled = true;
}

function enableSubmitButton(button, config) {
  button.classList.remove(config.inactiveButtonClass);
  button.disabled = false;
}