import type { SnippetCategory, SnippetItem } from "./types";

export type { SnippetCategory, SnippetItem };

export const snippetCategories: SnippetCategory[] = [
  { id: "all", label: "Все" },
  { id: "react", label: "React" },
  { id: "typescript", label: "TypeScript" },
  { id: "css", label: "CSS" },
  { id: "html", label: "HTML" },
  { id: "nextjs", label: "Next.js" },
  { id: "git", label: "Git / Shell" },
];

export const snippets: SnippetItem[] = [
  {
    id: "react-use-state",
    category: "react",
    title: "useState с типом",
    description: "Базовый state hook с явной типизацией.",
    language: "typescript",
    tags: ["hooks", "state"],
    code: `const [value, setValue] = useState<string>("");

const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
  setValue(event.target.value);
};`,
  },
  {
    id: "react-use-effect-cleanup",
    category: "react",
    title: "useEffect с cleanup",
    description: "Подписка с отпиской при размонтировании.",
    language: "typescript",
    tags: ["hooks", "effect", "cleanup"],
    code: `useEffect(() => {
  const controller = new AbortController();

  async function load() {
    const response = await fetch("/api/data", {
      signal: controller.signal,
    });
    const data = await response.json();
    setData(data);
  }

  load();

  return () => controller.abort();
}, []);`,
  },
  {
    id: "react-use-callback",
    category: "react",
    title: "useCallback",
    description: "Мемоизация колбэка для дочерних компонентов.",
    language: "typescript",
    tags: ["hooks", "memo"],
    code: `const handleSubmit = useCallback((event: FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  onSubmit(formData);
}, [formData, onSubmit]);`,
  },
  {
    id: "react-use-memo",
    category: "react",
    title: "useMemo",
    description: "Мемоизация вычисляемого значения.",
    language: "typescript",
    tags: ["hooks", "memo"],
    code: `const filteredItems = useMemo(
  () => items.filter((item) => item.active),
  [items],
);`,
  },
  {
    id: "react-custom-hook",
    category: "react",
    title: "Шаблон custom hook",
    description: "Базовая структура пользовательского хука.",
    language: "typescript",
    tags: ["hooks", "pattern"],
    code: `function useDebounce<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(timeout);
  }, [value, delay]);

  return debounced;
}`,
  },
  {
    id: "ts-interface",
    category: "typescript",
    title: "Interface для props",
    description: "Типизация props React-компонента.",
    language: "typescript",
    tags: ["types", "props"],
    code: `interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  disabled?: boolean;
  onClick?: () => void;
}

export function Button({ children, variant = "primary", ...props }: ButtonProps) {
  return <button data-variant={variant} {...props}>{children}</button>;
}`,
  },
  {
    id: "ts-type-utility",
    category: "typescript",
    title: "Utility types",
    description: "Pick, Omit, Partial для работы с типами.",
    language: "typescript",
    tags: ["types", "utility"],
    code: `type User = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
};

type UserPreview = Pick<User, "id" | "name">;
type UserUpdate = Partial<Omit<User, "id">>;`,
  },
  {
    id: "ts-generic-function",
    category: "typescript",
    title: "Generic function",
    description: "Обобщённая функция с ограничением типа.",
    language: "typescript",
    tags: ["types", "generic"],
    code: `function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const name = getProperty({ id: 1, name: "DevKit" }, "name");`,
  },
  {
    id: "ts-satisfies",
    category: "typescript",
    title: "satisfies",
    description: "Проверка типа без потери литеральных значений.",
    language: "typescript",
    tags: ["types", "satisfies"],
    code: `const config = {
  apiUrl: "https://api.example.com",
  timeout: 5000,
  retries: 3,
} satisfies Record<string, string | number>;`,
  },
  {
    id: "css-flex-center",
    category: "css",
    title: "Flex center",
    description: "Центрирование по обеим осям через flexbox.",
    language: "css",
    tags: ["layout", "flexbox"],
    code: `.center {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100%;
}`,
  },
  {
    id: "css-grid-auto-fit",
    category: "css",
    title: "Grid auto-fit",
    description: "Адаптивная сетка без media queries.",
    language: "css",
    tags: ["layout", "grid", "responsive"],
    code: `.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
  gap: 1rem;
}`,
  },
  {
    id: "css-truncate",
    category: "css",
    title: "Truncate text",
    description: "Обрезка длинного текста с многоточием.",
    language: "css",
    tags: ["typography", "truncate"],
    code: `.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}`,
  },
  {
    id: "css-scrollbar",
    category: "css",
    title: "Scrollbar styling",
    description: "Кастомный скроллбар для WebKit и Firefox.",
    language: "css",
    tags: ["scrollbar", "ui"],
    code: `.scrollable {
  scrollbar-width: thin;
  scrollbar-color: var(--border) transparent;
}

.scrollable::-webkit-scrollbar {
  width: 8px;
}

.scrollable::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 9999px;
}`,
  },
  {
    id: "html-meta-viewport",
    category: "html",
    title: "Meta viewport",
    description: "Базовые meta-теги для адаптивной страницы.",
    language: "markup",
    tags: ["meta", "responsive"],
    code: `<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="description" content="Page description" />`,
  },
  {
    id: "html-lazy-image",
    category: "html",
    title: "Lazy image",
    description: "Изображение с ленивой загрузкой и размерами.",
    language: "markup",
    tags: ["image", "performance"],
    code: `<img
  src="/hero.jpg"
  alt="Hero image"
  width="1200"
  height="630"
  loading="lazy"
  decoding="async"
/>`,
  },
  {
    id: "html-accessible-button",
    category: "html",
    title: "Accessible button",
    description: "Кнопка с aria-атрибутами и disabled-состоянием.",
    language: "markup",
    tags: ["a11y", "button"],
    code: `<button
  type="button"
  aria-label="Close dialog"
  aria-disabled="false"
>
  <span aria-hidden="true">&times;</span>
</button>`,
  },
  {
    id: "nextjs-metadata",
    category: "nextjs",
    title: "Metadata export",
    description: "Статические метаданные страницы в App Router.",
    language: "typescript",
    tags: ["metadata", "seo"],
    code: `import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page title",
  description: "Page description",
};`,
  },
  {
    id: "nextjs-client-component",
    category: "nextjs",
    title: "Client component",
    description: "Клиентский компонент с директивой use client.",
    language: "typescript",
    tags: ["client", "rsc"],
    code: `"use client";

import { useState } from "react";

export function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount((c) => c + 1)}>{count}</button>;
}`,
  },
  {
    id: "nextjs-dynamic-import",
    category: "nextjs",
    title: "Dynamic import",
    description: "Ленивая загрузка тяжёлого компонента.",
    language: "typescript",
    tags: ["dynamic", "lazy"],
    code: `import dynamic from "next/dynamic";

const HeavyChart = dynamic(() => import("./heavy-chart"), {
  loading: () => <p>Loading chart...</p>,
  ssr: false,
});`,
  },
  {
    id: "git-stash",
    category: "git",
    title: "Git stash",
    description: "Сохранить и вернуть незакоммиченные изменения.",
    language: "bash",
    tags: ["git", "stash"],
    code: `# Сохранить изменения
git stash push -m "WIP: feature"

# Посмотреть список
git stash list

# Вернуть последний stash
git stash pop`,
  },
  {
    id: "git-rebase",
    category: "git",
    title: "Interactive rebase",
    description: "Переписать историю последних коммитов.",
    language: "bash",
    tags: ["git", "rebase"],
    code: `# Переписать последние 3 коммита
git rebase -i HEAD~3

# Продолжить после конфликта
git rebase --continue

# Отменить rebase
git rebase --abort`,
  },
  {
    id: "git-cherry-pick",
    category: "git",
    title: "Cherry-pick",
    description: "Перенести конкретный коммит в текущую ветку.",
    language: "bash",
    tags: ["git", "cherry-pick"],
    code: `# Перенести коммит
git cherry-pick <commit-hash>

# Отменить cherry-pick
git cherry-pick --abort`,
  },
];
