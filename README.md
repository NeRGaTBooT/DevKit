# DevKit

**Клиентский набор инструментов для вёрстки и ежедневной работы разработчика.**

Генераторы CSS с live preview, утилиты для файлов и изображений, библиотека сниппетов — всё работает прямо в браузере, без сервера и без отправки данных куда-либо.

<p align="center">
  <a href="https://NeRGaTBooT.github.io/DevKit/"><strong>Открыть DevKit →</strong></a>
</p>

<p align="center">
  <a href="https://NeRGaTBooT.github.io/DevKit/">GitHub Pages</a> ·
  <a href="https://github.com/NeRGaTBooT/DevKit">Репозиторий</a> ·
  <a href="docs/DEPLOY-GITHUB-PAGES.md">Деплой</a>
</p>

---

## Возможности

| | |
|---|---|
| **100% в браузере** | Файлы не уходят на сервер — PDF, изображения и код обрабатываются локально |
| **Live preview** | Меняете параметры — сразу видите результат и готовый CSS |
| **Share-ссылки** | Состояние инструмента кодируется в URL — можно поделиться настройкой |
| **Палитра поиска** | `Ctrl+K` / `⌘K` — быстрый переход к любому инструменту |
| **Избранное и недавние** | Закрепляйте часто используемые утилиты в сайдбаре |
| **Тёмная тема** | Переключение light / dark, сохраняется в браузере |
| **PWA** | Можно установить как приложение на рабочий стол |

---

## Инструменты

### Генераторы CSS

Визуальные конструкторы с пресетами, копированием кода и предпросмотром.

| Инструмент | Описание |
|---|---|
| [Box Shadow](https://NeRGaTBooT.github.io/DevKit/box-shadow/) | CSS-тени с пресетами |
| [Gradient](https://NeRGaTBooT.github.io/DevKit/gradient/) | Линейные и радиальные градиенты |
| [Flexbox](https://NeRGaTBooT.github.io/DevKit/flexbox/) | Playground для flexbox |
| [Grid](https://NeRGaTBooT.github.io/DevKit/grid/) | Playground для CSS Grid |
| [Border Radius](https://NeRGaTBooT.github.io/DevKit/border-radius/) | Скругления, в том числе эллиптические |
| [Text Shadow](https://NeRGaTBooT.github.io/DevKit/text-shadow/) | Мульти-тени для текста |
| [CSS Filter](https://NeRGaTBooT.github.io/DevKit/css-filter/) | blur, grayscale и другие фильтры |
| [Keyframes](https://NeRGaTBooT.github.io/DevKit/keyframes/) | Генератор `@keyframes` с timeline |
| [Glassmorphism](https://NeRGaTBooT.github.io/DevKit/glassmorphism/) | Эффект матового стекла |

### Утилиты

| Инструмент | Описание |
|---|---|
| [Snippets](https://NeRGaTBooT.github.io/DevKit/snippets/) | Библиотека готовых сниппетов + свои |
| [Color Converter](https://NeRGaTBooT.github.io/DevKit/color-converter/) | HEX ↔ RGB ↔ HSL |
| [File Converter](https://NeRGaTBooT.github.io/DevKit/file-converter/) | PDF ↔ JPG / PNG / WEBP |
| [Image Compressor](https://NeRGaTBooT.github.io/DevKit/image-compressor/) | Сжатие без смены формата |
| [Image Cropper](https://NeRGaTBooT.github.io/DevKit/image-cropper/) | Обрезка с пресетами (avatar, OG и др.) |
| [PDF Merge / Split](https://NeRGaTBooT.github.io/DevKit/pdf-merge-split/) | Объединение и разделение PDF |

---

## Как открыть на GitHub Pages

Сайт уже опубликован. Достаточно перейти по ссылке:

### https://NeRGaTBooT.github.io/DevKit/

Прямые ссылки на популярные инструменты:

```
https://NeRGaTBooT.github.io/DevKit/gradient/
https://NeRGaTBooT.github.io/DevKit/flexbox/
https://NeRGaTBooT.github.io/DevKit/pdf-merge-split/
https://NeRGaTBooT.github.io/DevKit/snippets/
```

> **Важно:** адрес всегда с `/DevKit/` в пути — это project page репозитория. Корень `github.io/` без имени репозитория не откроет сайт.

### Если сайт не открывается

1. Подождите 2–5 минут после последнего деплоя
2. Проверьте вкладку **Actions** в репозитории — workflow **Deploy GitHub Pages** должен быть зелёным
3. Убедитесь, что в **Settings → Pages** источник — **GitHub Actions**

Подробная инструкция по деплою и обновлению: [`docs/DEPLOY-GITHUB-PAGES.md`](docs/DEPLOY-GITHUB-PAGES.md)

---

## Локальная разработка

```bash
# установка зависимостей
pnpm install

# dev-сервер (http://localhost:3000)
pnpm dev

# сборка под GitHub Pages
pnpm build:pages

# локальный preview как на GH Pages (http://localhost:3000/DevKit/)
pnpm preview:pages
```

Если порт 3000 занят dev-сервером:

```bash
# Windows PowerShell
$env:PORT="3457"; pnpm preview:pages
```

---

## Стек

- **Next.js 16** (App Router, static export для GitHub Pages)
- **React 19** + **TypeScript**
- **Tailwind CSS 4** + **shadcn/ui**
- **pdf-lib**, **pdfjs-dist**, **jspdf** — работа с PDF
- Client-side only — без API routes и базы данных

---

## Структура проекта

```
app/           # страницы и layout
components/    # UI и инструменты
lib/           # логика, реестр инструментов, share-state
public/        # иконки, service worker
scripts/       # сборка и preview для GitHub Pages
.github/       # CI/CD workflow
docs/          # документация по деплою
```

---

## Лицензия

Проект в личном использовании. Репозиторий: [github.com/NeRGaTBooT/DevKit](https://github.com/NeRGaTBooT/DevKit).
