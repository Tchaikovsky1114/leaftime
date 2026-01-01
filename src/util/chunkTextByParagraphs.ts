export const chunkTextByParagraphs = (text: string, maxLen = 2000): string[] => {
  const paras = text.split('\n\n');
  const chunks: string[] = [];
  let buffer = '';

  for (const para of paras) {
    if ((buffer + '\n\n' + para).length < maxLen) {
      buffer += (buffer ? '\n' : '') + para;
    } else {
      if (buffer) {chunks.push(buffer);}
      buffer = para;
    }
  }

  if (buffer) {chunks.push(buffer);}

  return chunks;
};
