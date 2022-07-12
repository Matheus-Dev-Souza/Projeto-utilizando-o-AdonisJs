'use strict'

const Project = use('App/Models/Project')

/**
 * Resourceful controller for interacting with projects
 */
class ProjectController {
  async index ({ request }) {
    const { page } = request.get()

    const projects = await Project.query().with('user')
      .paginate(page)

    return projects
  }

  async store ({ request, response, auth }) {
    const data = request.only(['title', 'description'])
    const project = await Project.create({ ...data, user_id: auth.user.id })

    return project
  }

  async show ({ params }) {
    const project = await Project.findOrFail(params.id)

    await project.load('user')
    await project.load('task')

    return project
  }

  async update ({ params, request }) {
    const project = await Project.findOrFail(params.id)
    const data = request.only(['title', 'description'])

    project.merge(data)

    await project.save()

    return project
  }

  async destroy ({ params, request, response }) {
    const project = await Project.findOrFail(params.id)
    await project.delete()
  }
}

module.exports = ProjectController
