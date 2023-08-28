//importing required modules
const express = require('express');//importing express module
const app = express(); //creating express app
const sharp = require('sharp'); //sharp module is used to edit the image
const fs = require('fs'); //fs module is used to save the image to the folder
const imageBase64 = require('./imagedata.js') //    importing base64 image data from imagedata.js file
const bodyParser = require('body-parser'); //body-parser module is used to parse the incoming request

//defining view engine and views folder
app.set('view engine', 'ejs');//setting view engine to ejs

//setting up static folder
app.use(express.static('public')); //setting up static folder

//below this point all the middleware are defined--------------------------------//
app.use(bodyParser.json({limit: '50mb'})); //body-parser middleware to parse the incoming request
app.use(bodyParser.urlencoded({limit: '50mb', extended: true})); //body-parser middleware to parse the incoming request


//---------------------------------------------------------------------------------------------------------------------//
//below this point all the routes are defined

//defining get route to render the index page/landing page
app.get('/', (req, res) => {
    //consoling to check if landing page is rendering or not
    //console.log("we are rendering the index page")
    res.render('index');
});



//defining post route to edit the image
app.post('/editImage', async(req, res) => {

    //converting base64 image to buffer
    //console.log(req.body);
    //console.log("we have a request brothers let do it yeyeyey");
    
    //extracting raw base64 image data from the request
    const base64ImageData = req.body.imageBase64.replace(/^data:image\/\w+;base64,/, '');
    //console.log(base64ImageData)

    //converting base64 image to buffer
    let inputImageBuffer = Buffer.from(base64ImageData, 'base64');

    //extracting filteration and transformation info from the request
    let filteration = req.body.filteration;
    let transformation = req.body.transformation;

    //handling error while processing the image
    let error = false;

    //looping over the filteration array and applying filteration on the image
    for(let i = 0; i < filteration.length; i++){
        //extracting filteration info from the filteration array
        const filterationInfo = filteration[i];
        //consoling the filteration info to check if we are getting the correct data
        //console.log(filterationInfo);

        //calling the function to edit the image(apply filteration such as grrayscale conversion, brightness adjustment, blur)
        await editImageFilteration(inputImageBuffer, filterationInfo, error);
    }

    //looping over the transformation array and applying transformation on the image
    for(let i =0; i < transformation.length; i++){
        //extracting transformation info from the transformation array
        const transformationInfo = transformation[i];
        //console.log(transformationInfo);

        //calling the function to edit the image(apply transformation such as resize, rotate, crop)
        await editImageTransformation(inputImageBuffer, transformationInfo, error);
    }

    //console.log("bros we are done with editing the image, now I am going to send this image to frontend, and then we will chill")

    if(error === false){
        //using this to handle testing incoming image
        //saveImage(inputImageBuffer, "./images", "editedImage")

        //converting buffer to base64 image to send it to frontend
        const outputImageBuffer = inputImageBuffer.toString('base64');

        //sending the edited image to frontend in base64 format in json format
        res.status(200).json({imageData : outputImageBuffer});
    }else{

        //sending error message to frontend if error occured while editing the image
        res.status(500).json({message : "Error occured while editing the image"});
    }
    
});

















//------------------------------------------------------------------------------------------------------------------//

//here we are defining a function that will process the req and will work on editing(filteration only) the image
async function editImageFilteration(inputImageBuffer, filterationInfo, error) {
    //try catch block to handle error
    try {
        //checking if the filteration is grayscale or not
        if (filterationInfo.filter == "grayscale") {
            //calling the grayscale conversion function
            await grayScaleConversion(inputImageBuffer);
            //console.log("Image grayscale conversion is completed");
            //console.log(filterationInfo.filterInfo)
            
            //setting error to false if no error occured
            error = false;
        }

        //checking if the filteration is brightness or not
        if(filterationInfo.filter == "brightness"){
            //calling the brightness adjustment function
            await brightnessAjdustment(inputImageBuffer, filterationInfo.filterInfo);
            //console.log("Image brightness adjustment is completed");

            //setting error to false if no error occured
            error = false;
        }

        //checking if the filteration is blur or not
        if(filterationInfo.filter == "blur"){
            //calling the blur function
            await blurImage(inputImageBuffer, filterationInfo.filterInfo);

            //console.log("Image blur is completed");
            
            //setting error to false if no error occured
            error = false;
        }
    } catch (err) {
        // Handle the error or propagate it up the call stack
        console.error("Error occurred while editing the image:", err);

        //setting error to true if error occured
        error = true;

        //throwing the error because we want to handle the error in the main function
        throw err;
    }
}

