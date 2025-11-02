const { getAllUsers, signupUser, updateUser } = require("../services/UserService");

module.exports = (router) => {

    router.post('/users/signup', async (req, res, next) => {
        try {
            const result = await signupUser(req.body);
            res.status(result.code).json(result.data);
        } catch (error) {
            next(error);
        }
    });

    router.put('/users/update', async (req, res, next) => {
        try {
            const result = await updateUser(req.body);
            res.status(result.code).json(result.data);
        } catch (error) {
            next(error);
        }
    });



    router.get('/health-check', (req,res)=>{
        res.send({
            code: 200, 
            message: ' Server running.. '
        })
    })

    router.get('/users', async (req, res, next) => {
        try {
            const result = await getAllUsers();
            res.status(result.code).json(result.data);
        } catch (error) {
            next(error);
        }
    });

}