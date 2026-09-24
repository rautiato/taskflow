import type { Comment } from '../models/comment'

export const COMMENTS_SEED_VERSION = '1'

export const SEEDED_COMMENTS: Comment[] = [
  {
    id: 'comment-1',
    taskId: 'task-2',
    userId: 'seed-1',
    content: `Repro'd this on staging — empty password submits a 200. Looks like the frontend validator isn't firing on blur.`,
    createdAt: '2026-09-06T14:30:00.000Z',
  },
  {
    id: 'comment-2',
    taskId: 'task-2',
    userId: 'seed-2',
    content:
      'Good catch, pushing a fix that adds a required check to the Zod schema.',
    createdAt: '2026-09-06T16:05:00.000Z',
  },
  {
    id: 'comment-3',
    taskId: 'task-5',
    userId: 'seed-3',
    content: 'Left a couple of comments on the diff, mostly nits.',
    createdAt: '2026-09-16T09:12:00.000Z',
  },
]
