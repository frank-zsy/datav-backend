import { existsSync, createReadStream } from 'fs';
import { createInterface } from 'readline';

export async function readline(filePath: string, onLine: (line: string, index: number) => Promise<void>): Promise<void> {
  return new Promise(async resolve => {
    if (!existsSync(filePath)) {
      resolve();
    }
    const fileStream = createReadStream(filePath);

    const rl = createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    let lineCount = 0;
    for await (const line of rl) {
      lineCount++;
      await onLine(line, lineCount);
    }

    resolve();
  });
}
