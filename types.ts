export type Language = 'bn' | 'en' | 'ar';

export interface Translations {
  home: string;
  latestNews: string;
  breaking: string;
  trending: string;
  mostRead: string;
  search: string;
  login: string;
  portal: string;
  mission: string;
  archive: string;
  stayUpdated: string;
  newsletterDesc: string;
  joinNewsletter: string;
  publicOpinion: string;
  voteSuccess: string;
  by: string;
  readMore: string;
  backToTop: string;
  categories: Record<string, string>;
}

export enum AdPosition {
  HEADER = 'Header',
  SIDEBAR = 'Sidebar',
  IN_CONTENT = 'In-Content'
}

export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  publishedAt: string;
  imageUrl: string;
  isBreaking?: boolean;
  isFeatured?: boolean;
  isTrending?: boolean;
  tags: string[];
}

export interface PollOption {
  label: string;
  votes: number;
}

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  isActive: boolean;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  role: 'ADMIN' | 'EDITOR' | 'REPORTER';
  email?: string;
  bio?: string;
  avatarUrl?: string;
  designation?: string;
  socialLinks?: {
    twitter?: string;
    facebook?: string;
    linkedin?: string;
  };
}

export interface SiteSettings {
  siteName: string;
  siteTagline: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  isMaintenanceMode: boolean;
  enableAiSummaries: boolean;
  breakingNewsCount: number;
  categories: string[];
}

export interface Comment {
  id: string;
  articleId: string;
  authorName: string;
  authorEmail: string;
  content: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface Advertisement {
  id: string;
  label: string;
  position: AdPosition;
  imageUrl: string;
  linkUrl: string;
  isActive: boolean;
  createdAt: string;
}