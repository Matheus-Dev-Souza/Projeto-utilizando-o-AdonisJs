'use strict'

const Task = use('App/Models/Task')

/**
 * Resourceful controller for interacting with tasks
 */
class TaskController {
  /**
   * Show a list of all tasks.
   * GET tasks
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ params }) {
    const tasks = await TaskController.query().where('project_id', params.projects_id).with('user').fetch()
    return tasks
  }

  async store ({ params, request }) {
    const data = request.only(['user_id', 'title', 'description', 'due_date', 'fil_id'])

    const task = await Task.create({ ...data, project_id: params.projects_id })

    return task
  }

  /**
   * Display a single task.
   * GET tasks/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params }) {
    const task = await Task.findOrFail(params.id)
    return task
  }

  async update ({ params, request }) {
    const task = await Task.findOrFail(params.id)
    const data = request.only(['user_id', 'title', 'description', 'due_date', 'fil_id'])

    task.merge(data)

    await task.save()
    return task
  }

  async destroy ({ params }) {
    const task = await Task.findOrFail(params.id)

    await task.delete()
  }
}

module.exports = TaskController
