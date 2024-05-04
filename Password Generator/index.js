const inputSlider = document.querySelector("[data-length-slider]");
const lengthDisplay = document.querySelector("[data-length-number]");
const passwordDisplay = document.querySelector("[data-password-display]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copy-msg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generate-button");
const checkBox = document.querySelectorAll("input[type=checkbox]");
const symbols = "~!@#$%^&*()_+<>?:{}|";

let password = "";
let passwordLength = 10;
let checkCount = 1;
handleSlider();
setIndicator("#ccc");

// set password length
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = (((passwordLength-min) * 100) / (max-min)) + "% 100%";
}

function setIndicator(color) {
    indicator.style.backgroundColor = color;
    // shadow code here
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRandomInteger(min, max) {
    return (Math.floor(Math.random() * (max - min)) + min);
}

function generateRandomNumber() {
    return getRandomInteger(0, 9);
}

function generateLowerCase() {
    return String.fromCharCode(getRandomInteger(97, 123));
}

function generateUpperCase() {
    return String.fromCharCode(getRandomInteger(65, 90));
}

function generateSymbol() {
    const random = getRandomInteger(0, symbols.length);
    return symbols.charAt(random);
}

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSymbol = false;

    if (uppercaseCheck.checked) {
        hasUpper = true;
    }
    if (lowercaseCheck.checked) {
        hasLower = true;
    }
    if (numbersCheck.checked) {
        hasNum = true;
    }
    if (hasSymbol.checked) {
        hasSymbol = true;
    }

    if (hasUpper && hasLower && (hasNum || hasSymbol) && passwordLength >= 8) {
        setIndicator("#0f0");
    }
    else if ((hasLower || hasUpper) && (hasNum || hasSymbol) && passwordLength >= 6) {
        setIndicator("#ff0");
    }
    else {
        setIndicator("#f00");
    }
}

async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied";
    }
    catch(e) {
        copyMsg.innerText = "Failed";
    }

    copyMsg.classList.add("active");

    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);
}

inputSlider.addEventListener("input", (e) => {
    passwordLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener("click", () => {
    if (passwordDisplay.value) {
        copyContent();
    }
})

function handleCheckBoxChange() {
    checkCount = 0;
    checkBox.forEach((checkbox) => {
        if (checkbox.checked) {
            checkCount++;
        }
    })

    // special condition
    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
}

checkBox.forEach((checkbox) => {
    checkbox.addEventListener("change", handleCheckBoxChange);
})


function shufflePassword(array) {
    // Fisher Yates method
    for (let i=array.length - 1 ; i>0 ; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

generateBtn.addEventListener("click", () => {
    // none of the checkboxes are selected
    if (checkCount <= 0) {
        return;
    }

    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    // Let's find new password

    // remove old password
    password = "";

    // Let's put the stuff mentioned by checkboxes
    /*if (uppercaseCheck.checked) {
        password += generateUpperCase();
    }
    if (lowercaseCheck.checked) {
        password += generateLowerCase();
    }
    if (numbersCheck.checked) {
        password += generateRandomNumber();
    }
    if (symbolsCheck.checked) {
        password += generateSymbol();
    }*/

    let funcArr = [];

    if (uppercaseCheck.checked) {
        funcArr.push(generateUpperCase);
    }
    if (lowercaseCheck.checked) {
        funcArr.push(generateLowerCase);
    }
    if (numbersCheck.checked) {
        funcArr.push(generateRandomNumber);
    }
    if (symbolsCheck.checked) {
        funcArr.push(generateSymbol);
    }

    // compulsory addition
    for (let i=0 ; i<funcArr.length ; i++) {
        password += funcArr[i]();
    }

    // remaining addition
    for (let i=0 ; i<passwordLength-funcArr.length ; i++) {
        let randomIndex = getRandomInteger(0, funcArr.length);
        password += funcArr[randomIndex]();
    }

    // shuffle the password
    password = shufflePassword(Array.from(password));

    // show on UI
    passwordDisplay.value = password;

    // calculate strength
    calcStrength();
})