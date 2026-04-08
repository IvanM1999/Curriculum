export const Progress = {
   
   load() {
      return JSON.parse(localStorage.getItem("progress")) || {
         total: 0,
         correct: 0,
         topics: {}
      };
   },
   
   save(data) {
      localStorage.setItem("progress", JSON.stringify(data));
   },
   
   update(topic, correct) {
      let p = this.load();
      
      p.total++;
      
      if (correct) p.correct++;
      
      if (!p.topics[topic]) {
         p.topics[topic] = { total: 0, correct: 0 };
      }
      
      p.topics[topic].total++;
      if (correct) p.topics[topic].correct++;
      
      this.save(p);
   },
   
   accuracy() {
      let p = this.load();
      return ((p.correct / p.total) * 100 || 0).toFixed(1);
   }
   
};