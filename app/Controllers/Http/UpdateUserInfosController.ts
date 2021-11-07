// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User';
import Hash from '@ioc:Adonis/Core/Hash';
export default class UpdateUserInfosController {
  public async index({ request, response, params }) {
    const id = params.id;
    const { email, name, password, newPassword } = request.only([
      'email',
      'name',
      'password',
      'newPassword',
    ]);

    // looking for user in DB
    const user = await User.findByOrFail('id', id);

    // checking if old password informed is correct
    const passwordCheck = await Hash.verify(password, user.password);

    if (!passwordCheck) {
      return response.status(400).send({ message: { error: 'Incorrect password provided' } });
    }

    // updating user data
    user.email = email;
    user.name = name;
    user.password = newPassword;

    // persisting new data (saving)
    await user.save();
    return response.status(201).send({ message: 'success' });
  }
}
