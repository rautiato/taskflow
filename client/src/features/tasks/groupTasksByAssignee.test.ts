import type { UserDto } from '../../models/user'
import { createMockTask } from '../../test/createMockTask'
import { groupTasksByAssignee } from './groupTasksByAssignee'

function createMockUser(id: string, name: string): UserDto {
  return {
    id,
    name,
    email: `${id}@example.com`,
    role: 'Member',
    avatarUrl: `https://example.com/${id}.png`,
    createdAt: '2026-01-01T00:00:00.000Z',
  }
}

const users = [
  createMockUser('haId', 'Ha'),
  createMockUser('rautiatoId', 'Rautiato'),
  createMockUser('hanaId', 'Hana'), // has no tasks
]

describe('groupTasksByAssignee', () => {
  const tasks = [
    createMockTask({ title: 'Unassigned task', assigneeId: null }),
    createMockTask({
      title: 'Rautiato low',
      assigneeId: 'rautiatoId',
      priority: 'Low',
    }),
    createMockTask({
      title: 'Rautiato high',
      assigneeId: 'rautiatoId',
      priority: 'High',
    }),
    createMockTask({
      title: 'Rautiato done',
      assigneeId: 'rautiatoId',
      columnId: 'done',
    }),
    createMockTask({ title: 'Ha task', assigneeId: 'haId' }),
  ]

  it('sorts lanes by name, with the Unassigned lane last', () => {
    const lanes = groupTasksByAssignee(tasks, users)

    expect(lanes.map((lane) => lane.assigneeName)).toEqual([
      'Ha',
      'Rautiato',
      'Unassigned',
    ])
  })

  it('only creates lanes for assignees that have tasks', () => {
    const lanes = groupTasksByAssignee(tasks, users)

    expect(lanes.map((lane) => lane.assigneeId)).not.toContain('hanaId')
  })

  it('gives the Unassigned lane a null id and no avatar', () => {
    const unassigned = groupTasksByAssignee(tasks, users).at(-1)

    expect(unassigned).toMatchObject({
      assigneeId: null,
      assigneeName: 'Unassigned',
      assigneeAvatarUrl: null,
      taskCount: 1,
    })
  })

  it('groups each lane by column and sorts the tasks in each column', () => {
    const rautiato = groupTasksByAssignee(tasks, users).find(
      (lane) => lane.assigneeId === 'rautiatoId',
    )!

    expect(rautiato.taskCount).toBe(3)
    expect(rautiato.tasksByColumn.todo.map((t) => t.title)).toEqual([
      'Rautiato high',
      'Rautiato low',
    ])
    expect(rautiato.tasksByColumn.done.map((t) => t.title)).toEqual([
      'Rautiato done',
    ])
  })

  it('returns no lanes when there are no tasks', () => {
    expect(groupTasksByAssignee([], users)).toEqual([])
  })
})
