module.exports = (router) => {

    router.get('/health-check', (req,res)=>{
        res.send({
            code: 200, 
            message: ' Server running.. '
        })
    })

}