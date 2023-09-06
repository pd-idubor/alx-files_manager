import sha1 from 'sha1';
import { Buffer } from 'buffer';
import dbClient from '../utils/db';
import tokenPar from '../utils/token';

class AuthController {
  static async getConnect(req, res) {
    const { authHeaders } = req.headers;
    if (!authHeaders) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const value = authHeaders.replace('Basic ', '');
    const data = Buffer.from(value, 'base64').toString('utf-8');

    const [email, password] = data.split(':');
    if (!email || !password) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await dbClient.findUser({ email });
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    if (sha1(password) !== user.password) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const newToken = await tokenPar.generateToken(user._id);
    return res.status(200).json({ token: newToken });
  }

  static async getDisconnect(req, res) {
    const tokenValue = await tokenPar.retrieveToken(req);
    if (!tokenValue) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    await tokenPar.removeToken(req);
    return res.status(204).end();
  }
}
export default AuthController;
