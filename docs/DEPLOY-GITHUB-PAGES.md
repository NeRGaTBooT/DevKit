# Деплой DevKit на GitHub Pages

Статический экспорт Next.js 16 для project page: `https://USERNAME.github.io/DevKit/`.

## Предусловия

- Аккаунт GitHub
- Git установлен локально
- Репозиторий `DevKit` (public или private с GitHub Pro для Pages на private)

## Шаг 1. Подготовить репозиторий

```bash
cd c:\Users\Oleg\Desktop\WORK\DevKit
git init          # если ещё не git-репозиторий
git add .
git commit -m "Prepare DevKit for GitHub Pages"
```

Создать репозиторий на GitHub: **New repository** → имя `DevKit` → Public.

```bash
git remote add origin https://github.com/USERNAME/DevKit.git
git branch -M main
git push -u origin main
```

Замените `USERNAME` на свой логин.

## Шаг 2. Включить GitHub Pages

1. GitHub → репозиторий `DevKit` → **Settings** → **Pages**
2. **Build and deployment** → Source: **GitHub Actions**
3. Сохранить (деплой запустится после push workflow-файла)

## Шаг 3. Запушить код с workflow

```bash
git add .
git commit -m "Add GitHub Pages static export and deploy workflow"
git push
```

## Шаг 4. Дождаться деплоя

1. Вкладка **Actions** → workflow **Deploy GitHub Pages**
2. Зелёная галочка = успех
3. **Settings → Pages** покажет URL: `https://USERNAME.github.io/DevKit/`

Первый деплой — 2–5 минут.

## Шаг 5. Проверить сайт

| URL | Ожидание |
| --- | --- |
| `https://USERNAME.github.io/DevKit/` | главная, редирект на первый инструмент |
| `https://USERNAME.github.io/DevKit/pdf-merge-split/` | PDF Merge / Split |
| `https://USERNAME.github.io/DevKit/manifest.webmanifest` | JSON manifest |

Если CSS/JS не грузятся — почти всегда проблема с `basePath` (должен быть `/DevKit`, совпадающий с именем репозитория).

## Шаг 6. Обновления сайта

Каждый `git push` в `main` → автоматический rebuild и деплой.

Ручной деплой: **Actions** → **Deploy GitHub Pages** → **Run workflow**.

## Шаг 7. Локальная проверка перед push

```bash
pnpm build:pages
pnpm preview:pages
```

Открыть `http://localhost:3000/DevKit/` (не корень `/`). Скрипт `preview:pages` кладёт `out/` в `.pages-preview/DevKit/`, как на GitHub Pages.

Чеклист smoke-test:

- главная и навигация между инструментами
- `/DevKit/pdf-merge-split/` — PDF preview + merge
- share URL у gradient/flexbox (содержит `/DevKit/...`)
- иконки и manifest в DevTools → Application

## Частые проблемы

| Симптом | Причина | Решение |
| --- | --- | --- |
| Белая страница, 404 на `_next/` | нет `.nojekyll` | скрипт `prepare-gh-pages.mjs` |
| Стили не грузятся | неверный `basePath` | имя репозитория = `DevKit` → `basePath: "/DevKit"` |
| Share-ссылки без `/DevKit` | `buildShareUrl` | патч `lib/share-state.ts` |
| Build падает на `redirects` | несовместимо с `output: export` | redirects отключены при static export |
| PWA не кэширует | `sw.js` с путями `/` | патч `BASE_PATH` в build-скрипте |
| `pnpm approve-builds` warning | canvas/core-js | на GH Actions обычно не блокирует build |

## Что не поддерживается

- Кастомный домен — отдельная настройка DNS + GitHub Settings
- Private repo без Pro — Pages может быть недоступен
- Серверные фичи Next.js (API, SSR, middleware) — не поддерживаются на GH Pages

## Альтернатива

GitHub Pages для Next.js — рабочий, но хрупкий вариант из-за `basePath` и PWA. Если позже понадобится проще — **Vercel** деплоит этот проект без `output: export` и без патчей SW.
