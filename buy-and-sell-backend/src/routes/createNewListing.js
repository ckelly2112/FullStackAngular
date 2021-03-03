//UUID is used to create randomly generated unique IDs
import { v4 as uuid } from 'uuid';
import * as admin from 'firebase-admin'
import {db} from '../database';
import { Boom } from '@hapi/boom';

export const createNewListingRoute = {
    method: 'POST',
    path: '/api/listings',
    handler: async (req, h) => {
        const token = req.headers.authtoken;
        const user = await admin.auth().verifyIdToken(token);
        const userId = user.user_id;
        if(user.user_id!== userId) throw Boom.unauthorized('Users can only access their own listings')

        //Information to insert in new row (new listing)
        const id = uuid();
        const {name = '', description = '', price = 0 } = req.payload;
        const views = 0;

        //Using back ticks for multi-line queries
        await db.query(`
            INSERT INTO listings (id, name, description, price, user_id, views)
                VALUES (?, ?, ?, ?, ?, ?)`,
                [id, name, description, price, userId, views]
                );
            return {id, name, description, price, user_id: userId, views}
    }
}