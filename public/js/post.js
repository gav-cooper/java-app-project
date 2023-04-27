"use strict";

const jsmediatags = window.jsmediatags;

const covers = document.getElementsByClassName('cover');
for (let j = 0; j < covers.length; j++){ 
    jsmediatags.read(`http://localhost:8000${covers[j].attributes.path.value}`, {
        onSuccess: function (tag) {
            const data = tag.tags.picture.data;
            const format = tag.tags.picture.format;
            let base64String = "";
            for(let i = 0; i < data.length; i++)
                base64String += String.fromCharCode(data[i]);

            covers[j].style.backgroundImage = `url(data:${format};base64,${window.btoa(base64String)})`;
        },
        onError: function(error ){
            
        }
    })
}

// for (let j = 0; j < covers.length; j++) {
//     if (!covers[j].style.backgroundImage)
//         covers[j].style.backgroundImage = `url(http://localhost:8000/pfp/pfp.png)`
// }