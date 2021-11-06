import HealthCheck from '@ioc:Adonis/Core/HealthCheck';
import Route from '@ioc:Adonis/Core/Route';

Route.get('/', async () => {
  return '<h1>api is working.</br> remember to prefix url with api eg:(api/users, api/login)</h1>';
});

Route.group(() => {
  Route.post('github-login', 'AuthController.githubLogin');
  Route.post('register', 'AuthController.register');
  Route.post('login', 'AuthController.login');
  Route.post('forget-password', 'AuthController.forgetPassword');
  Route.post('update-password', 'AuthController.updatePassword');
  Route.group(() => {
    Route.resource('users', 'UsersController').apiOnly();
    Route.get('users/pagination/:page/:limit', 'UsersController.pagination');
  }).middleware('auth:userApi,githubUserApi');
}).prefix('api');

Route.get('health', async ({ response }) => {
  const report = await HealthCheck.getReport();
  return report.healthy ? response.ok(report) : response.badRequest(report);
});
// {
//   "email": "tony@gmail.com",
//   "name": "tony karam",
//   "type": "bearer",
//   "token": "MTE.yweN8GPP-BLhQZpIb7BNYLnzZq3nBPhz_2fsVW6eP5t4cAmAiczMhGaSfspd",
//   "expires_at": "2021-11-15T19:25:40.316+02:00"
// }
