import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { attachmentService } from './attachmentService'

export type AttachmentInput = Parameters<
  typeof attachmentService.createAttachment
>[0]

function attachmentsQueryKey(taskId: string) {
  return ['attachments', taskId] as const
}

export function useAttachments(taskId: string) {
  const queryClient = useQueryClient()
  const queryKey = attachmentsQueryKey(taskId)

  const { data, isLoading } = useQuery({
    queryKey,
    queryFn: () => attachmentService.listByTask(taskId),
    enabled: !!taskId,
  })

  function invalidate() {
    return queryClient.invalidateQueries({ queryKey })
  }

  const createAttachmentMutation = useMutation({
    mutationFn: async (input: AttachmentInput) =>
      attachmentService.createAttachment(input),
    onSuccess: invalidate,
  })

  const deleteAttachmentMutation = useMutation({
    mutationFn: async (id: string) => attachmentService.deleteAttachment(id),
    onSuccess: invalidate,
  })

  return {
    isLoading,
    attachments: data ?? [],
    createAttachment: createAttachmentMutation.mutateAsync,
    deleteAttachment: deleteAttachmentMutation.mutateAsync,
  }
}
