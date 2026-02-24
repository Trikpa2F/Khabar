import { NextResponse } from 'next/server';
import Parser from 'rss-parser';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');
    const start = searchParams.get('start');
    const end = searchParams.get('end');

    if (!q) {
        return NextResponse.json({ error: 'Missing query parameter q' }, { status: 400 });
    }

    let searchQuery = q;
    if (start) searchQuery += ` after:${start}`;
    if (end) searchQuery += ` before:${end}`;

    try {
        const parser = new Parser();
        const url = `https://news.google.com/rss/search?q=${encodeURIComponent(searchQuery)}&hl=fr&gl=FR&ceid=FR:fr`;
        const feed = await parser.parseURL(url);

        const articles = feed.items.slice(0, 5).map(item => ({
            title: item.title,
            link: item.link,
            pubDate: item.pubDate,
            source: item.creator || 'Revue de presse'
        }));

        return NextResponse.json({ articles });
    } catch (error) {
        console.error('RSS parse error:', error);
        return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
    }
}
