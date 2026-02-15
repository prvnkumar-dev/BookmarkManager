import Bookmark from './models/bookmark.js'

const seeds = [
  {
    url: 'https://react.dev',
    title: 'React',
    description: 'The React documentation',
    tags: ['javascript', 'library']
  },
  {
    url: 'https://vite.dev',
    title: 'Vite',
    description: 'Next generation frontend tooling',
    tags: ['build', 'tooling']
  },
  {
    url: 'https://developer.mozilla.org',
    title: 'MDN Web Docs',
    description: 'Resources for developers, by developers',
    tags: ['reference', 'docs']
  },
  {
    url: 'https://news.ycombinator.com',
    title: 'Hacker News',
    description: 'Technology and startup news',
    tags: ['news']
  },
  {
    url: 'https://stackoverflow.com',
    title: 'Stack Overflow',
    description: 'Programming Q&A',
    tags: ['community', 'help']
  }
]

export default async function seedIfEmpty() {
  const cnt = await Bookmark.countDocuments()
  if (cnt === 0) {
    await Bookmark.insertMany(seeds)
    console.log('Seeded bookmarks')
  }
}
