'use strict'

const Database = use('Database')
const User = use('App/Models/User')

class UserController {
  async store ({ request }) {
    // ctx: é o contexto da requisição. Dentro dele tem o request e response. Mas, vou desestruturas.

    const data = request.only(['username', 'email', 'password'])
    const addresses = request.input('addresses')

    const trx = await Database.beginTransaction()

    const user = await User.create(data, trx)
    await user.addresses().createMany(addresses, trx)

    await trx.commit()

    // Sempre que algo retorna do controller, o Adonis sabe que tem que fazer um return JSON automaticamente.
    return user
  }
}

module.exports = UserController
