import dbClient from '../utils/db';
import sha1 from 'sha1';
import { ObjectId } from 'mongodb';

class UsersController {
  static async postNew(req, res) {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }
    if (!password) {
      return res.status(400).json({ error: 'Missing password' });
    }
	
    const user = await dbClient.findUser({ email });
    if (user) {
      return res.status(400).json({ error: 'Already exist' });
    } 
    const hashed = sha1(password);
    const newUser = await dbClient.createUser({ email, password: hashed });
    
    return res.status(201).json({ id: newUser.insertedId, email });
  }
}

export default UsersController;
