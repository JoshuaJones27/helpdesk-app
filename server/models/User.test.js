const mongoose = require('mongoose');
const User = require('./User');

describe('User model', () => {
    it('hashes password before saving and can compare password', async () => {
        const user = new User({ email: 'test@example.com', password: 'secret123' });
        await user.validate();
        expect(user.password).not.toBe('secret123');
        const isMatch = await user.comparePassword('secret123');
        expect(isMatch).toBe(true);
    });
}); 