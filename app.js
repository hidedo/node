const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const app = express();
const fs = require('fs');
const sharp = require('sharp');
app.listen(3002,()=>console.log('fu1wu'))

app.use(cors());
app.use(multer({dest:'tmp/'}).array('file'));

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



    console.log(req.files);
    let des_file = `${__dirname}/images/${req.files[0].originalname}`;

    fs.readFile(req.files[0].path,(err,data)=>{
        let response = {};
        if(err){
            response = {
                name: req.files[0].originalname,
                status: "read fail",
                message:err,
            }
            res.json(response)
            return
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
                        console.log(err);
                        response = {
                            name: req.files[0].originalname,
                            status: "write fail",
                            message:err,
                        }

                    } else {
                        sharp(data)
                            .jpeg({
                                    quality:100,
                                    chromaSubsampling: '4:4:4',
                                    progressive:true,
                                }

                            )
                            .resize(500)
                            .toFile(`images/m-${req.files[0].originalname}`)
                            .then(()=>{
                                response = {
                                    name: req.files[0].originalname,
                                    status: "success",
                                }
                                res.json(response)
                            })
                            .catch(err=>{
                                response = {
                                    name: req.files[0].originalname,
                                    status: "sharp1 fail",
                                    message:err,
                                }
                                res.json(response)


                            })

                        deleteFiles();
                    };




                });

            })
            .catch(err=>{
                response = {
                    name: req.files[0].originalname,
                    status: "sharp2 fail",
                    message:err,
                }
                res.json(response)


            })




    });


});





