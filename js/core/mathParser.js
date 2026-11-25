/**
 * mathParser.js — bezpieczny ewaluator wyrażeń matematycznych (bez eval()).
 * Safe math expression evaluator — recursive-descent parser, no eval().
 *
 * Obsługiwane / supported:
 *   liczby: 12, 3.5, 1e3     operatory: + - * / % ^ (oraz ** jako potęga)
 *   nawiasy, zmienne, stałe PI i E
 *   funkcje: ceil, floor, round(x[, miejsca]), abs, min, max, sqrt, pow, exp, ln, log, log10
 *   prefiks "Math." jest akceptowany (Math.ceil(x) == ceil(x))
 */
(function (NS) {
  'use strict';

  class MathError extends Error {
    constructor(code, detail) {
      super(code + (detail !== undefined ? ': ' + detail : ''));
      this.name = 'MathError';
      this.code = code;
      this.detail = detail;
    }
  }

  function roundTo(x, digits) {
    const d = digits === undefined ? 0 : Math.max(0, Math.min(10, Math.floor(digits)));
    const f = Math.pow(10, d);
    return Math.round((x + Math.sign(x) * Number.EPSILON) * f) / f;
  }

  // nazwa: [min. liczba argumentów, maks. liczba argumentów, implementacja]
  const FUNCTIONS = {
    ceil: [1, 1, Math.ceil],
    floor: [1, 1, Math.floor],
    round: [1, 2, roundTo],
    abs: [1, 1, Math.abs],
    min: [1, Infinity, Math.min],
    max: [1, Infinity, Math.max],
    sqrt: [1, 1, Math.sqrt],
    pow: [2, 2, Math.pow],
    exp: [1, 1, Math.exp],
    ln: [1, 1, Math.log],
    log: [1, 1, Math.log],
    log10: [1, 1, Math.log10],
  };

  const CONSTANTS = { PI: Math.PI, E: Math.E };

  /* ---------- Tokenizer ---------- */

  function tokenize(source) {
    const src = String(source == null ? '' : source);
    const tokens = [];
    let i = 0;
    while (i < src.length) {
      const c = src[i];
      if (/\s/.test(c)) {
        i++;
        continue;
      }
      if (/[0-9.]/.test(c)) {
        const m = /^(\d+\.?\d*|\.\d+)(e[+-]?\d+)?/i.exec(src.slice(i));
        if (!m) throw new MathError('badNumber', c);
        tokens.push({ t: 'num', v: parseFloat(m[0]) });
        i += m[0].length;
        continue;
      }
      if (/[A-Za-z_]/.test(c)) {
        const m = /^[A-Za-z_][A-Za-z0-9_]*(\.[A-Za-z_][A-Za-z0-9_]*)*/.exec(src.slice(i));
        let name = m[0];
        if (name.indexOf('Math.') === 0) name = name.slice(5);
        if (name.indexOf('.') !== -1) throw new MathError('unknownVariable', name);
        tokens.push({ t: 'id', v: name });
        i += m[0].length;
        continue;
      }
      if (c === '*' && src[i + 1] === '*') {
        tokens.push({ t: 'op', v: '^' });
        i += 2;
        continue;
      }
      if ('+-*/%^'.indexOf(c) !== -1) {
        tokens.push({ t: 'op', v: c });
        i++;
        continue;
      }
      if ('(),'.indexOf(c) !== -1) {
        tokens.push({ t: c, v: c });
        i++;
        continue;
      }
      throw new MathError('unexpectedChar', c);
    }
    return tokens;
  }

  /* ---------- Parser (AST) ---------- */

  function parse(source) {
    const tokens = tokenize(source);
    if (!tokens.length) throw new MathError('empty');
    let pos = 0;

    const peek = () => tokens[pos];
    const next = () => tokens[pos++];
    const isOp = (tok, ops) => tok && tok.t === 'op' && ops.indexOf(tok.v) !== -1;

    function expect(type) {
      const tok = next();
      if (!tok || tok.t !== type) throw new MathError('expected', type);
      return tok;
    }

    // expression := term (('+' | '-') term)*
    function parseExpression() {
      let left = parseTerm();
      while (isOp(peek(), '+-')) {
        const op = next().v;
        left = { k: 'bin', op, a: left, b: parseTerm() };
      }
      return left;
    }

    // term := unary (('*' | '/' | '%') unary)*
    function parseTerm() {
      let left = parseUnary();
      while (isOp(peek(), '*/%')) {
        const op = next().v;
        left = { k: 'bin', op, a: left, b: parseUnary() };
      }
      return left;
    }

    // unary := ('-' | '+') unary | power
    function parseUnary() {
      if (isOp(peek(), '+-')) {
        const op = next().v;
        const arg = parseUnary();
        return op === '-' ? { k: 'neg', a: arg } : arg;
      }
      return parsePower();
    }

    // power := primary ('^' unary)?   (prawostronnie łączne)
    function parsePower() {
      const base = parsePrimary();
      if (isOp(peek(), '^')) {
        next();
        return { k: 'bin', op: '^', a: base, b: parseUnary() };
      }
      return base;
    }

    function parsePrimary() {
      const tok = next();
      if (!tok) throw new MathError('unexpectedEnd');
      if (tok.t === 'num') return { k: 'num', v: tok.v };
      if (tok.t === '(') {
        const inner = parseExpression();
        expect(')');
        return inner;
      }
      if (tok.t === 'id') {
        if (peek() && peek().t === '(') {
          next();
          const args = [];
          if (peek() && peek().t === ')') {
            next();
          } else {
            args.push(parseExpression());
            while (peek() && peek().t === ',') {
              next();
              args.push(parseExpression());
            }
            expect(')');
          }
          const fn = FUNCTIONS[tok.v];
          if (!fn) throw new MathError('unknownFunction', tok.v);
          if (args.length < fn[0] || args.length > fn[1]) throw new MathError('argCount', tok.v);
          return { k: 'call', fn: tok.v, args };
        }
        return { k: 'var', name: tok.v };
      }
      throw new MathError('unexpectedToken', tok.v);
    }

    const ast = parseExpression();
    if (pos < tokens.length) throw new MathError('unexpectedToken', tokens[pos].v);
    return ast;
  }

  /* ---------- Ewaluacja ---------- */

  function evalNode(node, scope) {
    switch (node.k) {
      case 'num':
        return node.v;
      case 'var':
        if (Object.prototype.hasOwnProperty.call(scope, node.name)) return Number(scope[node.name]);
        if (Object.prototype.hasOwnProperty.call(CONSTANTS, node.name)) return CONSTANTS[node.name];
        throw new MathError('unknownVariable', node.name);
      case 'neg':
        return -evalNode(node.a, scope);
      case 'call':
        return FUNCTIONS[node.fn][2].apply(null, node.args.map((a) => evalNode(a, scope)));
      case 'bin': {
        const a = evalNode(node.a, scope);
        const b = evalNode(node.b, scope);
        switch (node.op) {
          case '+': return a + b;
          case '-': return a - b;
          case '*': return a * b;
          case '/':
            if (b === 0) throw new MathError('divisionByZero');
            return a / b;
          case '%':
            if (b === 0) throw new MathError('divisionByZero');
            return a % b;
          case '^': return Math.pow(a, b);
        }
      }
    }
    throw new MathError('unexpectedToken', node.k);
  }

  const cache = new Map();

  function compile(source) {
    const key = String(source);
    if (!cache.has(key)) cache.set(key, parse(key));
    return cache.get(key);
  }

  /** Oblicza wyrażenie w podanym zakresie zmiennych. */
  function evaluate(source, scope) {
    const result = evalNode(compile(source), scope || {});
    if (!Number.isFinite(result)) throw new MathError('notFinite');
    return result;
  }

  /** Zwraca nazwy zmiennych użytych w wyrażeniu (bez stałych). */
  function variablesOf(source) {
    const names = new Set();
    (function walk(node) {
      if (node.k === 'var' && !Object.prototype.hasOwnProperty.call(CONSTANTS, node.name)) names.add(node.name);
      if (node.a) walk(node.a);
      if (node.b) walk(node.b);
      if (node.args) node.args.forEach(walk);
    })(compile(source));
    return Array.from(names);
  }

  /** Zwraca null, jeśli wyrażenie jest poprawne składniowo, albo obiekt błędu. */
  function validate(source) {
    try {
      compile(source);
      return null;
    } catch (e) {
      return e;
    }
  }

  NS.MathParser = {
    parse,
    evaluate,
    variablesOf,
    validate,
    roundTo,
    MathError,
    FUNCTION_NAMES: Object.keys(FUNCTIONS),
  };
})(globalThis.BizTest = globalThis.BizTest || {});
