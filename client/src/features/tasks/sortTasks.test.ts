import type { TaskItem } from '../../models/task'
import { createMockTask } from '../../test/createMockTask'
import { sortTasks } from './sortTasks'

function titles(tasks: TaskItem[]) {
  return tasks.map((t) => t.title)
}

describe('sortTasks', () => {
  it('puts favorites first, even above higher priority tasks', () => {
    const task1Title = 'High priority but not favorite task'
    const task2Title = 'Low priority but favorite task'
    const notFavorite = createMockTask({ title: task1Title, priority: 'High' })
    const favorite = createMockTask({
      title: task2Title,
      priority: 'Low',
      isFavorite: true,
    })

    expect(titles(sortTasks([notFavorite, favorite]))).toEqual([
      task2Title,
      task1Title,
    ])
    expect(titles(sortTasks([favorite, notFavorite]))).toEqual([
      task2Title,
      task1Title,
    ])
  })

  it('sorts by priority from High to Low', () => {
    const task1Title = 'Low priority task'
    const task2Title = 'High priority task'
    const task3Title = 'Medium priority task'

    const tasks = [
      createMockTask({ title: task1Title, priority: 'Low' }),
      createMockTask({ title: task2Title, priority: 'High' }),
      createMockTask({ title: task3Title, priority: 'Medium' }),
    ]

    expect(titles(sortTasks(tasks))).toEqual([
      task2Title,
      task3Title,
      task1Title,
    ])
  })

  it('sorts by title A-Z when favorite and priority are the same', () => {
    const tasks = [
      createMockTask({ title: 'Charlie' }),
      createMockTask({ title: 'alpha' }),
      createMockTask({ title: 'Bravo' }),
    ]

    expect(titles(sortTasks(tasks))).toEqual(['alpha', 'Bravo', 'Charlie'])
  })

  it('applies all three rules together', () => {
    const tasks = [
      createMockTask({ title: 'B', priority: 'Low' }),
      createMockTask({ title: 'A', priority: 'Low' }),
      createMockTask({ title: 'Z', priority: 'High' }),
      createMockTask({ title: 'Y', priority: 'Medium', isFavorite: true }),
      createMockTask({ title: 'X', priority: 'High', isFavorite: true }),
    ]

    expect(titles(sortTasks(tasks))).toEqual(['X', 'Y', 'Z', 'A', 'B'])
  })

  it('returns a new array and leaves the input unchanged', () => {
    const tasks = [
      createMockTask({ title: 'Low', priority: 'Low' }),
      createMockTask({ title: 'High', priority: 'High' }),
    ]

    const sorted = sortTasks(tasks)

    expect(sorted).not.toBe(tasks)
    expect(titles(tasks)).toEqual(['Low', 'High'])
  })
})
