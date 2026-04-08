// =============================
// UTIL: RANDOM
// =============================
function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// =============================
// DEFINIÇÃO DE EXERCÍCIOS
// =============================
export const Exercises = [

  // =============================
  // LEI DE OHM
  // =============================
  {
    type: "ohm",
    level: "easy",

    generate() {

      const V = rand(10, 20);
      const R = rand(1, 10);

      return {
        question: `Calcule a corrente (I) para V=${V}V e R=${R}Ω`,
        data: { V, R },

        solve: (engine) => engine.ohm({ V, R }),

        formula: "I = V / R",
        explain: `Aplicando Lei de Ohm: I = ${V} / ${R}`
      };
    }
  },

  // =============================
  // SÉRIE
  // =============================
  {
    type: "series",
    level: "easy",

    generate() {

      const count = rand(2, 4);
      const values = Array.from({ length: count }, () => rand(1, 10));

      return {
        question: `Req (série): ${values.join(" + ")} Ω`,
        data: values,

        solve: (engine) => engine.series(values),

        formula: "Req = R1 + R2 + ...",
        explain: `Somando: ${values.join(" + ")}`
      };
    }
  },

  // =============================
  // PARALELO
  // =============================
  {
    type: "parallel",
    level: "medium",

    generate() {

      const values = [rand(2, 10), rand(2, 10)];

      return {
        question: `Req (paralelo): ${values.join(" || ")} Ω`,
        data: values,

        solve: (engine) => engine.parallel(values),

        formula: "1/Req = 1/R1 + 1/R2",
        explain: `1/Req = 1/${values[0]} + 1/${values[1]}`
      };
    }
  }

];

// =============================
// ADAPTATIVE ENGINE (INTELIGENTE)
// =============================
export function getAdaptiveExercise(Progress) {

  const p = Progress.load();
  const acc = parseFloat(Progress.accuracy());

  let pool = Exercises;

  // =============================
  // 1. AJUSTE POR NÍVEL GLOBAL
  // =============================
  if (acc < 40) {
    pool = Exercises.filter(e => e.level === "easy");
  } else if (acc < 70) {
    pool = Exercises.filter(e => e.level !== "hard");
  }

  // =============================
  // 2. AJUSTE POR TÓPICO FRACO
  // =============================
  let weakest = null;
  let worstAcc = 101;

  for (let t in p.topics) {
    const topic = p.topics[t];

    if (topic.total === 0) continue;

    const topicAcc = (topic.correct / topic.total) * 100;

    if (topicAcc < worstAcc) {
      worstAcc = topicAcc;
      weakest = t;
    }
  }

  if (weakest) {
    const focused = pool.filter(e => e.type === weakest);

    if (focused.length) {
      pool = focused;
    }
  }

  // =============================
  // 3. FALLBACK SEGURO
  // =============================
  if (!pool.length) {
    pool = Exercises;
  }

  // =============================
  // 4. SORTEIO FINAL
  // =============================
  const ex = pool[Math.floor(Math.random() * pool.length)];

  return ex.generate();
}