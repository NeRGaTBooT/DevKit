export interface ZipFileEntry {
  name: string;
  blob: Blob;
}

export async function packZip(files: ZipFileEntry[]): Promise<Blob> {
  const JSZip = (await import("jszip")).default;
  const zip = new JSZip();

  for (const file of files) {
    zip.file(file.name, file.blob);
  }

  return zip.generateAsync({ type: "blob" });
}
