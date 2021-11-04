const countHtmlTags = (str) => {
    const arr=[]
    for(let i = 0; i< str.length; i++){
        if(str[i] == '<'){
            let j = i;
            let temp = "";
            while(str[j] != '>'){
            temp = temp + str[j];
            j++;
            }
            if(temp != ""){
            temp = temp + ">";
            arr.push(temp);
            }
        }
    }
    return arr.length;
} 

module.exports = countHtmlTags;