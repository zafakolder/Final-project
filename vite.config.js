import { defineConfig } from 'vite';

export default defineConfig({
  base: './', // относительные пути для ресурсов
  server: {
    open: true, // автоматически открывать браузер при запуске dev-сервера
  },
});