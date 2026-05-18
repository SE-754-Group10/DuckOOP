const questions = {
  q1: {
    id: "q1",
    text: "What is encapsulation in OOP?",
    options: [
      {
        id: "a",
        label:
          "Hiding internal state and requiring interaction through methods",
      },
      { id: "b", label: "A class inheriting properties from another class" },
      { id: "c", label: "Creating multiple instances of a class" },
      { id: "d", label: "Breaking code into separate files" },
    ],
    correctId: "a",
    explanation:
      "Encapsulation bundles data and methods together and restricts direct access to internal state.",
  },
  q2: {
    id: "q2",
    text: "Which keyword is used to inherit a class in Java?",
    options: [
      { id: "a", label: "implements" },
      { id: "b", label: "extends" },
      { id: "c", label: "inherits" },
      { id: "d", label: "super" },
    ],
    correctId: "b",
    explanation:
      "The extends keyword is used in Java to create a subclass that inherits from a parent class.",
  },
  q3: {
    id: "q3",
    text: "What is polymorphism?",
    options: [
      { id: "a", label: "A class having only one method" },
      {
        id: "b",
        label:
          "The ability of different objects to respond to the same method in different ways",
      },
      { id: "c", label: "Restricting access to class properties" },
      { id: "d", label: "Combining two classes into one" },
    ],
    correctId: "b",
    explanation:
      "Polymorphism allows objects of different types to be treated through the same interface, each responding in their own way.",
  },
  q4: {
    id: "q4",
    text: "What is an abstract class?",
    options: [
      { id: "a", label: "A class with no properties" },
      { id: "b", label: "A class that can be instantiated directly" },
      {
        id: "c",
        label:
          "A class that cannot be instantiated and may contain abstract methods",
      },
      { id: "d", label: "A class that only contains static methods" },
    ],
    correctId: "c",
    explanation:
      "An abstract class cannot be instantiated directly and is designed to be subclassed. It can contain abstract methods that subclasses must implement.",
  },
  q5: {
    id: "q5",
    text: "What does the 'super' keyword do?",
    options: [
      { id: "a", label: "Deletes the parent class" },
      { id: "b", label: "Refers to the current class instance" },
      { id: "c", label: "Calls the constructor or method of the parent class" },
      { id: "d", label: "Makes a method static" },
    ],
    correctId: "c",
    explanation:
      "The super keyword is used to call the constructor or methods of a parent class from within a subclass.",
  },
  q6: {
    id: "q6",
    text: "What is method overriding?",
    options: [
      {
        id: "a",
        label:
          "Defining two methods with the same name but different parameters in the same class",
      },
      {
        id: "b",
        label:
          "A subclass providing its own implementation of a method defined in the parent class",
      },
      { id: "c", label: "Making a method private" },
      { id: "d", label: "Calling a method from a different class" },
    ],
    correctId: "b",
    explanation:
      "Method overriding is when a subclass provides a specific implementation of a method that is already defined in its parent class.",
  },
  q7: {
    id: "q7",
    text: "What is a constructor?",
    options: [
      { id: "a", label: "A method that destroys an object" },
      {
        id: "b",
        label:
          "A special method called automatically when an object is created",
      },
      { id: "c", label: "A method that can only be called once" },
      { id: "d", label: "A static method on a class" },
    ],
    correctId: "b",
    explanation:
      "A constructor is a special method that is automatically called when a new instance of a class is created, typically used to initialise properties.",
  },
  q8: {
    id: "q8",
    text: "What is the difference between a class and an object?",
    options: [
      { id: "a", label: "There is no difference" },
      { id: "b", label: "An object is a blueprint; a class is an instance" },
      {
        id: "c",
        label: "A class is a blueprint; an object is an instance of that class",
      },
      { id: "d", label: "A class can only have one object" },
    ],
    correctId: "c",
    explanation:
      "A class is a blueprint or template that defines properties and behaviours. An object is a specific instance created from that class.",
  },
  q9: {
    id: "q9",
    text: "What does the 'private' access modifier do?",
    options: [
      { id: "a", label: "Makes a property accessible from anywhere" },
      {
        id: "b",
        label: "Makes a property accessible only within the same class",
      },
      { id: "c", label: "Makes a property accessible only to subclasses" },
      { id: "d", label: "Makes a property read-only" },
    ],
    correctId: "b",
    explanation:
      "The private modifier restricts access to a property or method so it can only be accessed from within the class it is defined in.",
  },
  q10: {
    id: "q10",
    text: "What is an interface in OOP?",
    options: [
      { id: "a", label: "A class with only private methods" },
      {
        id: "b",
        label: "A contract that defines what methods a class must implement",
      },
      { id: "c", label: "A way to create objects without a class" },
      { id: "d", label: "A method that returns another object" },
    ],
    correctId: "b",
    explanation:
      "An interface defines a contract — a set of methods a class must implement — without specifying how they work.",
  },
};

export default questions;
