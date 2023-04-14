import { saveAs } from "file-saver";

export function downloadImage(url: string) {
  const name = new Date().toISOString().replaceAll(":", "-");
  saveAs(url, name);
}
