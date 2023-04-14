export function classFilter(...arg: string[]) {
  return arg.filter(Boolean).join(" ");
}
