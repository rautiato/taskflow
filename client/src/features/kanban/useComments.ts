import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { commentService } from './commentService'

export type CommentInput = Parameters<typeof commentService.createComment>[0]

function commentsQueryKey(taskId: string) {
  return ['comments', taskId] as const
}

export function useComments(taskId: string) {
  const queryClient = useQueryClient()
  const queryKey = commentsQueryKey(taskId)

  const { data, isLoading } = useQuery({
    queryKey,
    queryFn: () => commentService.listByTask(taskId),
    enabled: !!taskId,
  })

  const createCommentMutation = useMutation({
    mutationFn: async (input: CommentInput) =>
      commentService.createComment(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  })

  return {
    isLoading,
    comments: data ?? [],
    createComment: createCommentMutation.mutate,
    isPosting: createCommentMutation.isPending,
  }
}
