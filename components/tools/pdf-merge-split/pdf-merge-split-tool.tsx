"use client";

import { DownloadIcon, FilesIcon, Loader2Icon } from "lucide-react";

import { FileDropzone } from "@/components/shared/file-dropzone";
import { PdfPageGrid } from "@/components/tools/pdf-merge-split/pdf-page-grid";
import { SplitOptionsPanel } from "@/components/tools/pdf-merge-split/split-options-panel";
import { usePdfMergeSplit } from "@/components/tools/pdf-merge-split/use-pdf-merge-split";
import { ACCEPTED_EXTENSIONS } from "@/components/tools/pdf-merge-split/types";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ACCEPTED_PDF_EXTENSIONS } from "@/lib/media/constants";

export function PdfMergeSplitTool() {
  const {
    activeTab,
    setActiveTab,
    mergePages,
    mergeResult,
    isMerging,
    isLoadingMergePreview,
    mergeProgress,
    addMergeFiles,
    removeMergePage,
    reorderMergePages,
    merge,
    downloadMergeResult,
    resetMerge,
    splitFile,
    splitPageCount,
    splitPages,
    splitMode,
    splitInput,
    splitResult,
    isSplitting,
    isLoadingPreview,
    splitProgress,
    splitGridMode,
    splitSelectedPages,
    splitHighlightedPages,
    setSplitMode,
    setSplitInput,
    toggleSplitPageSelect,
    loadSplitFile,
    split,
    downloadSplitResult,
    resetSplit,
  } = usePdfMergeSplit();

  const mergeSourceFiles = [
    ...new Map(
      mergePages.map((page) => [
        `${page.file.name}:${page.file.size}`,
        page.file,
      ]),
    ).values(),
  ];

  return (
    <div className="flex flex-col gap-6 p-4 lg:p-6">
      <header className="space-y-1">
        <div className="flex items-center gap-2 text-muted-foreground">
          <FilesIcon className="size-4" />
          <span className="text-sm">Инструменты</span>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">PDF Merge / Split</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Объединение и разделение PDF с сохранением векторного содержимого.
          Обработка локально в браузере.
        </p>
      </header>

      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as "merge" | "split")}
      >
        <TabsList>
          <TabsTrigger value="merge">Merge</TabsTrigger>
          <TabsTrigger value="split">Split</TabsTrigger>
        </TabsList>

        <TabsContent value="merge" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <section className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4">
              <FileDropzone
                files={mergeSourceFiles}
                onFilesChange={(files) => {
                  if (files.length === 0) {
                    resetMerge();
                    return;
                  }
                  const existingKeys = new Set(
                    mergePages.map(
                      (page) => `${page.file.name}:${page.file.size}`,
                    ),
                  );
                  const newFiles = files.filter(
                    (file) => !existingKeys.has(`${file.name}:${file.size}`),
                  );
                  if (newFiles.length > 0) {
                    void addMergeFiles(newFiles);
                  }
                }}
                accept={ACCEPTED_EXTENSIONS}
                multiple
                disabled={isMerging || isLoadingMergePreview}
              />

              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  onClick={merge}
                  disabled={
                    isMerging ||
                    isLoadingMergePreview ||
                    mergePages.length === 0
                  }
                >
                  {isMerging ? (
                    <>
                      <Loader2Icon className="animate-spin" />
                      Объединение…
                    </>
                  ) : (
                    "Объединить"
                  )}
                </Button>
                {mergePages.length > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetMerge}
                    disabled={isMerging || isLoadingMergePreview}
                  >
                    Очистить
                  </Button>
                )}
              </div>

              {mergeProgress && (
                <p className="text-sm text-muted-foreground">
                  {mergeProgress.message} ({mergeProgress.current}/
                  {mergeProgress.total})
                </p>
              )}
            </section>

            <section className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4">
              <h2 className="text-sm font-medium">
                {mergePages.length > 0
                  ? `Страницы · ${mergePages.length}`
                  : "Страницы"}
              </h2>

              {isLoadingMergePreview && (
                <p className="text-sm text-muted-foreground">
                  Загрузка preview…
                </p>
              )}

              {mergePages.length > 0 ? (
                <PdfPageGrid
                  pages={mergePages}
                  mode="reorder"
                  disabled={isMerging || isLoadingMergePreview}
                  onReorder={reorderMergePages}
                  onRemove={removeMergePage}
                />
              ) : (
                <p className="text-sm text-muted-foreground">
                  Загрузите PDF и/или изображения — появятся превью страниц.
                  Перетащите их в нужном порядке и нажмите «Объединить».
                </p>
              )}

              {mergeResult && (
                <div className="space-y-2 border-t border-border pt-4">
                  <Button
                    type="button"
                    className="w-fit"
                    onClick={downloadMergeResult}
                  >
                    <DownloadIcon />
                    Скачать {mergeResult.name}
                  </Button>
                </div>
              )}
            </section>
          </div>
        </TabsContent>

        <TabsContent value="split" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <section className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4">
              <FileDropzone
                files={splitFile ? [splitFile] : []}
                onFilesChange={(files) => loadSplitFile(files[0] ?? null)}
                accept={ACCEPTED_PDF_EXTENSIONS}
                multiple={false}
                maxFiles={1}
                disabled={isSplitting || isLoadingPreview}
              />

              {splitFile && splitPageCount > 0 && (
                <SplitOptionsPanel
                  mode={splitMode}
                  input={splitInput}
                  totalPages={splitPageCount}
                  disabled={isSplitting || isLoadingPreview}
                  onModeChange={setSplitMode}
                  onInputChange={setSplitInput}
                />
              )}

              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  onClick={split}
                  disabled={
                    isSplitting || isLoadingPreview || !splitFile || splitPageCount === 0
                  }
                >
                  {isSplitting ? (
                    <>
                      <Loader2Icon className="animate-spin" />
                      Разделение…
                    </>
                  ) : (
                    "Разделить"
                  )}
                </Button>
                {splitFile && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetSplit}
                    disabled={isSplitting || isLoadingPreview}
                  >
                    Очистить
                  </Button>
                )}
              </div>

              {splitProgress && (
                <p className="text-sm text-muted-foreground">
                  {splitProgress.message} ({splitProgress.current}/
                  {splitProgress.total})
                </p>
              )}
            </section>

            <section className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4">
              <h2 className="text-sm font-medium">
                {splitPages.length > 0
                  ? `Preview · ${splitPageCount} стр.`
                  : "Preview"}
              </h2>

              {isLoadingPreview && (
                <p className="text-sm text-muted-foreground">Загрузка preview…</p>
              )}

              {splitPages.length > 0 ? (
                <PdfPageGrid
                  pages={splitPages}
                  mode={splitGridMode}
                  selectedPageNumbers={splitSelectedPages}
                  highlightedPageNumbers={splitHighlightedPages}
                  disabled={isSplitting || isLoadingPreview}
                  onToggleSelect={toggleSplitPageSelect}
                />
              ) : (
                <p className="text-sm text-muted-foreground">
                  Загрузите PDF — появятся превью страниц.
                </p>
              )}

              {splitResult && (
                <div className="space-y-2 border-t border-border pt-4">
                  <p className="text-xs text-muted-foreground">
                    {splitResult.files.length} файл(ов)
                    {splitResult.zipBlob ? " · ZIP" : ""}
                  </p>
                  <Button type="button" className="w-fit" onClick={downloadSplitResult}>
                    <DownloadIcon />
                    Скачать{" "}
                    {splitResult.zipBlob
                      ? (splitResult.zipName ?? "split.zip")
                      : splitResult.files[0]?.name}
                  </Button>
                </div>
              )}
            </section>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
