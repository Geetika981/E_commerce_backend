const asyncHandler=(fxn)=>async(req,res,next)=>{
    try {
        await fxn(req,res,next);
    } catch (error) {
        return res.status(400).json({
            error:error ,
            message:error.message,
            success:false
        })
    }
}

export {asyncHandler};