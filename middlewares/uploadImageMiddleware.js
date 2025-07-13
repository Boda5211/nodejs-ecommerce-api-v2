const multer=require('multer');
const ApiError=require('../utils/apiError');
const multerOption=()=>{
 const multerStorage=multer.memoryStorage();
    const multerFilter=function(req,file,cb){
        if(file.mimetype.startsWith('image')){
            cb(null,true);
        }else{
            cb(new ApiError(`only images allowed `,400),false);
        }
    }
    const upload=multer({storage:multerStorage,fileFilter:multerFilter});
    return upload;
}
exports.uploadSingleImage=(fieldName)=>{
    return multerOption().single(fieldName);
};
exports.uploadArrayOFImages=(arrayFields)=>{
return multerOption().fields(arrayFields);

}
// //1-DiskStorage engine
// const multerStorage=multer.diskStorage({
// destination:function(req,file,cb){
//     cb(null,'uploads/brands');
// },
// filename:function(req,file,cb){
//     //brand-id-Date.now().jpeg
//     const ext=file.mimetype.split('/')[1];
//     const filename=`brand-${uuidv4()}-${Date.now()}.${ext}`;
//     cb(null,filename);
// },
//});
//2-Memory Storage engine
/*const multerStorage=multer.memoryStorage();

const multerFilter=function(req,file,cb){
    if(file.mimetype.startsWith('image')){
        cb(null,true);
    }else{
        cb(new ApiError(`only images allowed`,400),false);
    }
}
const upload=multer({storage:multerStorage,fileFilter:multerFilter});
*///upload.single('img');