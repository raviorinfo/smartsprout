import { NextRequest, NextResponse } from "next/server";
import { generateChatCompletion } from "@/lib/openai";

function generateMockMathQuestions(
  subType: string,
  difficulty: string,
  grade: string
) {
  const questions = [];
  const count = 10;

  let maxNum = 10;
  if (difficulty === "medium") maxNum = 50;
  if (difficulty === "hard") maxNum = 100;
  if (grade === "grade4" || grade === "grade5") maxNum = Math.max(maxNum, 100);

  for (let i = 0; i < count; i++) {
    let a: number, b: number, question: string, answer: string;

    switch (subType) {
      case "addition":
        a = Math.floor(Math.random() * maxNum) + 1;
        b = Math.floor(Math.random() * maxNum) + 1;
        question = `${a} + ${b} = ?`;
        answer = `${a + b}`;
        break;
      case "subtraction":
        a = Math.floor(Math.random() * maxNum) + 1;
        b = Math.floor(Math.random() * a) + 1;
        question = `${a} - ${b} = ?`;
        answer = `${a - b}`;
        break;
      case "multiplication":
        a = Math.floor(Math.random() * 12) + 1;
        b = Math.floor(Math.random() * 12) + 1;
        question = `${a} × ${b} = ?`;
        answer = `${a * b}`;
        break;
      case "fractions":
        a = Math.floor(Math.random() * 5) + 1;
        b = Math.floor(Math.random() * 5) + a;
        const c = Math.floor(Math.random() * 5) + 1;
        const d = b;
        question = `${a}/${b} + ${c}/${d} = ?`;
        answer = `${a + c}/${d}`;
        break;
      default:
        a = Math.floor(Math.random() * maxNum) + 1;
        b = Math.floor(Math.random() * maxNum) + 1;
        question = `${a} + ${b} = ?`;
        answer = `${a + b}`;
    }

    questions.push({ question, answer });
  }

  return questions;
}

function generateMockEnglishQuestions(subType: string) {
  const wordSets: Record<string, { question: string; answer: string }[]> = {
    "trace-words": [
      { question: 'Trace the word: "APPLE"', answer: "APPLE" },
      { question: 'Trace the word: "BANANA"', answer: "BANANA" },
      { question: 'Trace the word: "CAT"', answer: "CAT" },
      { question: 'Trace the word: "DOG"', answer: "DOG" },
      { question: 'Trace the word: "ELEPHANT"', answer: "ELEPHANT" },
      { question: 'Trace the word: "FLOWER"', answer: "FLOWER" },
      { question: 'Trace the word: "GARDEN"', answer: "GARDEN" },
      { question: 'Trace the word: "HOUSE"', answer: "HOUSE" },
      { question: 'Trace the word: "ICE CREAM"', answer: "ICE CREAM" },
      { question: 'Trace the word: "JUNGLE"', answer: "JUNGLE" },
    ],
    "missing-letters": [
      { question: "_PPLE", answer: "A (APPLE)" },
      { question: "B_NANA", answer: "A (BANANA)" },
      { question: "C_T", answer: "A (CAT)" },
      { question: "D_G", answer: "O (DOG)" },
      { question: "EL_PHANT", answer: "E (ELEPHANT)" },
      { question: "FL_WER", answer: "O (FLOWER)" },
      { question: "G_RDEN", answer: "A (GARDEN)" },
      { question: "H_USE", answer: "O (HOUSE)" },
      { question: "J_NGLE", answer: "U (JUNGLE)" },
      { question: "K_NG", answer: "I (KING)" },
    ],
    "word-search": [
      { question: "Find: SUN, MOON, STAR, SKY, CLOUD", answer: "See word grid" },
      { question: "Find: CAT, DOG, FISH, BIRD, FROG", answer: "See word grid" },
      { question: "Find: RED, BLUE, GREEN, PINK, GOLD", answer: "See word grid" },
      { question: "Find: APPLE, GRAPE, PEACH, PLUM, MANGO", answer: "See word grid" },
      { question: "Find: TREE, LEAF, SEED, ROOT, BARK", answer: "See word grid" },
    ],
  };

  return wordSets[subType] || wordSets["missing-letters"];
}

function generateMockHindiQuestions(subType: string) {
  const sets: Record<string, { question: string; answer: string }[]> = {
    "varnamala": [
      { question: 'What comes after क (Ka)?', answer: 'ख (Kha)' },
      { question: 'What comes after ग (Ga)?', answer: 'घ (Gha)' },
      { question: 'What comes after च (Cha)?', answer: 'छ (Chha)' },
      { question: 'What comes after ज (Ja)?', answer: 'झ (Jha)' },
      { question: 'What comes after ट (Ta)?', answer: 'ठ (Tha)' },
      { question: 'What comes after ड (Da)?', answer: 'ढ (Dha)' },
      { question: 'What comes after त (Ta)?', answer: 'थ (Tha)' },
      { question: 'What comes after द (Da)?', answer: 'ध (Dha)' },
      { question: 'What comes after प (Pa)?', answer: 'फ (Pha)' },
      { question: 'What comes after ब (Ba)?', answer: 'भ (Bha)' },
    ],
    "matras": [
      { question: 'Add आ matra to क (Ka)', answer: 'का (Kaa)' },
      { question: 'Add इ matra to क (Ka)', answer: 'कि (Ki)' },
      { question: 'Add ई matra to क (Ka)', answer: 'की (Kee)' },
      { question: 'Add उ matra to क (Ka)', answer: 'कु (Ku)' },
      { question: 'Add ऊ matra to क (Ka)', answer: 'कू (Koo)' },
      { question: 'Add ए matra to क (Ka)', answer: 'के (Ke)' },
      { question: 'Add ऐ matra to क (Ka)', answer: 'कै (Kai)' },
      { question: 'Add ओ matra to क (Ka)', answer: 'को (Ko)' },
      { question: 'Add औ matra to क (Ka)', answer: 'कौ (Kau)' },
      { question: 'Add अं bindu to क (Ka)', answer: 'कं (Kam)' },
    ],
    "vocabulary": [
      { question: 'What is the Hindi word for "Apple"?', answer: 'सेब (Seb)' },
      { question: 'What is the Hindi word for "Dog"?', answer: 'कुत्ता (Kutta)' },
      { question: 'What is the Hindi word for "Cat"?', answer: 'बिल्ली (Billi)' },
      { question: 'What is the Hindi word for "Sun"?', answer: 'सूरज (Sooraj)' },
      { question: 'What is the Hindi word for "Moon"?', answer: 'चांद (Chaand)' },
      { question: 'What is the Hindi word for "Water"?', answer: 'पानी (Paani)' },
      { question: 'What is the Hindi word for "Fire"?', answer: 'आग (Aag)' },
      { question: 'What is the Hindi word for "Tree"?', answer: 'पेड़ (Ped)' },
      { question: 'What is the Hindi word for "Flower"?', answer: 'फूल (Phool)' },
      { question: 'What is the Hindi word for "House"?', answer: 'घर (Ghar)' },
    ]
  };
  return sets[subType] || sets["varnamala"];
}

