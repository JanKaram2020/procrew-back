import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import User from 'App/Models/User';
import GithubUser from 'App/Models/GithubUser';
import * as Crypto from 'crypto';
import { DateTime } from 'luxon';
import Env from '@ioc:Adonis/Core/Env';
import Mail from '@ioc:Adonis/Addons/Mail';
export default class AuthController {
  public async login({ request, auth }: HttpContextContract) {
    const data = request.only(['email', 'password', 'name']);
    const userExists = await User.findBy('email', data.email);
    const token = await auth.use('userApi').attempt(data.email, data.password, {
      expiresIn: '10 days',
    });
    if (userExists) {
      return {
        email: userExists.email,
        name: userExists.name,
        ...token.toJSON(),
      };
    }
  }
  public async register({ request, response, auth }: HttpContextContract) {
    const data = request.only(['email', 'password', 'name']);
    const userExists = await User.findBy('email', data.email);
    if (userExists) {
      return response.status(400).send({ errors: [{ message: 'User already exists' }] });
    }
    const newUser = await User.create(data);
    const token = await auth.use('userApi').login(newUser, {
      expiresIn: '10 days',
    });
    return {
      email: newUser.email,
      name: newUser.name,
      ...token.toJSON(),
    };
  }
  public async forgetPassword({ request, response }: HttpContextContract) {
    const data = request.only(['email']);
    console.log(data);
    const user = await User.findByOrFail('email', data.email);
    const token = Crypto.randomBytes(10).toString('hex');
    user.forget_password_token = token;
    user.forget_password_token_create_at = DateTime.now();
    await user.save();
    //self signed certificate error
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

    try {
      await Mail.send((message) => {
        message
          .from('jankaram2020@gmail.com')
          .to(data.email)
          .subject('Procrew Forget password')
          .htmlView('emails/forget_password', { url: Env.get('FRONTEND_URL'), user, token });
      });
      return 'sent forget password';
    } catch (e) {
      console.log(e);
      response.status(400).send(e);
    }
  }
  public async updatePassword({ request, response }: HttpContextContract) {
    const data = request.only(['email', 'newPassword', 'token']);
    const user = await User.findByOrFail('email', data.email);
    const sameToken = data.token === user.forget_password_token;
    if (!sameToken) {
      return response.status(401).send({
        message: {
          error: 'Old token provided or token already used',
        },
      });
    }
    // @ts-ignore
    const tokenDuration = DateTime.now().diff(user.forget_password_token_create_at, ['days']);
    if (tokenDuration.days > 2) {
      return response.status(401).send({ message: { error: 'Token expired' } });
    }
    user.forget_password_token = null;
    user.forget_password_token_create_at = null;
    await user.save();
    return response.status(201).send({ message: 'done' });
  }
  public async githubLogin({ request, auth }: HttpContextContract) {
    const data = request.only(['email', 'name']);
    const userExists = await GithubUser.findBy('name', data.name);
    if (userExists) {
      const token = await auth.use('githubUserApi').login(userExists);
      return {
        name: userExists?.name,
        ...token.toJSON(),
      };
    }
    const user = await GithubUser.create({
      name: data.name,
    });
    const token = await auth.use('githubUserApi').login(user);
    const newUser = await auth.user;
    return {
      name: newUser?.name,
      ...token.toJSON(),
    };
  }
}
