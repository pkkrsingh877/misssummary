const readMinutes = (str) => {
    //counting number of words in description
    let count = 1
    for(let i=0; i< str.length; i++){
        if(str[i] === " "){
            count++;
        }
    }
    let minutes = Math.ceil(count/180);
    return minutes;
}

module.exports = readMinutes;