const { getAllUsers } = require("../services/UserService");

module.exports = (router) => {

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