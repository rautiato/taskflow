import type { Comment } from '../../models/comment'
import {
  SEEDED_COMMENTS,
  COMMENTS_SEED_VERSION,
} from '../../mockData/comments.seed'
import { loadSeededData } from '../../services/localStorageSeed'

const COMMENTS_KEY = 'taskflow.comments'

function loadComments(): Comment[] {
  return loadSeededData(COMMENTS_KEY, COMMENTS_SEED_VERSION, SEEDED_COMMENTS)
}

function saveComments(comments: Comment[]): void {
  localStorage.setItem(COMMENTS_KEY, JSON.stringify(comments))
}

function listByTask(taskId: string): Comment[] {
  return loadComments()
    .filter((c) => c.taskId === taskId)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
}

type CommentInput = {
  taskId: string
  userId: string
  content: string
}

function createComment(input: CommentInput): Comment {
  const allComments = loadComments()
  const comment: Comment = {
    id: crypto.randomUUID(),
    ...input,
    createdAt: new Date().toISOString(),
  }
  saveComments([...allComments, comment])
  return comment
}

type CommentUpdateInput = {
  id: string
  content: string
}

function updateComment({ id, content }: CommentUpdateInput): Comment {
  const allComments = loadComments()
  const index = allComments.findIndex((c) => c.id === id)
  if (index === -1) throw new Error(`Comment not found: ${id}`)
  const updated: Comment = {
    ...allComments[index],
    content,
    updatedAt: new Date().toISOString(),
  }
  const nextComments = [...allComments]
  nextComments[index] = updated
  saveComments(nextComments)
  return updated
}

function deleteComment(id: string): void {
  const allComments = loadComments()
  saveComments(allComments.filter((c) => c.id !== id))
}

export const commentService = {
  listByTask,
  createComment,
  updateComment,
  deleteComment,
}
