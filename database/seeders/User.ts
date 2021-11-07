import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import User from 'App/Models/User';

let seed: { email: string; password: string; name: string }[] = [];
for (let i = 1; i < 201; i++) {
  seed.push({
    email: `${i}procew@procrew.com`,
    password: 'secret',
    name: `${i}procew`,
  });
}
export default class UserSeeder extends BaseSeeder {
  public async run() {
    // Write your database queries inside the run method
    const users = await User.createMany(seed);
    if (users) {
      console.log('seeded users successfully');
    }
  }
}
