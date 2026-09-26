import type { Attachment } from '../../models/attachment'
import {
  SEEDED_ATTACHMENTS,
  ATTACHMENTS_SEED_VERSION,
} from '../../mockData/attachments.seed'
import { loadSeededData } from '../../services/localStorageSeed'
import { writeJson } from '../../services/storage'

const ATTACHMENTS_KEY = 'taskflow.attachments'

function loadAttachments(): Attachment[] {
  return loadSeededData(
    ATTACHMENTS_KEY,
    ATTACHMENTS_SEED_VERSION,
    SEEDED_ATTACHMENTS,
  )
}

function saveAttachments(attachments: Attachment[]): void {
  writeJson(ATTACHMENTS_KEY, attachments)
}

function listByTask(taskId: string): Attachment[] {
  return loadAttachments().filter((a) => a.taskId === taskId)
}

type AttachmentInput = {
  taskId: string
  fileName: string
  blobUrl: string
}

function createAttachment(input: AttachmentInput): Attachment {
  const all = loadAttachments()
  const attachment: Attachment = { id: crypto.randomUUID(), ...input }
  saveAttachments([...all, attachment])
  return attachment
}

function deleteAttachment(id: string): void {
  saveAttachments(loadAttachments().filter((a) => a.id !== id))
}

function deleteByTask(taskId: string): void {
  saveAttachments(loadAttachments().filter((a) => a.taskId !== taskId))
}

export const attachmentService = {
  listByTask,
  createAttachment,
  deleteAttachment,
  deleteByTask,
}
