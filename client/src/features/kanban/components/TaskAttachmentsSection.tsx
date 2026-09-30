import { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import type { SxProps, Theme } from '@mui/material/styles'
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined'
import { useAttachments } from '../useAttachments'
import { ImagePreviewDialog } from './ImagePreviewDialog'

const styles = {
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: 1,
  },
  noAttachments: {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    color: 'text.disabled',
  },
  noAttachmentsIcon: {
    fontSize: 18,
  },
  noAttachmentsText: {
    fontSize: 13,
  },
  attachments: {
    display: 'flex',
    gap: 1,
    flexWrap: 'wrap',
  },
  attachment: {
    width: 120,
    height: 90,
    borderRadius: 1,
    objectFit: 'cover',
    bgcolor: 'background.default',
    cursor: 'pointer',
  },
} satisfies Record<string, SxProps<Theme>>

export function TaskAttachmentsSection({ taskId }: { taskId: string }) {
  const { attachments } = useAttachments(taskId)
  const [previewIndex, setPreviewIndex] = useState<number | null>(null)

  return (
    <Box sx={styles.section}>
      <Typography variant="sectionLabel">
        Attachments
        {attachments.length > 0 ? ` (${attachments.length})` : ''}
      </Typography>
      {attachments.length === 0 ? (
        <Box
          sx={styles.noAttachments}
          data-testid="task-detail-drawer-no-attachments"
        >
          <ImageOutlinedIcon sx={styles.noAttachmentsIcon} />
          <Typography sx={styles.noAttachmentsText}>
            No attachments yet
          </Typography>
        </Box>
      ) : (
        <Box
          sx={styles.attachments}
          data-testid="task-detail-drawer-attachments"
        >
          {attachments.map((a, index) => (
            <Box
              key={a.id}
              component="img"
              src={a.blobUrl}
              alt={a.fileName}
              onClick={() => setPreviewIndex(index)}
              data-testid="task-detail-drawer-attachment"
              sx={styles.attachment}
            />
          ))}
        </Box>
      )}
      <ImagePreviewDialog
        open={previewIndex !== null}
        slides={attachments.map((a) => ({ src: a.blobUrl, alt: a.fileName }))}
        index={previewIndex ?? 0}
        onClose={() => setPreviewIndex(null)}
      />
    </Box>
  )
}
