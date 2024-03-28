import { get, writable, type Writable } from "svelte/store";

interface Breadcrumb {
  link: string | null,
  display: string
}
export let items: Writable<Breadcrumb[]> = writable([]);
export function clearItems(_url: URL) {
  items.set([]);
}

export function addItem(_url: URL, link: string, display: string) {
  items.set(get(items).concat([{ link, display }]));
}

export function addPage(_url: URL, display: string) {
  items.set(get(items).concat([{ link: null, display }]));
}