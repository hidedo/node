const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const app = express();
const fs = require('fs');
const sharp = require('sharp');


app.listen(3002,()=>console.log('running...'));


app.use(cors());
app.use(multer({dest:'tmp/'}).array('dragger',10))

app.use('/public', express.static('public'));

const deleteFiles = ()=> {
    fs.readdir('tmp/',(err,files)=>{
       if (err){
           console.error(err)
       }
       console.log(files)
       files.forEach((file)=>{
           fs.unlink( `tmp/${file}`,err=>{
           if(err){
               console.error(err)
           }
           });
       })

    })

}

app.post('/upload', (req, res)=> {

    deleteFiles();

    console.log(req.body['radio-group'],req.files);

    let dir = '';
    if(req.body['radio-group']==1){
        dir ='index-pic'
    }else if(req.body['radio-group']==2){
        dir = 'project-pic'
    }else if(req.body['radio-group']==3){
        dir = 'double-pic'
    }else if(req.body['radio-group']==4){
        dir = 'diary-pic'
    }
    let response = {};

    for (let i=0 ;i<=req.files.length;i++){
        if(i==req.files.length){
            response = {

                status: "success",
                message:'all done',
            }

            return res.json(response);
            break;
        }
        let des_file = `${__dirname}/public/image/${dir}/${req.files[i].originalname}`;


        fs.readFile(req.files[i].path,(err,data)=>{

            if(err){
                response = {
                    name: req.files[i].originalname,
                    status: "read fail",
                    message:err,
                }

                return res.json(response)

            }
            sharp(data)
                .jpeg({
                        quality:80,
                        chromaSubsampling: '4:4:4',
                        progressive:true,
                    }

                )
                .toBuffer()
                .then(data=>{
                    fs.writeFile(des_file,data,(err)=>{
                        if (err) {

                            response = {
                                name: req.files[i].originalname,
                                status: "write fail",
                                message:err,
                            }

                            return res.json(response)

                        }
                        sharp(data)
                            .jpeg({
                                    quality:100,
                                    chromaSubsampling: '4:4:4',
                                    progressive:true,
                                }

                            )
                            .resize(500)
                            .toFile(`public/image/m-${dir}/${req.files[i].originalname}`,
                                (err,info)=>{
                                    if(err){
                                        response = {
                                            name: req.files[i].originalname,
                                            status: "sharp1 fail",
                                            message:err,
                                        }

                                        return  res.json(response)
                                    }

                                })








                    });

                })
                .catch(err=>{
                    response = {
                        name: req.files[i].originalname,
                        status: "sharp2 fail",
                        message:err,
                    }

                    return  res.json(response)


                })




        });


    }

})
app.post('/uploadFile', (req, res)=> {
    deleteFiles();

    let response = {};

    for (let i in req.files){
        let des_file = `${__dirname}/public/${req.files[i].originalname}`;

        fs.readFile(req.files[i].path,(err,data)=>{

            if(err){
                response = {
                    name: req.files[i].originalname,
                    status: "read fail",
                    message:err,
                }

                return res.json(response)

            }
            fs.writeFile(des_file,data,(err)=>{
                if (err) {

                    response = {
                        name: req.files[i].originalname,
                        status: "write fail",
                        message:err,
                    }

                    return res.json(response)

                }
                response = {
                    name: req.files[i].originalname,
                    status: "success",
                    message:'File uploaded successfully',
                }

                return res.json(response)



            });





        });


    }

})





