import { Lesson } from "./types";

export const LESSONS: Lesson[] = [
  {
    id: "variables",
    title: "The Storage Box (Variables)",
    analogy: "Imagine you have a cardboard box. You write 'Age' on the outside and put the number '25' inside. In Java, we call this box a 'Variable'. It holds information for us to use later.",
    concept: "Variables are containers for storing data values. In Java, you must specify the type of data (like 'int' for whole numbers).",
    initialCode: `public class Main {
    public static void main(String[] args) {
        // Create a box called 'age' and put 25 in it
        int age = 25;
        
        // Print the contents of the box
        System.out.println("The age is: " + age);
    }
}`,
    expectedOutput: "The age is: 25",
    nextLessonId: "strings",
    prerequisites: [],
  },
  {
    id: "strings",
    title: "The Label Maker (Strings)",
    analogy: "If numbers are like physical items, text is like a label. We use double quotes to tell Java 'this is just text, don't try to calculate it'.",
    concept: "Strings are used for storing text. They are surrounded by double quotes.",
    initialCode: `public class Main {
    public static void main(String[] args) {
        String name = "Java Explorer";
        System.out.println("Hello, " + name);
    }
}`,
    expectedOutput: "Hello, Java Explorer",
    nextLessonId: "if-statements",
    prerequisites: ["variables"],
  },
  {
    id: "if-statements",
    title: "The Bouncer (If Statements)",
    analogy: "Imagine a bouncer at a club. He checks your ID. IF you are over 21, you can enter. ELSE, you stay outside. Java uses 'if' to make decisions.",
    concept: "Use 'if' to specify a block of code to be executed, if a specified condition is true.",
    initialCode: `public class Main {
    public static void main(String[] args) {
        int age = 18;
        
        if (age >= 21) {
            System.out.println("Welcome to the club!");
        } else {
            System.out.println("Sorry, you're too young.");
        }
    }
}`,
    expectedOutput: "Sorry, you're too young.",
    nextLessonId: "loops",
    prerequisites: ["strings"],
  },
  {
    id: "loops",
    title: "The Treadmill (Loops)",
    analogy: "A treadmill keeps going until you hit the stop button. A 'for' loop in Java repeats code a specific number of times.",
    concept: "Loops can execute a block of code as long as a specified condition is reached.",
    initialCode: `public class Main {
    public static void main(String[] args) {
        for (int i = 1; i <= 5; i++) {
            System.out.println("Lap number: " + i);
        }
    }
}`,
    expectedOutput: "Lap number: 1\nLap number: 2\nLap number: 3\nLap number: 4\nLap number: 5",
    nextLessonId: "arrays",
    prerequisites: ["if-statements"],
  },
  {
    id: "arrays",
    title: "The Egg Carton (Arrays)",
    analogy: "An egg carton is a single container that holds multiple items of the same type. In Java, an Array lets you store a list of items under one name.",
    concept: "Arrays are used to store multiple values in a single variable, instead of declaring separate variables for each value.",
    initialCode: `public class Main {
    public static void main(String[] args) {
        String[] fruits = {"Apple", "Banana", "Cherry"};
        
        System.out.println("First fruit: " + fruits[0]);
        System.out.println("Total fruits: " + fruits.length);
    }
}`,
    expectedOutput: "First fruit: Apple\nTotal fruits: 3",
    nextLessonId: "methods",
    prerequisites: ["loops"],
  },
  {
    id: "methods",
    title: "The Recipe (Methods)",
    analogy: "A recipe is a set of instructions you can follow whenever you want to bake a cake. A Method is a block of code you can 'call' whenever you need that specific task done.",
    concept: "A method is a block of code which only runs when it is called. You can pass data, known as parameters, into a method.",
    initialCode: `public class Main {
    static void sayHello(String name) {
        System.out.println("Hello, " + name + "!");
    }

    public static void main(String[] args) {
        sayHello("Student");
        sayHello("Java Master");
    }
}`,
    expectedOutput: "Hello, Student!\nHello, Java Master!",
    nextLessonId: "classes",
    prerequisites: ["arrays"],
  },
  {
    id: "classes",
    title: "The Blueprint (Classes)",
    analogy: "An architect draws a blueprint for a house. You can't live in the blueprint, but you can use it to build many real houses. A Class is the blueprint, and an Object is the real house.",
    concept: "Java is an object-oriented programming language. Everything in Java is associated with classes and objects, along with its attributes and methods.",
    initialCode: `class Car {
    String color = "Red";
}

public class Main {
    public static void main(String[] args) {
        Car myCar = new Car();
        System.out.println("My car color is: " + myCar.color);
    }
}`,
    expectedOutput: "My car color is: Red",
    prerequisites: ["methods"],
  }
];
