let inputImageBase64; // Buffer for the input image
let filteration = []; //creating filteration array to store information about filters to be applied on the image
let transformation = []; //creating transformation array to store information about transformations to be applied on the image
let editedImage; //creating a variable to store the editedImage instance

// Writing a function that will wait to load all the DOM elements before executing the code
document.addEventListener("DOMContentLoaded", function() {
    const imageInput = document.getElementById("imageInput");
    const uploadedImage = document.getElementById("uploadedImage");

  // Adding an event listener to the imageInput element
    imageInput.addEventListener("change", function() {
    const file = imageInput.files[0]; // Getting the file from the input element
    if (file) {
      const reader = new FileReader(); // Creating a file reader

    reader.onload = function() {
        //on onload of reader, we are storing the base64 string of the image in inputImageBase64 variable and setting the src of the image element
        inputImageBase64 = reader.result; // Storing the base64 string of the image
        uploadedImage.src = inputImageBase64; // Setting the src of the image element
        //console.log(inputImageBase64)
    };

        // Reading the file as a data URL
        reader.readAsDataURL(file); // Reading the file as a data URL
    }
});
});


document.addEventListener("DOMContentLoaded", function() {
    const grayscaleCheckbox = document.getElementById("grayscaleCheckbox");

    grayscaleCheckbox.addEventListener("change", function() {
        if (grayscaleCheckbox.checked) {
            // Checkbox is checked, add the grayscale filter object to the array
            //through this we are adding the grayscale filter object to the filteration array that can be send to backend in form of json
            
            filteration.push({ "filter": "grayscale" });
        } else {
            // Checkbox is unchecked, remove the grayscale filter object from the array (if it exists)
            filteration = filteration.filter(filter => filter.filter !== "grayscale");
        }


    });
});


document.addEventListener("DOMContentLoaded", function() {
    const blurCheckbox = document.getElementById("blurCheckbox");
    const blurValueInput = document.getElementById("blurValueInput");

    // Adding an event listener to the checkbox
    blurCheckbox.addEventListener("change", function () {
        updateFilterationArray();
    });

    // Adding an event listener to the number input
    blurValueInput.addEventListener("input", function () {
        updateFilterationArray();
    });

    function updateFilterationArray() {
      // Check if the checkbox is checked
        const isChecked = blurCheckbox.checked; //returns true if checked else false
        const blurValue = parseFloat(blurValueInput.value); // Converting the string value to a number

      // Find the index of the existing "Blur" filter object in the array
      //if the filteration array contains the blur filter object then it will return the index of the blur filter object else it will return -1
      //reason of using findIndex is that we want to update the value of blur filter object if it already exists in the array
        const blurFilterIndex = filteration.findIndex(
            (filter) => filter.filter === "blur"
    );

        if (isChecked) {
        // If checkbox is checked and "Blur" filter object exists, update its value
        if (blurFilterIndex !== -1) {
            //if the blur filter object exists in the array then we will update the value of blur filter object
            // we are updating the value of blur filter object in the filteration array
            filteration[blurFilterIndex].filterInfo = blurValue;
        } else {
          // If "Blur" filter object doesn't exist, add it to the array
            filteration.push({ filter: "blur", filterInfo: blurValue });
        }
    } else {
        // If checkbox is unchecked, remove the "Blur" filter object from the array (if it exists)
        if (blurFilterIndex !== -1) {
            filteration.splice(blurFilterIndex, 1);
        }
    }


    }
    });




document.addEventListener("DOMContentLoaded", function() {
    const brightnessCheckbox = document.getElementById("brightnessCheckbox");
    const brightnessValueInput = document.getElementById("brightnessValueInput");

  // Adding an event listener to the checkbox
    brightnessCheckbox.addEventListener("change", function () {
        updateFilterationArray();
    });

  // Adding an event listener to the number input
    brightnessValueInput.addEventListener("input", function () {
        updateFilterationArray();
    });

    function updateFilterationArray() {
    // Check if the checkbox is checked
        
        const isChecked = brightnessCheckbox.checked; //returns true if checked else false, it is checking if the checkbox is checked or not for brightness filter
        const brightnessValue = parseFloat(brightnessValueInput.value);

    // Find the index of the existing "Brightness" filter object in the array
    //if the filteration array contains the brightness filter object then it will return the index of the brightness filter object else it will return -1
    //reason of using findIndex is that we want to update the value of brightness filter object if it already exists in the array
        const brightnessFilterIndex = filteration.findIndex(
            (filter) => filter.filter === "brightness"
        );

    if (isChecked) {
      // If checkbox is checked and "Brightness" filter object exists, update its value
        if (brightnessFilterIndex !== -1) {
            filteration[brightnessFilterIndex].filterInfo = brightnessValue;
        } else {
        // If "Brightness" filter object doesn't exist, add it to the array
        filteration.push({ filter: "brightness", filterInfo: brightnessValue });
        }
        } else {
            // If checkbox is unchecked, remove the "Brightness" filter object from the array (if it exists)
            if (brightnessFilterIndex !== -1) {
            filteration.splice(brightnessFilterIndex, 1);
        }
    }

    //console.log(filteration);
}
});


