// scripts/check-branch.js
const branch = process.env.VERCEL_GIT_COMMIT_REF;

if (branch !== "producao") {
  console.log(`🛑 Ignorando build - branch atual: ${branch}`);
  process.exit(0); // ignora build
}

console.log(`🚀 Build permitido na branch ${branch}`);
