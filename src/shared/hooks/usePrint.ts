import { useCallback } from 'react';

interface PrintItem {
  emoji: string;
  name: string;
}

interface PrintOptions {
  title: string;
  titleEmoji?: string;
  bgColor?: string;
  textColor?: string;
}

export function usePrint() {
  const print = useCallback((items: PrintItem[], options: PrintOptions) => {
    const { title, titleEmoji = '', bgColor = '#FFF9E6', textColor = '#2D2D2D' } = options;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const headerText = titleEmoji ? `${titleEmoji} ${title}` : title;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              font-family: 'Comic Sans MS', cursive, sans-serif;
              padding: 40px;
              background: ${bgColor};
            }
            h1 {
              text-align: center;
              font-size: 48px;
              margin-bottom: 40px;
              color: ${textColor};
            }
            .grid {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 30px;
              max-width: 800px;
              margin: 0 auto;
            }
            .card {
              background: white;
              border-radius: 24px;
              padding: 30px;
              text-align: center;
              box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            }
            .emoji { font-size: 80px; margin-bottom: 10px; }
            .name { font-size: 24px; font-weight: bold; color: ${textColor}; }
          </style>
        </head>
        <body>
          <h1>${headerText}</h1>
          <div class="grid">
            ${items.map(item => `
              <div class="card">
                <div class="emoji">${item.emoji}</div>
                <div class="name">${item.name}</div>
              </div>
            `).join('')}
          </div>
          <script>
            window.onload = () => { window.print(); window.close(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  }, []);

  return { print };
}