//here we are defining a function that will process the req and will work on editing(transformation only) the image
async function editImageTransformation(inputImageBuffer, transformationInfo, error){
    //try catch block to handle error
    try{
        //checking if the transformation is resize or not
        if(transformationInfo.operation == "resize"){
            //calling the resize function
            await resizeImage(inputImageBuffer, transformationInfo.width, transformationInfo.height);
            //console.log("Image resize is completed");

            //setting error to false if no error occured
            error = false;
        }

        //checking if the transformation is rotate or not
        if(transformationInfo.operation == "rotate"){
            //calling the rotate function
            await rotateImage(inputImageBuffer, transformationInfo.angle);
            //console.log("Image rotate is completed");
            
            //setting error to false if no error occured
            error = false;
        }
        //checking if the transformation is crop or not
        if(transformationInfo.operation == "crop"){
            //calling the crop function
            await cropImage(inputImageBuffer, transformationInfo.info);
            //console.log("Image crop is completed");
            
            //setting error to false if no error occured
            error = false;
        }
    }catch(err){
        //handle the error or propagate it up the call stack
        console.log("Error occured while editing the image");
        console.log("Error : ", err);
        error = true;
        throw err;
    }
}







//converting base64 image to buffer
let inputImageBuffer = Buffer.from(imageBase64, 'base64');
const filepath = "./images";



//this function will save the image to the folder it was used during testing to check if correct image is coming from frontend
//function to saving data from buffer to folder
function saveImage(inputImageBuffer, filepath, filename){
    fs.writeFile(`${filepath}/${filename}.png`, inputImageBuffer, (err) => {
        if (err) {
            console.log("Error occured while writing image to folder name images from buffer");
            console.log("Error : ", err);
        } else {
            console.log("Image saved successfully");
        }
    });
}


//writing function to implement image filteration(grayscale conversion)
async function grayScaleConversion(inputImageBuffer) {
    try{
        //converting image to grayscale
        //storing the output image buffer in outputImageBuffer
        const outputImageBuffer = await sharp(inputImageBuffer).grayscale().toBuffer();

        //copying the outputImageBuffer to inputImageBuffer as we want to edit the inputImageBuffer and send it to frontend
        outputImageBuffer.copy(inputImageBuffer);
    }catch(err){
        console.log("Error occured while converting image to grayscale");
        console.log("Error : ", err);
        throw err;
    }
}

//writing function to implement image filteration(brightnessAdjustment)
async function brightnessAjdustment(inputImageBuffer, brightnessLevel){
    //in the function  brightnessAjdustment, parameter brightnessLevel is the level of brightness we want to adjust and implement on the image
    try{
        //we are using sharp library to implement brightness adjustment and passing brightnessLevel as parameter to the modulate function
        
        const outputImageBuffer = await sharp(inputImageBuffer).modulate({ brightness: brightnessLevel}).toBuffer();
        outputImageBuffer.copy(inputImageBuffer);
        console.log("image brightness adjustment is completed")
    }catch(err){
        console.log("Error occured while converting image to brightness Adjustment");
        console.log("Error : ", err);
        throw err;
    }
}


//writing function to implement image filteration(Blur)
async function blurImage(inputImageBuffer, blurLevel){
    //in the function  blurImage, parameter blurLevel is the level of blur we want to implement on the image
    try{
        //we are using sharp library to implement blur and passing blurLevel as parameter to the blur function
        const outputImageBuffer = await sharp(inputImageBuffer).blur(blurLevel).toBuffer();
        outputImageBuffer.copy(inputImageBuffer);
        
        //console.log("image blur is completed");
    }
    catch(err){
        console.log("Error occured while converting image to blur");
        console.log("Error : ", err);
        throw err;
    }
}


