var sentence = "";

document.addEventListener('click',function(e){
    if(e.target && e.target.innerHTML == 'save'){
        if (isRude() && confirm("This is rude! Are you sure you want to post this?")) {
            
        } else {
            alert(sentence);
            e.preventDefault();
        };
    }
})

function isRude() {
    return true;
}

document.addEventListener('keyup', function(e){
    if (e.target && e.target.localName == 'textarea') {
        sentence = e.target.value;
    };
})