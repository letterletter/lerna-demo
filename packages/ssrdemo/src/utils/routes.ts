import * as path from 'path';

export function createRouteId(file: string) {
  return normalizeSlashes(stripFileExtension(file));
}

export function normalizeSlashes(file: string) {
  return file.split(path.win32.sep).join('/');
}

function stripFileExtension(file: string) {
  return file.replace(/\.[a-z0-9]+$/i, '');
}

export function findParentRouteId(

  routeIds: string[],

  childRouteId: string,

): string | undefined {
  return routeIds.find((id) => childRouteId.startsWith(`${id}/`));
}

// 最长路由优先

export function byLongestFirst(a: string, b: string): number {
  return b.length - a.length;
}

const escapeStart = '[';

const escapeEnd = ']';

function isNewEscapeSequence(char:string, lastChar:string | undefined, inEscapeSequence: number) {
  return (

    !inEscapeSequence && char === escapeStart && lastChar !== escapeStart

  );
}

function isCloseEscapeSequence(char:string, nextChar:string | undefined, inEscapeSequence: number) {
  return inEscapeSequence && char === escapeEnd && nextChar !== escapeEnd;
}

function isStartOfLayoutSegment(
  char:string,
  nextChar:string | undefined,
  rawSegmentBuffer: string,
) {
  return char === '_' && nextChar === '_' && !rawSegmentBuffer;
}

export function createRoutePath(partialRouteId: string): string | undefined {
  let result = '';

  let rawSegmentBuffer = '';

  let inEscapeSequence = 0;

  let skipSegment = false;

  for (let i = 0; i < partialRouteId.length; i++) {
    const char = partialRouteId.charAt(i);

    const lastChar = i > 0 ? partialRouteId.charAt(i - 1) : undefined;

    const nextChar = i < partialRouteId.length - 1 ? partialRouteId.charAt(i + 1) : undefined;

    if (skipSegment) {
      if (char === '/' || char === '.' || char === path.win32.sep) {
        skipSegment = false;
      }

      continue;
    }

    if (isNewEscapeSequence(char, nextChar, inEscapeSequence)) {
      inEscapeSequence++;

      continue;
    }

    if (isCloseEscapeSequence(char, nextChar, inEscapeSequence)) {
      inEscapeSequence--;

      continue;
    }

    if (inEscapeSequence) {
      result += char;

      continue;
    }

    if (char === '/' || char === path.win32.sep || char === '.') {
      if (rawSegmentBuffer === 'index' && result.endsWith('index')) {
        result = result.replace(/\/?index$/, '');
      } else {
        result += '/';
      }

      rawSegmentBuffer = '';

      continue;
    }

    if (isStartOfLayoutSegment(char, nextChar, rawSegmentBuffer)) {
      skipSegment = true;

      continue;
    }

    rawSegmentBuffer += char;

    if (char === '$') {
      result += typeof nextChar === 'undefined' ? '*' : ':';

      continue;
    }

    result += char;
  }

  if (rawSegmentBuffer === 'index' && result.endsWith('index')) {
    result = result.replace(/\/?index$/, '');
  }

  console.log('createRoutePath', partialRouteId, result);

  return result || undefined;
}