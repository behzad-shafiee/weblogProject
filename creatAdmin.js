const Blogger = require('./models/user');
const bcrypt = require('bcrypt');

module.exports = new class {

    async creatAdmin() {
        try {
            const isExistAdmin = await Blogger.findOne({ role: 'admin' });
            if (isExistAdmin) {
                return console.log(`admin already existed`);
            }
            const userName = process.env.USER_NAME_ADMIN;
            const password = process.env.PASSWORD
           
            const salt = await bcrypt.genSalt(5);
            const hashedPass = await bcrypt.hash(password, salt);
            const admin = await new Blogger({

                userName,
                password:hashedPass,
                firstName: "ali",
                lastName: "mohammady",
                gender: "male",
                avatar:'avatarDefault.png',
                phoneNumber: "09356874415",
                role: 'admin',
              
            });
            const result = await admin.save();
            console.log('admin created');

        } catch (err) {
            console.log(`err of fining admin :${err}`);
        }

    }
}