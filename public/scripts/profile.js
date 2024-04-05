function toggleEditMode() {
    console.log("CALLED");
    const firstname = document.querySelector('.firstname');
    const lastname = document.querySelector('.lastname');
    const profilePicture = document.getElementById('profile-picture')
    const profileemail = document.getElementById('profileemail')
    const accountname = document.getElementById('accountname');
    const editProfile = document.querySelector('.edit-button')
    const deleteButton = document.querySelector('.delete-button');

    if (firstname.contentEditable == 'false' || !firstname.hasAttribute("contentEditable") || !firstname.hasAttribute("contenteditable") ) {
        firstname.contentEditable = true;
        lastname.contentEditable = true;
        profileemail.contentEditable = true;
        editProfile.textContent = 'Save Account';
        deleteButton.style.display = 'block'; // Show delete button
    } else {
        // disable edit
        firstname.contentEditable = false;
        lastname.contentEditable = false;
        profileemail.contentEditable = false;
        editProfile.textContent = 'Edit Account';
        deleteButton.style.display = 'none'; // Hide delete button

        //for editing the db itself
        fetch('/edit-profile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                profile_email: profileemail.textContent,
                firstname: firstname.textContent,
                lastname: lastname.textContent,
                account_name: accountname.textContent}) // pass email of user to be edited (key)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to edit profile');
                }
                // action after editing
                // viewPage('');
            })
            .catch(error => {
                console.error('Error editing profile:', error);
            });

    }
}
function deleteProfile() {
    const accountname = document.getElementById('accountname');
    // Show confirmation dialog
    const confirmDelete = confirm("Are you sure you want to delete your account?");

    if (confirmDelete) {
        // User confirmed deletion, proceed with AJAX request
        fetch('/delete-profile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({account_name: accountname.textContent}) // pass email of user to be deleted (key)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to delete profile');
                }
                // action after deletion
                window.location.href = "/";
            })
            .catch(error => {
                console.error('Error deleting profile:', error);
            });
    }
}
    const pfpUpload = document.getElementById('file-input');
    function pfpUploadClick () {
        pfpUpload.click();
    }

    pfpUpload.addEventListener('change', function(event) {
        event.preventDefault(); // prevent default form submission


        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('file', file);

        // send POST request to server
        fetch('/uploadPfp', {
            method: 'POST',
            body: formData
        })
            .then(response => {
                if (response.ok) {
                    console.log('File uploaded successfully');
                } else {
                    console.error('File upload failed');
                }
            })
            .catch(error => {
                console.error('Error during file upload:', error);
            });
    });
    function uploadProfilePicture(file) {
        // file upload
        console.log('Uploading profile picture:', file.name);

        const accountname = document.getElementById('accountname');
        const pfpURL = document.getElementById("profilepic");

        // formdata (to hold image file)
        const formData = new FormData();
        formData.append('picture', file, file.name);
        formData.append('account_name', accountname.textContent);

        // send POST request to send file to server
        fetch('/uploadProfilePicture', {
            method: 'POST',
            body: formData
        })
            .then(response => {
                if (response.ok) {
                    //upload successful yippieeeeee
                    console.log('Profile picture uploaded successfully');
                    pfpURL.src = '/images/uploads/' + file.name;
                    location.reload();
                } else {
                    //upload failed
                    console.error('Profile picture upload failed');
                }
            })
            .catch(error => {
                //err
                console.error('Error during profile picture upload:', error);
            });
    }

