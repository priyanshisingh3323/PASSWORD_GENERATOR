const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const generateButton = document.querySelector(".generateButton");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const symbolCheck = document.querySelector("#symbol");
const numberCheck = document.querySelector("#numbers");
const indicator = document.querySelector("[data-indicator]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

// initially
let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
// set strength circle color to gray..

setIndicator("#ccc")

//set password length to reflect in UI
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min =inputSlider.min;
    const max=inputSlider.max;
    inputSlider.style.backgroundSize=((passwordLength-min)*100/(max-min))+"% 100%"
    //or kuch krna chahiye--HW
}

function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;

    //shadow--HW
}
function getRdmInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {
    return getRdmInteger(0, 9);
}
function generateLowerCase() {
    return String.fromCharCode(getRdmInteger(97, 123));
}

function generateUpperCase() {
    return String.fromCharCode(getRdmInteger(65, 91));
}

function generateSymbol() {
    const randNUm = getRdmInteger(0, symbols.length);
    return symbols.charAt(randNUm);
}
function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck.checked) hasUpper = true;
    if (uppercaseCheck.checked) hasLower = true;
    if (uppercaseCheck.checked) hasNum = true;
    if (uppercaseCheck.checked) hasSym = true;

    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
        setIndicator("#0f0");
    } else if (
        (hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >= 6) {
        setIndicator("#ff0");
    } else {
        setIndicator("#f00")
    }
}

async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch (err) {
        copyMsg.innerText = "failed";
    }

    //to make copy wala span visible
    copyMsg.classList.add("active")

    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);

}

inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
});


copyBtn.addEventListener('click', () => {
    if (passwordDisplay.value)
        copyContent();
});

function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if (checkbox.checked)
            checkCount++;
    });
    //special conditions
    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox)=>{
      checkbox.addEventListener('change', handleCheckBoxChange);

})

generateButton.addEventListener('click', () => {
    //none of the checkbox are selected

    if (checkCount===0)
        return;

    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    function shufflePassword(array) {
        //Fisher yates method
        for (let i = array.length - 1; i > 0; i--) {
            // random j ,find out using random function
            const j = Math.floor(Math.random() * (i + 1));
            // swap number at i index and j index
            const temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        let str = "";
        array.forEach((el) =>
          (  str += el));
       
        return str;
    } 
    

    //lets start the journey to find new password
    console.log("Starting the journey");
    //remove old password
    password = " ";
    // lets put the staff mentioned by checked boxes

    // if(uppercaseCheck.checked){
    //     password+=generateUpperCase();
    // }
    // if(lowercaseCheck.checked){
    //     password+=generateLowerCase();
    // }
    // if(numberCheck.checked){
    //     password+=generateRandomNumber();
    // }
    // if(symbolCheck.checked){
    //     password+=generateSymbol();
    // }


    let funcArr = [];

    if (uppercaseCheck.checked) 
        funcArr.push(generateUpperCase);
    
    if (lowercaseCheck.checked) 
        funcArr.push(generateLowerCase);
    
    if (numberCheck.checked) 
        funcArr.push(generateRandomNumber);

    if (symbolCheck.checked) 
        funcArr.push(generateSymbol);
    
    //compulsory addition

    for (let i = 0; i < funcArr.length; i++) {
        password +=funcArr[i]();
    }
    console.log("Compulsory addition done")

    //remaining addition 
    for (let i = 0; i < passwordLength - funcArr.length; i++) {
        let randIndex = getRdmInteger(0, funcArr.length);
        console.log("random index" + randIndex)
        password += funcArr[randIndex]();
    }
// password is ready till here

    console.log("remaining addition done")

    //shuffle the password
    password = shufflePassword(Array.from(password));
    console.log("shuffling done")

    // show in UI
    passwordDisplay.value = password;
    console.log("UI addition done")

    //calculate strength
    calcStrength();
})



