// =============================
// PROGRESSO DO ALUNO (LOCAL)
// =============================

export const Progress = {

  key: "progress",

  // =============================
  // ESTRUTURA BASE
  // =============================
  base() {
    return {
      total: 0,
      correct: 0,
      topics: {},
      streak: 0,       // sequência de acertos
      bestStreak: 0    // melhor sequência
    };
  },

  // =============================
  // LOAD (com proteção)
  // =============================
  load() {
    try {
      const raw = localStorage.getItem(this.key);

      if (!raw) return this.base();

      const data = JSON.parse(raw);

      // garante estrutura mínima (anti corrupção)
      return {
        ...this.base(),
        ...data,
        topics: data.topics || {}
      };

    } catch (e) {
      console.warn("Erro ao carregar progresso, resetando...");
      return this.base();
    }
  },

  // =============================
  // SAVE
  // =============================
  save(data) {
    localStorage.setItem(this.key, JSON.stringify(data));
  },

  // =============================
  // UPDATE (núcleo do sistema)
  // =============================
  update(topic, isCorrect) {

    const p = this.load();

    // geral
    p.total++;

    if (isCorrect) {
      p.correct++;
      p.streak++;
    } else {
      p.streak = 0;
    }

    // melhor sequência
    if (p.streak > p.bestStreak) {
      p.bestStreak = p.streak;
    }

    // estrutura do tópico
    if (!p.topics[topic]) {
      p.topics[topic] = {
        total: 0,
        correct: 0
      };
    }

    p.topics[topic].total++;

    if (isCorrect) {
      p.topics[topic].correct++;
    }

    this.save(p);
  },

  // =============================
  // MÉTRICAS GERAIS
  // =============================
  accuracy() {
    const p = this.load();

    if (p.total === 0) return "0.0";

    return ((p.correct / p.total) * 100).toFixed(1);
  },

  topicAccuracy(topic) {
    const p = this.load();

    const t = p.topics[topic];

    if (!t || t.total === 0) return "0.0";

    return ((t.correct / t.total) * 100).toFixed(1);
  },

  // =============================
  // NÍVEL DO ALUNO
  // =============================
  level() {
    const p = this.load();

    // regra simples: cada 10 acertos = nível
    return Math.floor(p.correct / 10) + 1;
  },

  // =============================
  // MEDALHA (GAMIFICAÇÃO)
  // =============================
  medal() {
    const acc = parseFloat(this.accuracy());

    if (acc >= 90) return "ouro";
    if (acc >= 75) return "prata";
    if (acc >= 50) return "bronze";

    return "nenhuma";
  },

  // =============================
  // RESUMO (para UI)
  // =============================
  summary() {
    const p = this.load();

    return {
      total: p.total,
      correct: p.correct,
      accuracy: this.accuracy(),
      level: this.level(),
      medal: this.medal(),
      streak: p.streak,
      bestStreak: p.bestStreak
    };
  },

  // =============================
  // RESET
  // =============================
  reset() {
    localStorage.removeItem(this.key);
  }

};