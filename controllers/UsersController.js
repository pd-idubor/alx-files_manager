import sha1 from 'sha1';
import { ObjectId } from 'mongodb';
import dbClient from '../utils/db';
import tokenPar from '../utils/token';

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

  static async getUser(req, res) {
    const tokenVal = req.headers['x-token'];
    if (!tokenVal) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userId = await tokenPar.retrieveToken(req);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await dbClient.findUser({ _id: ObjectId(userId) });
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    return res.status(200).json({ id: user._id, email: user.email });
  }
}

export default UsersController;
