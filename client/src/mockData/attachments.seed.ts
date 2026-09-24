import type { Attachment } from '../models/attachment'

export const ATTACHMENTS_SEED_VERSION = '1'

function placeholderImage(label: string, bg: string, fg: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="160"><rect width="240" height="160" fill="${bg}"/><text x="50%" y="50%" font-family="sans-serif" font-size="14" fill="${fg}" text-anchor="middle" dominant-baseline="middle">${label}</text></svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

export const SEEDED_ATTACHMENTS: Attachment[] = [
  {
    id: 'attachment-1',
    taskId: 'task-1',
    fileName: 'homepage-mockup.png',
    blobUrl: placeholderImage('homepage-mockup.png', '#E8F0FE', '#1976D2'),
  },
  {
    id: 'attachment-2',
    taskId: 'task-2',
    fileName: 'repro-screenshot.png',
    blobUrl: placeholderImage('repro-screenshot.png', '#FDECEA', '#D32F2F'),
  },
  {
    id: 'attachment-3',
    taskId: 'task-2',
    fileName: 'network-log.png',
    blobUrl: placeholderImage('network-log.png', '#FFF4E5', '#ED6C02'),
  },
]
