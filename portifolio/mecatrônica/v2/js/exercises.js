export const Exercises = [
   
   {
      type: "ohm",
      level: "easy",
      generate() {
         const V = rand(10, 20);
         const R = rand(1, 10);
         
         return {
            question: `Calcule a corrente para V=${V}V e R=${R}Ω`,
            data: { V, R },
            solve: (engine) => engine.ohm({ V, R }),
            formula: "I = V / R"
         };
      }
   },
   
   {
      type: "series",
      level: "easy",
      generate() {
         const values = [rand(1, 10), rand(1, 10)];
         
         return {
            question: `Req para resistores em série: ${values.join(", ")} Ω`,
            data: values,
            solve: (engine) => engine.series(values),
            formula: "Req = soma"
         };
      }
   }
   
];

function rand(min, max) {
   return Math.floor(Math.random() * (max - min + 1)) + min;
}