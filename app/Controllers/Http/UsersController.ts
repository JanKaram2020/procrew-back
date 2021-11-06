import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import User from 'App/Models/User';

export default class UsersController {
  public async index() {
    return await User.all();
  }
  public async store({ request, response }: HttpContextContract) {
    const user = await User.create(request.body());
    response.status(201);
    return user;
  }
  public async show({ params }: HttpContextContract) {
    return await User.findByOrFail('id', params.id);
  }
  public async update({ params, request }: HttpContextContract) {
    const body = request.body();
    const user = await User.findByOrFail('id', params.id);
    user.name = body.name;
    user.password = body.password;
    user.email = body.email;
    return user.save();
  }
  public async destroy({ params }: HttpContextContract) {
    const user = await User.findByOrFail('id', params.id);
    return user.delete();
  }
  public async pagination({ params }: HttpContextContract) {
    const page = params.page ? params.page : 1;
    const limit = params.limit ? params.limit : 10;
    const users = await User.query().paginate(page, limit);
    return users.toJSON();
  }
}
