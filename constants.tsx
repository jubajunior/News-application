
import { NewsItem } from './types';

export const MOCK_NEWS: NewsItem[] = [
  {
    id: '1',
    title: 'Bangladesh Economy Shows Resilience Amid Global Volatility',
    excerpt: 'The central bank reports a steady growth in remittances and export earnings for the second quarter...',
    content: 'Dhaka, Bangladesh - In a comprehensive report released today, the Bangladesh Bank highlighted significant gains in key economic indicators despite global headwinds. Remittances reached a record high of $2.5 billion in March, providing a critical buffer to foreign exchange reserves. Export earnings, particularly in the RMG sector, grew by 12% year-over-year. Analysts suggest that diversification of export markets has been the primary driver of this resilience.',
    category: 'Economy',
    author: 'Rahat Hassan',
    publishedAt: '2023-10-27T10:00:00Z',
    imageUrl: 'https://picsum.photos/seed/economy/1200/600',
    isBreaking: true,
    isFeatured: true,
    tags: ['Economy', 'Bangladesh', 'Export', 'RMG']
  },
  {
    id: '2',
    title: 'Dhaka Metro Rail to Expand Operations to Motijheel',
    excerpt: 'The long-awaited expansion will see commuters traveling from Uttara to the heart of the commercial district...',
    content: 'Commuters in the capital are set for a major relief as the Metro Rail authorities confirmed that the Agargaon-Motijheel segment will begin commercial operations this Sunday. This expansion is expected to cut travel time from Uttara to Motijheel to just 38 minutes, significantly bypassing the gridlocked streets below.',
    category: 'National',
    author: 'Nadia Ahmed',
    publishedAt: '2023-10-27T08:30:00Z',
    imageUrl: 'https://picsum.photos/seed/metro/800/500',
    isTrending: true,
    tags: ['Dhaka', 'Metro Rail', 'Transport']
  },
  {
    id: '3',
    title: 'Tigers Secure Victory in Opener Against Sri Lanka',
    excerpt: 'A stellar performance by the middle order guided Bangladesh to a comfortable 5-wicket win...',
    content: 'In a thrilling encounter at the Shere Bangla National Stadium, the Bangladesh national cricket team, popularly known as the Tigers, started their campaign with a bang. Shanto\'s unbeaten 75 and Taskin\'s four-wicket haul were the highlights of the match.',
    category: 'Sports',
    author: 'Sagor Islam',
    publishedAt: '2023-10-26T20:00:00Z',
    imageUrl: 'https://picsum.photos/seed/sports/800/500',
    tags: ['Cricket', 'Bangladesh', 'BCB']
  }
];

export const ADS = [
  { id: 'h1', type: 'BANNER', label: 'Top Header Ad', size: '728x90' },
  { id: 's1', type: 'SIDEBAR', label: 'Sidebar Ad', size: '300x250' }
];
