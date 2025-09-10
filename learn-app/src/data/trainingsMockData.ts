interface TrainingData {
    [key: string]: string;
    date: string;
    trainingName: string;
    type: string;
    studentName: string;
    trainerName: string;
    duration: string;
}

export const trainingsData: TrainingData[] = [
    {
        date: "15.05.2025",
        trainingName: "JavaScript Course",
        type: "Webinar",
        studentName: "Marta Black",
        trainerName: "John Doe",
        duration: "15 d",
    },
    {
        date: "18.05.2025",
        trainingName: "React Basics",
        type: "Webinar",
        studentName: "John Doe",
        trainerName: "John Doe",
        duration: "10 d",
    },
    {
        date: "19.05.2025",
        trainingName: "C++",
        type: "",
        studentName: "Maria White",
        trainerName: "John Doe",
        duration: "10 d",
    },
    {
        date: "21.05.2025",
        trainingName: "Java",
        type: "Webinar",
        studentName: "Elizabeth Allen",
        trainerName: "John Doe",
        duration: "",
    },
    {
        date: "25.05.2025",
        trainingName: "Go",
        type: "",
        studentName: "Caleb Jones",
        trainerName: "John Doe",
        duration: "",
    },
];
