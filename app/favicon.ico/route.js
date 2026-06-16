export async function GET() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192">
  <rect fill="#000000" width="192" height="192"/>
  <text x="96" y="140" font-size="120" font-weight="bold" fill="#D4AF37" text-anchor="middle" font-family="Arial, sans-serif">⚔</text>
</svg>`;

  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