function generateMockGKQuestions(subType: string) {
  const sets: Record<string, { question: string; answer: string }[]> = {
    "animals": [
      { question: "Which is the largest land animal?", answer: "Elephant" },
      { question: "Which animal is known as the King of the Jungle?", answer: "Lion" },
      { question: "Which animal has a long trunk?", answer: "Elephant" },
      { question: "Which bird cannot fly but can swim well?", answer: "Penguin" },
      { question: "What is the tallest animal in the world?", answer: "Giraffe" },
      { question: "Which animal has black and white stripes?", answer: "Zebra" },
      { question: "What animal says 'Moo'?", answer: "Cow" },
      { question: "Which insect makes honey?", answer: "Bee" },
      { question: "Which animal is famous for hopping in Australia?", answer: "Kangaroo" },
      { question: "What do pandas love to eat?", answer: "Bamboo" }
    ],
    "planets": [
      { question: "Which planet is closest to the Sun?", answer: "Mercury" },
      { question: "Which planet do we live on?", answer: "Earth" },
      { question: "Which is the largest planet in our solar system?", answer: "Jupiter" },
      { question: "Which planet is known as the Red Planet?", answer: "Mars" },
      { question: "Which planet has beautiful rings around it?", answer: "Saturn" },
      { question: "What is the center of our solar system?", answer: "The Sun" },
      { question: "Is the Sun a planet or a star?", answer: "A star" },
      { question: "Which is the hottest planet in our solar system?", answer: "Venus" },
      { question: "What do we call a rock that enters Earth's atmosphere and glows?", answer: "Meteor (or shooting star)" },
      { question: "Which planet is known as the ice giant?", answer: "Uranus" }
    ]
  };
  return sets[subType] || sets["animals"];
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { subject, subType, grade, difficulty } = body;

    if (!subject || !grade || !difficulty) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const subjectLabels: Record<string, string> = {
      math: "Math",
      english: "English",
      hindi: "Hindi",
      gk: "General Knowledge"
    };
    const subjectLabel = subjectLabels[subject] || subject;
    const subTypeLabel = (subType || "").replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase());
    const gradeLabel = grade.replace(/([a-z])(\d)/, "$1 $2").replace(/\b\w/g, (c: string) => c.toUpperCase());
    const difficultyLabel = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);

    const title = `${subjectLabel}: ${subTypeLabel} Worksheet`;

    const systemPrompt = `You are an expert children's education worksheet creator. Generate age-appropriate, engaging practice questions.

RULES:
- Subject: ${subjectLabel} (${subTypeLabel})
- Grade Level: ${gradeLabel}
- Difficulty: ${difficultyLabel}
- Generate exactly 10 questions
- Each question must have a clear, single correct answer
- Questions should progressively increase in difficulty
- Use kid-friendly, encouraging language

RESPOND ONLY with valid JSON:
{
  "title": "${title}",
  "subject": "${subjectLabel}",
  "grade": "${gradeLabel}",
  "difficulty": "${difficultyLabel}",
  "questions": [
    { "question": "Question text here", "answer": "Correct answer" }
  ]
}`;

    const userPrompt = `Generate a ${difficultyLabel} ${subjectLabel} (${subTypeLabel}) worksheet for ${gradeLabel} students. Make it fun and educational with 10 questions.`;

    try {
      const result = await generateChatCompletion(systemPrompt, userPrompt, 2000);
      const worksheet = JSON.parse(result);
      return NextResponse.json(worksheet);
    } catch (error: unknown) {
      if (error instanceof Error && error.message === "MOCK_MODE") {
        let questions;
        if (subject === "math") questions = generateMockMathQuestions(subType || "addition", difficulty, grade);
        else if (subject === "hindi") questions = generateMockHindiQuestions(subType || "varnamala");
        else if (subject === "gk") questions = generateMockGKQuestions(subType || "animals");
        else questions = generateMockEnglishQuestions(subType || "missing-letters");

        return NextResponse.json({
          title,
          subject: subjectLabel,
          grade: gradeLabel,
          difficulty: difficultyLabel,
          questions,
        });
      }
      throw error;
    }
  } catch (error) {
    console.error("Worksheet generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate worksheet" },
      { status: 500 }
    );
  }
}
