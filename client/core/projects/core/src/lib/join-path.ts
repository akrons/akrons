export function joinPath(a: string, b: string): string {
  if (!b) {
    return a;
  }
  else if (a.endsWith('/') && b.startsWith('/')) {
    return a + b.substring(1);
  }
  else if (a.endsWith('/') || b.startsWith('/')) {
    return a + b;
  }
  else {
    return a + '/' + b;
  }
}
