import { randomBytes } from "crypto";

function generatePepper(length: number = 32): string {
  return randomBytes(length).toString("hex");
}

const pepper = generatePepper();
console.log("Generated pepper: ", pepper);