document.addEventListener("DOMContentLoaded", function() {
    const cropCheckbox = document.querySelector('.crop-section input[type="checkbox"]');
    const cropInputs = document.querySelectorAll('.crop-section input[type="number"]');

    // Adding an event listener to the checkbox
    cropCheckbox.addEventListener("change", function () {
        updateTransformationArray();
    });

    // Adding event listeners to all the number input elements
    cropInputs.forEach((input) => {
        input.addEventListener("input", function () {
        updateTransformationArray();
    });
    });

    function updateTransformationArray() {
      // Check if the checkbox is checked
        const isChecked = cropCheckbox.checked;

        // Check if the checkbox is checked
        if (isChecked) {
        // Get the values from the input elements
        const leftPercentage = parseFloat(cropInputs[0].value) / 100;
        const topPercentage = parseFloat(cropInputs[1].value) / 100;
        const widthPercentage = parseFloat(cropInputs[2].value) / 100;
        const heightPercentage = parseFloat(cropInputs[3].value) / 100;

        // Construct the crop transformation object
        const cropObject = {
            "operation": "crop", // storing the value of operation in the object that will be sent to backend for processing
            "info": {
            "leftPercentage": leftPercentage, // storing the value of left percentage in the crop object
            "topPercentage": topPercentage, // storing the value of top percentage in the crop object
            "widthPercentage": widthPercentage, // storing the value of width percentage in the crop object
            "heightPercentage": heightPercentage // storing the value of height percentage in the crop object
        }
        };
        const cropObjectIndex = transformation.findIndex((trans) => trans.operation === "crop");
        if(cropObjectIndex !== -1){
            transformation[cropObjectIndex] = cropObject;
        }else{
            // Add the crop transformation object to the transformation array
            transformation.push(cropObject);
        }
        } else {
        // If the checkbox is unchecked, remove the crop transformation object from the array (if it exists)
        transformation = transformation.filter((trans) => trans.operation !== "crop");
        }

    }
});



document.addEventListener("DOMContentLoaded", function() {
    const resizeCheckbox = document.getElementById("resize-checkbox");
    const resizeWidthInput = document.getElementById("width-input-resize");
    const resizeHeightInput = document.getElementById("height-input-resize");

    // Adding an event listener to the checkbox
    resizeCheckbox.addEventListener("change", function () {
        updateTransformationArray();
    });

    // Adding event listeners to width and height input elements
    resizeWidthInput.addEventListener("input", function () {
        updateTransformationArray();
    });
    resizeHeightInput.addEventListener("input", function () {
        updateTransformationArray();
    });

    function updateTransformationArray() {
      // Check if the checkbox is checked
        const isChecked = resizeCheckbox.checked;

        if (isChecked) {
        // Get the values from the input elements
        const width = parseInt(resizeWidthInput.value); //parseInt converts the string to integer
        const height = parseInt(resizeHeightInput.value); //parseInt converts the string to integer

        // Construct the resize transformation object
        const resizeObject = {
            "operation": "resize", // storing the value of operation in the object that will be sent to backend for processing
            "width": width, // storing the value of width in the resize object
            "height": height // storing the value of height in the resize object
        };

        const resizeObjectIndex = transformation.findIndex((trans) => trans.operation === "resize");
        // Add the resize transformation object to the transformation array
        if(resizeObjectIndex !== -1){
            //if the resize object already exists in the transformation array then update the value of the resize object
            transformation[resizeObjectIndex] = resizeObject;
        }else{
            //if the resize object does not exist in the transformation array then add the resize object to the transformation array
            transformation.push(resizeObject);
        }
        } else {
        // If the checkbox is unchecked, remove the resize transformation object from the array (if it exists)
        transformation = transformation.filter((trans) => trans.operation !== "resize");
        }


    }
});