//writing function to implement image filteration(edge detection)
//here we plan to implement edge detection using canny edge detection algorithm
//still working on it



//implementing image transformation(resizing)

async function resizeImage(inputImageBuffer, width, height){
    //in the function  resizeImage, parameter width and height are the width and height we want to resize the image
    try{
        //we are using sharp library to implement resize and passing width and height as parameter to the resize function
        const outputImageBuffer = await sharp(inputImageBuffer).resize({width, height, fit : 'contain'}).toBuffer();
        outputImageBuffer.copy(inputImageBuffer);
        //console.log("image resize is completed");
    }
    catch(err){
        console.log("Error occured while converting image to resize");
        console.log("Error : ", err);
        throw err;
    }
}


//implementing image transformation(croping)
async function cropImage(inputImageBuffer, info){
    //in the function  cropImage, parameter info is the information about the amount of cropping we want to implement on the image
    
    //we are using sharp library to use metadata function to get the information about the incoming image
    const imageInfo = await sharp(inputImageBuffer).metadata();

    //we are destructuring the info variable to get the information about the amount of cropping we want to implement on the image

    //leftPercentage and topPercentage are the percentage of the image we want to crop from left and top respectively
    //widthPercentage and heightPercentage are the percentage of the image we want to crop from width and height respectively
    const{leftPercentage, topPercentage, widthPercentage, heightPercentage} = info;

    //we are destructuring the imageInfo variable to get the information about the size of incoming image
    const {width : imageWidth, height : imageHeight} = imageInfo;


    //handling images such that cropping should not cross the inital size of image thus
    //in below code we are using information about amount of cropping in percentage which has defined in info variable
    const left = Math.floor(leftPercentage * imageWidth);
    const top = Math.floor(topPercentage * imageHeight);
    const width = Math.floor(widthPercentage * imageWidth);
    const height = Math.floor(heightPercentage * imageHeight);
    // console.log(imageInfo);    

    try{
        //we are using sharp library to implement crop and passing left, top, width and height as parameter to the extract function
        const outputImageBuffer = await sharp(inputImageBuffer).extract({left, top, width, height}).toBuffer();
        outputImageBuffer.copy(inputImageBuffer);
        //console.log("image crop is completed");
    }
    catch(err){
        console.log("Error occured while converting image to crop");
        console.log("Error : ", err);
        throw err;
    }
}


//implementing image transformation(rotation)
async function rotateImage(inputImageBuffer, angle){
    try{
        //we are using sharp library to implement rotate and passing angle as parameter to the rotate function
        //angle is the angle by which we want to rotate the image and it is in degree
        const outputImageBuffer = await sharp(inputImageBuffer).rotate(angle).toBuffer();
        outputImageBuffer.copy(inputImageBuffer);
        //console.log("image rotate is completed");
    }
    catch(err){
        console.log("Error occured while converting image to rotate");
        console.log("Error : ", err);
        throw err;
    }
}

console.log("ello heheheh")



//bellow this point all function are used for testing purpose
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//


//mainFunction(inputImageBuffer, filepath);


async function mainFunction(inputImageBuffer, filepath){
    //below this point all the filteration function are tested

    // await grayScaleConvertion(inputImageBuffer);
    // await brightnessAjdustment(inputImageBuffer, brightnessLevel);
    // await grayScaleConvertion(inputImageBuffer);
    // await blurImage(inputImageBuffer, blurLevel);
    
    
    
    
    
    //testing brightness adjustment for different levels thus making below variable
    const brightnessLevel = 0.5;
    //testing blur for different levels thus making below variable
    const blurLevel = 4;
    //testing for resize image
    const width = 800;
    const height = 600;
    

    //testing for cropping image 
    const info = {
        leftPercentage : 0.2,
        topPercentage : 0.2,
        widthPercentage : 0.6,
        heightPercentage : 0.6
    }

    //testing for rotation
    const angle = 90;
    await rotateImage(inputImageBuffer, angle);

    await cropImage(inputImageBuffer, info);



    saveImage(inputImageBuffer, filepath, "outputImage");
}




//---------------------------------------------------------------------------------------------------------------------------------------//
//below this point all port listening is setup


//listening to port 3000
app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});