"use strict";

let button = document.getElementsByClassName("button");
for (let i = 0; i < button.length; i++) {
    button[i].addEventListener("click", deletePost);
}

/*  Deletes a user's post by extracting the ID from the event and sending a
    delete request
*/
async function deletePost(event) {
    // get post id from the event
    const musicID = event.target.attributes.path.value;
    const id = event.target.attributes.id.value;
    console.log(event);
    try {
        const response = await fetch(`/music/${musicID}/${id}`, {
            "method": "DELETE",
            "headers": {
                "Content-Type": "application/json"
            }
        });
        // reload the page
        if (response.ok)
            location.reload();
    } catch(error) {
        console.log("Could not like")
        location.reload();
    }
}