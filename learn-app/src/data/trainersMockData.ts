export const trainersData = [
    { id: 1, name: "Elizabeth Lopez", specialization: "PHP" },
    { id: 2, name: "Matthew Martinez", specialization: "JavaScript" },
    { id: 3, name: "Elizabeth Hall", specialization: "Algorithms" },
    { id: 4, name: "Maria White", specialization: "Java" },
    { id: 5, name: "Javier Ortiz", specialization: "HTML" },
    { id: 6, name: "Brandon Taylor", specialization: "CSS" },
    { id: 7, name: "Elizabeth Watson", specialization: "Go Lang" },
    { id: 8, name: "Elizabeth Allen", specialization: "Rust" },
];

export const trainersOptions = trainersData.map((trainer) => ({
    id: String(trainer.id),
    label: trainer.name,
}));
