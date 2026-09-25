import { useImperativeHandle, useState, type DragEvent, type Ref } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import CloseIcon from '@mui/icons-material/Close'
import AddIcon from '@mui/icons-material/Add'
import {
  fileToDataUrl,
  MAX_ATTACHMENT_BYTES,
} from '../../../utils/fileToDataUrl'
import { useAttachments } from '../useAttachments'
import { ImagePreviewDialog } from './ImagePreviewDialog'
import type { Attachment } from '../../../models/attachment'

type StagedAttachment =
  | { kind: 'existing'; id: string; fileName: string; blobUrl: string }
  | { kind: 'new'; localId: string; fileName: string; blobUrl: string }

export type AttachmentPickerHandle = {
  commit: () => Promise<void>
}

export function AttachmentPicker({
  taskId,
  initialAttachments,
  ref,
}: {
  taskId: string
  initialAttachments: Attachment[]
  ref?: Ref<AttachmentPickerHandle>
}) {
  const { createAttachment, deleteAttachment } = useAttachments(taskId)
  const [attachments, setAttachments] = useState<StagedAttachment[]>(() =>
    initialAttachments.map((a) => ({
      kind: 'existing' as const,
      id: a.id,
      fileName: a.fileName,
      blobUrl: a.blobUrl,
    })),
  )
  const [error, setError] = useState<string | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [previewIndex, setPreviewIndex] = useState<number | null>(null)

  useImperativeHandle(ref, () => ({
    async commit() {
      const toCreate = attachments.filter(
        (a): a is Extract<StagedAttachment, { kind: 'new' }> =>
          a.kind === 'new',
      )
      const removedIds = initialAttachments
        .filter(
          (existing) =>
            !attachments.some(
              (a) => a.kind === 'existing' && a.id === existing.id,
            ),
        )
        .map((a) => a.id)

      await Promise.all([
        ...toCreate.map((a) =>
          createAttachment({
            taskId,
            fileName: a.fileName,
            blobUrl: a.blobUrl,
          }),
        ),
        ...removedIds.map((id) => deleteAttachment(id)),
      ])
    },
  }))

  async function handleFiles(fileList: FileList | null) {
    if (!fileList) return
    setError(null)
    const files = Array.from(fileList)
    const tooLarge = files.find((f) => f.size > MAX_ATTACHMENT_BYTES)
    if (tooLarge) {
      setError(`"${tooLarge.name}" is over the 2 MB limit.`)
      return
    }
    const added: StagedAttachment[] = await Promise.all(
      files.map(async (file) => ({
        kind: 'new' as const,
        localId: crypto.randomUUID(),
        fileName: file.name,
        blobUrl: await fileToDataUrl(file),
      })),
    )
    setAttachments((prev) => [...prev, ...added])
  }

  function handleRemove(target: StagedAttachment) {
    setAttachments((prev) =>
      prev.filter((a) => {
        if (a.kind === 'existing' && target.kind === 'existing') {
          return a.id !== target.id
        }
        if (a.kind === 'new' && target.kind === 'new') {
          return a.localId !== target.localId
        }
        return true
      }),
    )
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setIsDragOver(false)
    handleFiles(event.dataTransfer.files)
  }

  return (
    <>
      <Box
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragOver(true)
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          borderRadius: 1.5,
          outline: isDragOver ? '2px dashed' : 'none',
          outlineColor: 'primary.main',
          outlineOffset: 4,
        }}
      >
        <Typography
          sx={{
            fontSize: 12,
            fontWeight: 700,
            color: 'text.secondary',
            textTransform: 'uppercase',
          }}
        >
          Attachment
        </Typography>

        {attachments.map((a, index) => (
          <Box
            key={a.kind === 'existing' ? a.id : a.localId}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              border: 1,
              borderColor: 'divider',
              borderRadius: 1.5,
              px: 1.5,
              py: 1,
            }}
          >
            <Box
              component="img"
              src={a.blobUrl}
              alt=""
              onClick={() => setPreviewIndex(index)}
              sx={{
                width: 46,
                height: 46,
                borderRadius: 1,
                objectFit: 'cover',
                bgcolor: 'background.default',
                flexShrink: 0,
                cursor: 'pointer',
              }}
            />
            <Typography sx={{ fontSize: 13, flexGrow: 1 }} noWrap>
              {a.fileName}
            </Typography>
            <IconButton size="small" onClick={() => handleRemove(a)}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        ))}

        <Button
          component="label"
          variant="text"
          size="small"
          startIcon={<AddIcon />}
          sx={{ alignSelf: 'flex-start' }}
        >
          Drag & drop or click to add
          <input
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={(e) => {
              handleFiles(e.target.files)
              e.target.value = ''
            }}
          />
        </Button>
        {error && (
          <Typography sx={{ fontSize: 12, color: 'error.main' }}>
            {error}
          </Typography>
        )}
      </Box>
      <ImagePreviewDialog
        open={previewIndex !== null}
        slides={attachments.map((a) => ({ src: a.blobUrl, alt: a.fileName }))}
        index={previewIndex ?? 0}
        onClose={() => setPreviewIndex(null)}
      />
    </>
  )
}
