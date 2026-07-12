import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

import { ThemeToggle } from "@/components/layout/theme-toggle";

export const metadata: Metadata = {
  title: "Горячие клавиши — DevKit",
  description: "Справочник сочетаний клавиш DevKit",
};

const shortcuts = [
  {
    group: "Поиск",
    items: [
      {
        keys: ["Ctrl", "K"],
        macKeys: ["⌘", "K"],
        description: "Открыть палитру поиска инструментов",
      },
      {
        keys: ["Esc"],
        macKeys: ["Esc"],
        description: "Закрыть палитру поиска",
      },
    ],
  },
  {
    group: "Навигация",
    items: [
      {
        keys: ["↑", "↓"],
        macKeys: ["↑", "↓"],
        description: "Перемещение по результатам поиска",
      },
      {
        keys: ["Enter"],
        macKeys: ["Enter"],
        description: "Перейти к выбранному инструменту",
      },
    ],
  },
  {
    group: "Копирование",
    items: [
      {
        keys: ["Кнопка «Копировать»"],
        macKeys: ["Кнопка «Копировать»"],
        description: "Скопировать код или значение в буфер обмена",
      },
      {
        keys: ["Кнопка «Поделиться»"],
        macKeys: ["Кнопка «Поделиться»"],
        description: "Скопировать ссылку с текущим состоянием инструмента",
      },
    ],
  },
];

function KeyBadge({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex min-w-6 items-center justify-center rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-xs font-medium text-foreground">
      {children}
    </kbd>
  );
}

export default function ShortcutsPage() {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeftIcon className="size-4" />
            На главную
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-4 py-10">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            Горячие клавиши
          </h1>
          <p className="text-sm text-muted-foreground">
            Основные сочетания клавиш и действия в DevKit.
          </p>
        </div>

        {shortcuts.map((section) => (
          <section key={section.group} className="space-y-3">
            <h2 className="text-base font-medium">{section.group}</h2>
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="px-4 py-3 text-left font-medium">
                      Windows / Linux
                    </th>
                    <th className="px-4 py-3 text-left font-medium">macOS</th>
                    <th className="px-4 py-3 text-left font-medium">Действие</th>
                  </tr>
                </thead>
                <tbody>
                  {section.items.map((item) => (
                    <tr
                      key={item.description}
                      className="border-b border-border last:border-b-0"
                    >
                      <td className="px-4 py-3 align-top">
                        <div className="flex flex-wrap gap-1">
                          {item.keys.map((key) => (
                            <KeyBadge key={key}>{key}</KeyBadge>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 align-top">
                        <div className="flex flex-wrap gap-1">
                          {item.macKeys.map((key) => (
                            <KeyBadge key={key}>{key}</KeyBadge>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 align-top text-muted-foreground">
                        {item.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
