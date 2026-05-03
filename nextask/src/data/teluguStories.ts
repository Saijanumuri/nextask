import storiesData from './kiro_ready_stories.json';

export interface Story {
  id: string;
  title: string;
  titleEnglish: string;
  category: 'moral' | 'folk' | 'panchatantra' | 'tenali-rama' | 'kids' | 'ramayana' | 'mahabharata' | 'vikram-betal' | 'akbar-birbal' | 'jataka' | 'adventure' | 'mystery' | 'fantasy' | 'historical' | 'mythology' | 'science' | 'nature' | 'bedtime';
  content: string;
  moral?: string;
  duration: string;
  narrator: 'male' | 'female' | 'kid';
  audioUrl?: string;
  series?: string;
  episode?: number;
  season?: number;
}

// Import stories from JSON and ensure they match the Story interface
export const teluguStories: Story[] = storiesData.map((story: any) => ({
  id: story.id,
  title: story.title,
  titleEnglish: story.titleEnglish,
  category: story.category as Story['category'],
  content: story.content,
  moral: story.moral,
  duration: story.duration,
  narrator: story.narrator as Story['narrator'],
  audioUrl: story.audioUrl || undefined,
  series: story.series,
  episode: story.episode,
  season: story.season
}));

export const storyCategories = [
  { id: 'all', name: 'అన్నీ', nameEnglish: 'All' },
  { id: 'panchatantra', name: 'పంచతంత్రం', nameEnglish: 'Panchatantra' },
  { id: 'tenali-rama', name: 'తెనాలి రామ', nameEnglish: 'Tenali Rama' },
  { id: 'vikram-betal', name: 'విక్రమ్ బేతాళ్', nameEnglish: 'Vikram Betal' },
  { id: 'akbar-birbal', name: 'అక్బర్ బీర్బల్', nameEnglish: 'Akbar Birbal' },
  { id: 'jataka', name: 'జాతక కథలు', nameEnglish: 'Jataka Tales' },
  { id: 'ramayana', name: 'రామాయణం', nameEnglish: 'Ramayana' },
  { id: 'mahabharata', name: 'మహాభారతం', nameEnglish: 'Mahabharata' },
  { id: 'folk', name: 'జానపద కథలు', nameEnglish: 'Folk Tales' },
  { id: 'bedtime', name: 'నిద్ర కథలు', nameEnglish: 'Bedtime Stories' },
  { id: 'adventure', name: 'సాహస కథలు', nameEnglish: 'Adventure' },
  { id: 'mystery', name: 'రహస్య కథలు', nameEnglish: 'Mystery' },
  { id: 'fantasy', name: 'ఫాంటసీ కథలు', nameEnglish: 'Fantasy' },
  { id: 'historical', name: 'చారిత్రక కథలు', nameEnglish: 'Historical' },
  { id: 'science', name: 'విజ్ఞాన కథలు', nameEnglish: 'Science' },
  { id: 'nature', name: 'ప్రకృతి కథలు', nameEnglish: 'Nature' },
  { id: 'kids', name: 'పిల్లల కథలు', nameEnglish: 'Kids Stories' },
  { id: 'moral', name: 'నీతి కథలు', nameEnglish: 'Moral Stories' },
  { id: 'mythology', name: 'పురాణ కథలు', nameEnglish: 'Mythology' },
];
