import sharp from "sharp";
import { readFileSync, mkdirSync } from "fs";

const svg = readFileSync("public/icon.svg");
const tamanhos = [72, 96, 128, 144, 152, 192, 384, 512];

mkdirSync("public/icons", { recursive: true });

for (const t of tamanhos) {
    await sharp(svg).resize(t, t).png().toFile(`public/icons/icon-${t}x${t}.png`);
    console.log(`✓ icon-${t}x${t}.png`);
}

await sharp(svg).resize(180, 180).png().toFile("public/apple-touch-icon.png");
console.log("✓ apple-touch-icon.png");

await sharp(svg).resize(32, 32).png().toFile("public/favicon.ico");
console.log("✓ favicon.ico");