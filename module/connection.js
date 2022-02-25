const mongoose = require('mongoose');
module.exports=(async function connectMongodb() {

    try {

        const connection = await mongoose.connect('mongodb://localhost:27017/weblog');
        console.log(`server connected to mongodb`);
        return


    } catch (error) {

        console.log(`server not connect to mongoose err is:${err}`);
        return;
    }

})();






