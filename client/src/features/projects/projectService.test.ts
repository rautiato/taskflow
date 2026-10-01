import { PROJECT_NAME_MAX_LENGTH, projectService } from './projectService'

describe('projectService.createProject', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it(`accepts a name of exactly ${PROJECT_NAME_MAX_LENGTH} characters`, () => {
    const name = 'a'.repeat(PROJECT_NAME_MAX_LENGTH)

    const project = projectService.createProject({ name })

    expect(project.name).toBe(name)
    expect(projectService.listProjects()).toContainEqual(
      expect.objectContaining({ id: project.id }),
    )
  })

  it(`rejects a name longer than ${PROJECT_NAME_MAX_LENGTH} characters and saves nothing`, () => {
    const countBefore = projectService.listProjects().length
    expect(() =>
      projectService.createProject({
        name: 'a'.repeat(PROJECT_NAME_MAX_LENGTH + 1),
      }),
    ).toThrow(
      `Project names can be up to ${PROJECT_NAME_MAX_LENGTH} characters.`,
    )
    expect(projectService.listProjects()).toHaveLength(countBefore)
  })

  it('starts a new project as Active, with initials from its first two words', () => {
    const project = projectService.createProject({
      name: 'mobile app redesign',
    })

    expect(project.status).toBe('Active')
    expect(project.initials).toBe('MA')
  })
})
