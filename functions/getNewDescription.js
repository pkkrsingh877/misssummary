const getNewDescription = (str) => {
    //counting number of words in description
    let count = 1
    let j = 0;
    let length = 30;
    for(let i=0; i< str.length; i++){
        if(str[i] === " "){
            count++; 
            if(count === length){
              j = i;
            }
        }
    }
    return str.slice(0, j);
}

module.exports = getNewDescription;
