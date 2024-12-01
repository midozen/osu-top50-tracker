import nodeHtmlToImage from "node-html-to-image";
import fs from "fs";
import path from "path";
import { ChangedUser } from "../types/general";




// main();
// nodeHtmlToImage({
//     output: './image.png',
//     html,
//     content: {
//         name: 'John Doe',
//         rank: 3,
//         pp: 1234
//     }
//   })
//     .then(() => console.log('The image was created successfully!'))

export async function renderLeaderboard(users: ChangedUser[]) {
  const html = fs.readFileSync(path.resolve(__dirname, '../assets/rankings.html'), 'utf8');

  const render = await nodeHtmlToImage({
    output: './image.png',
    html,
    content: {
      users
    }
  });

  // console.log render as base64
  console.log(render);
}

export function flagUrl(countryCode: string) {
  const chars = Array.from(countryCode);
  const hexEmojiChars = chars.map(chr => 
      ((chr.codePointAt(0) ?? 0) + 127397).toString(16)
  );
  const baseFileName = hexEmojiChars.join('-');
  return `/assets/images/flags/${baseFileName}.svg`;
}