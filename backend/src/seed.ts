import "dotenv";
import mongoose from "mongoose";

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/snippet-vault";

const SnippetSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    tags: { type: [String], default: [] },
    type: { type: String, enum: ["link", "note", "command"], required: true },
  },
  { timestamps: true },
);

SnippetSchema.index({ title: "text", content: "text" });
SnippetSchema.index({ tags: 1 });

const Snippet = mongoose.model("Snippet", SnippetSchema);

const seeds = [
  // --- COMMANDS ---
  {
    title: "Docker: видалити всі зупинені контейнери",
    content: "docker container prune -f",
    tags: ["docker", "cleanup", "devops"],
    type: "command",
  },
  {
    title: "Docker: повне очищення системи",
    content: "docker system prune -af --volumes",
    tags: ["docker", "cleanup", "devops"],
    type: "command",
  },
  {
    title: "Git: скасувати останній коміт (зберегти зміни)",
    content: "git reset --soft HEAD~1",
    tags: ["git", "undo"],
    type: "command",
  },
  {
    title: "Git: видалити злиті гілки",
    content:
      'git branch --merged | grep -v "\\*\\|main\\|master\\|develop" | xargs -n 1 git branch -d',
    tags: ["git", "cleanup", "branches"],
    type: "command",
  },
  {
    title: "SSH: скопіювати публічний ключ на сервер",
    content: "ssh-copy-id -i ~/.ssh/id_rsa.pub user@server",
    tags: ["ssh", "linux", "devops"],
    type: "command",
  },
  {
    title: "npm: перевірити застарілі залежності",
    content: "npm outdated",
    tags: ["npm", "node", "dependencies"],
    type: "command",
  },
  {
    title: "Kill процес на порту",
    content: "lsof -ti:3000 | xargs kill -9",
    tags: ["linux", "network", "process"],
    type: "command",
  },
  {
    title: "MongoDB: дамп бази даних",
    content: 'mongodump --uri="mongodb://localhost:27017/mydb" --out=./backup',
    tags: ["mongodb", "backup", "devops"],
    type: "command",
  },

  // --- LINKS ---
  {
    title: "TypeScript Handbook",
    content: "https://www.typescriptlang.org/docs/handbook/intro.html",
    tags: ["typescript", "docs", "learning"],
    type: "link",
  },
  {
    title: "NestJS офіційна документація",
    content: "https://docs.nestjs.com",
    tags: ["nestjs", "docs", "backend"],
    type: "link",
  },
  {
    title: "Next.js App Router docs",
    content: "https://nextjs.org/docs/app",
    tags: ["nextjs", "docs", "frontend"],
    type: "link",
  },
  {
    title: "Tailwind CSS утиліти — cheatsheet",
    content: "https://nerdcave.com/tailwind-cheat-sheet",
    tags: ["tailwind", "css", "frontend", "cheatsheet"],
    type: "link",
  },
  {
    title: "Mongoose схеми та типи",
    content: "https://mongoosejs.com/docs/schematypes.html",
    tags: ["mongoose", "mongodb", "docs"],
    type: "link",
  },
  {
    title: "class-validator декоратори",
    content:
      "https://github.com/typestack/class-validator#validation-decorators",
    tags: ["nestjs", "validation", "typescript"],
    type: "link",
  },
  {
    title: "Regex101 — онлайн тестування регулярок",
    content: "https://regex101.com",
    tags: ["regex", "tools", "utility"],
    type: "link",
  },
  {
    title: "Can I use — підтримка CSS/JS у браузерах",
    content: "https://caniuse.com",
    tags: ["css", "browser", "compatibility", "frontend"],
    type: "link",
  },

  // --- NOTES ---
  {
    title: "HTTP статус-коди — шпаргалка",
    content: `200 OK — успішний запит
201 Created — ресурс створено (POST)
204 No Content — успіх без тіла (DELETE)
400 Bad Request — помилка валідації
401 Unauthorized — не авторизований
403 Forbidden — немає доступу
404 Not Found — ресурс не знайдено
409 Conflict — конфлікт (дублікат)
422 Unprocessable Entity — семантична помилка
500 Internal Server Error — помилка сервера`,
    tags: ["http", "api", "cheatsheet"],
    type: "note",
  },
  {
    title: "NestJS структура модуля — нотатка",
    content: `Кожен модуль NestJS складається з:
- Module — декларує imports/exports/providers/controllers
- Controller — обробляє HTTP-запити, делегує бізнес-логіку
- Service — бізнес-логіка, інжектується через DI
- DTO — об'єкти передачі даних з валідацією
- Schema — Mongoose-схема для MongoDB

Правило: контролер не звертається до бази напряму — тільки через сервіс.`,
    tags: ["nestjs", "architecture", "backend"],
    type: "note",
  },
  {
    title: "Git Flow — коротка шпаргалка",
    content: `main — стабільна продакшн гілка
develop — гілка розробки
feature/xxx — нова функціональність
hotfix/xxx — термінове виправлення в main
release/xxx — підготовка релізу

Типові префікси комітів:
feat: — нова фіча
fix: — виправлення
chore: — рутина (оновлення залежностей)
docs: — документація
refactor: — рефакторинг без зміни поведінки`,
    tags: ["git", "workflow", "cheatsheet"],
    type: "note",
  },
  {
    title: "MongoDB індекси — коли і навіщо",
    content: `Text index — для пошуку по рядках:
  { title: "text", content: "text" }
  Запит: { $text: { $search: "docker" } }

Compound index — для сортування + фільтру:
  { createdAt: -1, type: 1 }

Sparse index — лише для документів де поле існує:
  { deletedAt: 1 }, { sparse: true }

Важливо: не більше 1 text-індексу на колекцію.`,
    tags: ["mongodb", "database", "performance"],
    type: "note",
  },
  {
    title: "React хуки — коли що використовувати",
    content: `useState — локальний стан компонента
useEffect — сайд-ефекти (fetch, підписки)
useCallback — мемоізація функцій (щоб не ре-рендерити дочірні)
useMemo — мемоізація обчислень
useRef — доступ до DOM або збереження значення без ре-рендеру
useContext — доступ до контексту без пропсів
useReducer — складний стан з кількома діями

Правило: не оптимізуй передчасно — useCallback/useMemo тільки якщо є проблема.`,
    tags: ["react", "hooks", "frontend", "cheatsheet"],
    type: "note",
  },
];

async function seed() {
  try {
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected");

    console.log("Clearing existing snippets...");
    await Snippet.deleteMany({});

    console.log(`Seeding ${seeds.length} snippets...`);
    await Snippet.insertMany(seeds);

    const count = await Snippet.countDocuments();
    console.log(`Done! ${count} snippets in the database.`);

    await mongoose.disconnect();
    console.log(" Disconnected");
  } catch (err) {
    console.error(" Seed failed:", err);
    process.exit(1);
  }
}

seed();