document.addEventListener("DOMContentLoaded", function() {
    const rotateCheckbox = document.getElementById("rotate-check");
    const rotateAngleInput = document.getElementById("rotate-val");


    // Adding an event listener to the checkbox
    rotateCheckbox.addEventListener("change", function () {
        updateTransformationArray();
    });

    // Adding event listeners to width and height input elements
    rotateAngleInput.addEventListener("input", function () {
        updateTransformationArray();
    });


    function updateTransformationArray() {
      // Check if the checkbox is checked
        const isChecked = rotateCheckbox.checked;

        if (isChecked) {
        // Get the values from the input elements
        const angle = parseInt(rotateAngleInput.value);


        // Construct the resize transformation object
        const rotateObject = {
            "operation": "rotate", // storing the value of operation in the object that will be sent to backend for processing
            "angle" : angle // storing the value of angle in the rotate object
        };

        const rotateObjectIndex = transformation.findIndex((trans) => trans.operation === "rotate");
        // Add the resize transformation object to the transformation array
        if(rotateObjectIndex !== -1){
            //if the resize object already exists in the transformation array then update the value of the resize object
            transformation[rotateObjectIndex] = rotateObject;
        }else{
            //if the resize object does not exist in the transformation array then add the resize object to the transformation array
            transformation.push(rotateObject);
        }
        } else {
        // If the checkbox is unchecked, remove the resize transformation object from the array (if it exists)
        transformation = transformation.filter((trans) => trans.operation !== "rotate");
        }


    }
});


document.addEventListener("DOMContentLoaded", function(){

    editedImage = document.getElementById("editedImage");
    const editButton = document.getElementById("edit-button");

    editButton.addEventListener("click", function() {
        // Check if the image is empty
        if (!inputImageBase64) {
            alert("Please upload an image before editing."); //an alret will be shown if the image is empty
            return;
        }

        // Check if both filteration and transformation arrays are empty
        if (filteration.length === 0 && transformation.length === 0) {
            alert("Please apply at least one filter or transformation before editing."); //an alret will be shown if both filteration and transformation arrays are empty
            return;
        }

        // Construct the image data object that will be sent to the backend, in this object we will store the base64 image data, filteration array and transformation array
        //filteration array will be used to store the filteration objects such as blur, grayscale, blur and edge detection it will store the value of the filteration that is to be applied on the image
        //filteration array will have the following structure example is given below


        //filteration = [
        //     {
        //         "operation": "blur", storing the value of operation in the object that will be sent to backend for processing
        //         "value": 5  storing the information that will passed onto the backend for processing
        //     },


        //transformation array will be used to store the transformation objects such as crop, resize, rotate it will store the value of the transformation that is to be applied on the image
        //transformation array will have the following structure example is given below
        //transformation = [
        //     {
        //         "operation": "resize", storing the value of operation in the object that will be sent to backend for processing
        //         "width": 500, storing the information that will passed onto the backend for processing
        //         "height": 500 storing the information that will passed onto the backend for processing
        //     }
        const imageData = {
            imageBase64: inputImageBase64,
            filteration: filteration,
            transformation: transformation
        };

        const url = "https://image-processing-automation.onrender.com/editImage"; //url of the backend on which the request will be sent
        const options = {
            method: "POST", //method of the request POST request is usually used to send image data to backend to handle
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(imageData) //body of the request will contain the image data that is to be sent to the backend
        };


        fetch(url, options) //fetch is used to send the request to the backend
        .then(response => response.json()) //response from the backend is converted to json format
        .then(data => {
            // Handle the response from the backend
            if (data && data.imageData) {
                // Extract the base64 image data from the response
                const editedBase64 = data.imageData;

                // Update the edited image with the received base64 response
                const editedImage = document.getElementById("editedImage");

                editedImage.src = "data:image/jpeg;base64," + editedBase64;
            } else {
                console.error("Invalid response from the backend.");
            }
        })
        .catch(error => console.error("Error is occuring on frontend: ", error));
    });
    
})




document.addEventListener("DOMContentLoaded", function() {
    const downloadButton = document.getElementById("download-button");
    
    let imageLoaded = false; //variable to check if the image is loaded or not

    // Add a load event listener to the editedImage
    editedImage.addEventListener("load", function() {
        imageLoaded = true;
    });

    // Add the click event listener for the download button
    downloadButton.addEventListener("click", function() {
        // Check if the image is empty or still loading
        if (!editedImage.src || !imageLoaded) {
            alert("Please edit an image before downloading.");
            return;
        }

        // Get the data URL of the edited image
        const editedBase64 = editedImage.src;

        // Create a download link for the edited image
        const downloadLink = document.createElement("a");
        downloadLink.href = editedBase64;
        downloadLink.download = "editedImage.jpeg";
        downloadLink.style.display = "none";

        // Add the download link to the document body
        document.body.appendChild(downloadLink);

        // Trigger a click event on the download link to initiate the download
        downloadLink.click();

        // Remove the download link from the document body after the download is initiated
        document.body.removeChild(downloadLink);
    });

    console.log("Download button event listener added");
});