'use strict'
const moment = require('moment')
const crypto = require('crypto')
const User = use('App/Models/User')
const Mail = use('Mail')

class ForgotPasswordController {
  async store ({ request, response }) {
    try {
      // input busca um unico campo/valor na requisição.
      const email = request.input('email')
      // findByOrFail caso não encontre o usuário retorna um erro para cair no catch.
      const user = await User.findByOrFail('email', email)

      user.token = crypto.randomBytes(10).toString('hex')
      user.token_created_at = new Date()

      await user.save()

      // ENVIANDO E-MAIL PARA RECUPERAÇÃO DE SENHA.
      await Mail.send(
        ['emails.forgot_password'],
        { email, token: user.token, link: `${request.input('redirect_url')}?token=${user.token}` },
        message => {
          message
            .to(user.email)
            .from('rodrigo.rgtic@gmail.com', 'Rodrigo | RgTic')
            .subject('Recuperação de senha')
        }
      )
    } catch (error) {
      return response.status(error.status).send({ error: { message: 'Algo não deu certo, esse e-mail existe?' } })
    }
  }

  async update ({ request, response }) {
    try {
      const { token, password } = request.all()

      const user = await User.findByOrFail('token', token)
      const tokekExpired = moment().subtract('2', 'days').isAfter(user.token_created_at)

      if (tokekExpired) {
        return response.status(401).send({ error: { message: 'O token de recuperação está expirado' } })
      }

      user.token = null
      user.token_created_at = null
      user.password = password

      await user.save()
    } catch (error) {
      return response.status(error.status).send({ error: { message: 'Algo não deu certo ao resetar sua senha' } })
    }
  }
}

module.exports = ForgotPasswordController
