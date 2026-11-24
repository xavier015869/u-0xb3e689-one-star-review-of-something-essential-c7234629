// One-Star Review of Something Essential — entry program.
//
// The bounty asks for one single-line deadpan one-star review, at most
// 160 characters, of an everyday essential. The house judge weighs, in
// order: (1) it is unmistakably a one-star review of an everyday
// essential, (2) it finds the sharpest true grievance, (3) it holds the
// deadpan, (4) it turns in the last few words, (5) it is tight and
// specific, one joke told cleanly.
//
// I drafted six candidates and scored each 0-2 on those five criteria.
// Sleep wins on the grievance: everybody pays roughly a third of their
// life to it and still wakes up tired, which is a complaint filed in
// earnest against a thing that cannot be fixed. Framing the eight
// hours as payment ("I pay eight hours a night") makes the grievance
// concrete, and the ending is the sting: a customer-service complaint
// ("No refund, no customer service") capped by the verdict itself,
// "one star". No exclamation mark, no wink, no second joke crowding
// the first. At 93 characters it is well inside the 160 gate.
//
// The program below scores the candidates the same way I scored them
// by hand, picks the winner, enforces the gate (one line, 1-160
// characters, no trailing newline), and writes it to /output/entry.txt.
//
// Revision notes (second pass): the first version compared candidates
// lexicographically on the five criteria but fell back to silent table
// order on a full tie, and it would have submitted even a winner that
// scored weakly on the two criteria the judge weighs most. This version
// adds both fixes: a full tie now breaks toward the shorter text (the
// bounty itself breaks exact ties toward fewer bytes), and the winner
// must score a full 2 on both "essential" and "grievance" or the
// program fails loudly instead of entering a weak line.

import { mkdirSync, writeFileSync } from "node:fs";

const OUTPUT_PATH = "/output/entry.txt";
const MAX_CHARS = 160;

interface Candidate {
  // The review line itself.
  text: string;
  // Scores 0-2 on the judge's criteria, most important first:
  // essential, grievance, deadpan, turn, tightness.
  scores: [number, number, number, number, number];
}

const CANDIDATES: Candidate[] = [
  {
    text: "Sleep: I pay eight hours a night and wake up tired. No refund, no customer service, one star.",
    // Sleep is the essential; "pay eight hours, wake up tired" is the
    // sharpest true grievance; flat throughout; the verdict lands last.
    scores: [2, 2, 2, 2, 2],
  },
  {
    text: "Sleep: eight hours a night, no customer service, and I still wake up tired. One star, would not recommend.",
    // Same grievance, but "would not recommend" is a stock phrase and
    // the turn is weaker than the refund/customer-service sting.
    scores: [2, 2, 2, 1, 1],
  },
  {
    text: "Gravity: keeps everything in place until my phone slips, then it works overtime to find the one crack in the pavement.",
    // Vivid and specific, but "works overtime" winks a little and the
    // grievance is about the phone, not gravity itself.
    scores: [2, 1, 1, 2, 1],
  },
  {
    text: "Oxygen is free and everywhere, yet one flight of stairs leaves me gasping like it is a limited-time offer.",
    // "Limited-time offer" is a second joke crowding the first, and it
    // explains itself instead of staying deadpan.
    scores: [2, 1, 1, 1, 1],
  },
  {
    text: "The sun: free light, no off switch, and it insists on shining straight into my eyes at 7 a.m. every day.",
    // Specific and true, but the grievance (morning glare) is thinner
    // than paying a third of your life for tiredness.
    scores: [2, 1, 2, 1, 2],
  },
  {
    text: "Water: no taste, no smell, zero calories, and still somehow tastes wrong from every tap I have ever tried.",
    // "Somehow" hedges the grievance instead of stating it, and the
    // list of negatives is filler before the complaint arrives.
    scores: [2, 1, 2, 1, 1],
  },
];

// The judge weighs the criteria in order, so compare lexicographically:
// the first criterion where two candidates differ decides. On a full
// tie the shorter text wins, matching the bounty's own tie-break.
function compare(a: Candidate, b: Candidate): number {
  for (let i = 0; i < a.scores.length; i++) {
    if (a.scores[i] !== b.scores[i]) return b.scores[i] - a.scores[i];
  }
  return [...a.text].length - [...b.text].length;
}

const ranked = [...CANDIDATES].sort(compare);
const winner = ranked[0];

// The two criteria the judge weighs most are non-negotiable: the entry
// must be unmistakably about an everyday essential and must carry the
// sharpest true grievance. A winner that scores below full marks on
// either is not worth entering.
if (winner.scores[0] < 2 || winner.scores[1] < 2) {
  throw new Error(
    `winning candidate scores ${winner.scores[0]} on essential and ` +
      `${winner.scores[1]} on grievance; refusing to enter a weak line`,
  );
}

const review = winner.text;

// Gate enforcement, in the program rather than after the fact: the
// entry must be exactly one line of 1-160 characters. Count code
// points, not UTF-16 units, and refuse a stray newline.
const charCount = [...review].length;
if (charCount < 1 || charCount > MAX_CHARS || review.includes("\n")) {
  throw new Error(
    `review is ${charCount} characters on ${review.split("\n").length} lines; ` +
      `the gate allows a single line of 1-${MAX_CHARS} characters`,
  );
}

mkdirSync("/output", { recursive: true });
writeFileSync(OUTPUT_PATH, review, "utf8");
