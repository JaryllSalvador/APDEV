let reserve = document.getElementById('reserve');
let seatNumber = document.getElementById('seat-number');

let bodyContainer = document.querySelector('.body-container');
let account_id = bodyContainer.getAttribute('account-id');
let account_f = bodyContainer.getAttribute('account-f');
let account_l = bodyContainer.getAttribute('account-l');
let is_admin = bodyContainer.getAttribute('is-admin');

let fullname = account_f.concat(" ", account_l);

let seats = Array.from(document.getElementsByClassName('seat'));
let availableSeats = Array(seats.length).fill(null);

let current_seat_id = 0;

let id, room, time;

for (let i = 0; i < availableSeats.length; i++) {
    if (document.getElementById(i).getAttribute("data-name") !== "none") {
        availableSeats[i] = new Map();
        availableSeats[i].set("seat_id", document.getElementById(i).getAttribute("id"));
        availableSeats[i].set("seat_order", document.getElementById(i).getAttribute("data-order"));
        availableSeats[i].set("is_occupied", true);
        availableSeats[i].set("name", document.getElementById(i).getAttribute("data-name"));
        availableSeats[i].set("user_id", document.getElementById(i).getAttribute("user-id"));
        availableSeats[i].set("is_anon", document.getElementById(i).getAttribute("is-anon"));
    }
    else {
        availableSeats[i] = new Map();
        availableSeats[i].set("seat_id", document.getElementById(i).getAttribute("id"));
        availableSeats[i].set("seat_order", document.getElementById(i).getAttribute("data-order"));
        availableSeats[i].set("is_occupied", false);
        availableSeats[i].set("name", "none");
        availableSeats[i].set("user_id", null);
        availableSeats[i].set("is_anon", false);
    }
}

let selectedSeat = null;

const reserve_seat = () => {
    seats.forEach((seat, index) => {
        seat.style.backgroundColor = availableSeats[index].get("user_id") == account_id ? '#F58216' : availableSeats[index].get("is_occupied") !== false ? '#5b6062' : '#e8eae9';
        seat.addEventListener('click', seatClicked);
    });
};

function seatClicked(e) {
    id = e.target.id;
    current_seat_id = id;
    let editBtn = document.getElementById('editBtn');
    let editBtn2 = document.getElementById('editBtn2');
    let deleteBtn = document.getElementById('deleteBtn');
    let reserve = document.getElementById('reserve');
    let reserveAnon = document.getElementById('reserveAnon');
    let reserveWI = document.getElementById('reserveWI');

    if (availableSeats[id].get("is_occupied") === true) {

        if(availableSeats[id].get("is_anon") === "true")
        {
            if(is_admin === "true" || availableSeats[id].get("user_id") == account_id)
                seatNumber.innerHTML = "This seat is occupied by: <a href='http://localhost:3000/search?user=" + account_id + "&profile=" + encodeURIComponent(availableSeats[id].get("user_id")) + "' style='color: blue; text-decoration: underline;'>" + availableSeats[id].get("name") + "</a>";
            else seatNumber.textContent = "This seat is occupied by an anonymous user"
        } else seatNumber.innerHTML = "This seat is occupied by: <a href='http://localhost:3000/search?user=" + account_id + "&profile=" + encodeURIComponent(availableSeats[id].get("user_id")) + "' style='color: blue; text-decoration: underline;'>" + availableSeats[id].get("name") + "</a>";
        
        if (selectedSeat !== null) {
            selectedSeat.style.backgroundColor = availableSeats[selectedSeat.id].get("user_id") == account_id ? '#F58216' : availableSeats[selectedSeat.id].get("is_occupied") !== false ? '#5b6062' : '#e8eae9';
        }
        selectedSeat = null;
        
        if(is_admin === "true")
        {
            reserve.style.display = 'none';
            reserveWI.style.display = 'none';
            editBtn.style.display = 'block';
            deleteBtn.style.display = 'block';
        }
        else
        {
            if(availableSeats[id].get("user_id") == account_id)
            {
                reserve.style.display = 'none';
                reserveAnon.style.display = 'none';
                editBtn.style.display = 'none';
                editBtn2.style.display = 'block';
                deleteBtn.style.display = 'block';
            }
            else 
            {
                reserve.style.display = 'none';
                reserveAnon.style.display = 'none';
                editBtn.style.display = 'none';
                editBtn2.style.display = 'none';
                deleteBtn.style.display = 'none';
            }
        }


        return;
    }

    if (e.target === selectedSeat) {
        return; 
    }

    if (selectedSeat !== null) {
        selectedSeat.style.backgroundColor = availableSeats[selectedSeat.id].get("user_id") == account_id ? '#F58216' : availableSeats[selectedSeat.id].get("is_occupied") !== false ? '#5b6062' : '#e8eae9';
    }

    e.target.style.backgroundColor = '#7fc4ea';

    seatNumber.textContent = "Seat #" + (parseInt(availableSeats[id].get("seat_order")) + 1);

    selectedSeat = e.target;

    reserve.style.display = 'block';

    if(is_admin === "true")
        reserveWI.style.display = 'block';
    else reserveAnon.style.display = 'block';

    editBtn.style.display = 'none';
    editBtn2.style.display = 'none';
    deleteBtn.style.display = 'none';
}

$(document).ready(function() {
    $('#reserve').hide();
    $('#reserveAnon').hide();
    $('#reserveWI').hide();
    $('#editBtn').hide();
    $('#editBtn2').hide();
    $('#deleteBtn').hide();

    $('#rooms, #time-slots').on('change', function() {
        // Get selected values
        room = $('#rooms').val();
        time = $('#time-slots').val();
        
        // Hide all room slots
        $('.room-slot').hide();
        
        // Show selected room slot
        let room_id = "#" + room + "-" + time;
        $(room_id).show();
    });
    
    // Trigger change event initially to show the default selected room and time
    $('#rooms, #time-slots').trigger('change');

    document.getElementById('reserve').addEventListener('click', function() {
        $('#reserve').hide();
        $('#reserveAnon').hide();
        $('#reserveWI').hide();
        $('#seat-number').text('No seat selected.');
    });

    document.getElementById('reserveAnon').addEventListener('click', function() {
        $('#reserve').hide();
        $('#reserveAnon').hide();
        $('#seat-number').text('No seat selected.');
    });

    document.getElementById('reserveWI').addEventListener('click', function() {
        $('#reserve').hide();
        $('#reserveWI').hide();
        $('#seat-number').text('No seat selected.');
    });

    document.getElementById('deleteBtn').addEventListener('click', function() {
        $('#editBtn').hide();
        $('#editBtn2').hide();
        $('#deleteBtn').hide();
        $('#seat-number').text('No seat selected.');
    });

    reserve_seat();
});

let seatnum;

function createRes() {
    $.post('create_reservation',{ 
        room_id: room, time: time, seat_id: id, fullname: fullname, anon: false, account_id: account_id
    }, async function(data, status){
        if(status === 'success'){ 
            console.log(data.seat);
            availableSeats[data.seat['seat-id']].set("is_occupied", data.seat['is-occupied']);
            availableSeats[data.seat['seat-id']].set("name", data.seat['occupant']);
            availableSeats[data.seat['seat-id']].set("user_id", data.seat['id-number']);
            availableSeats[data.seat['seat-id']].set("is_anon", data.seat['is-anon']);
            console.log(availableSeats[data.seat['seat-id']]);
            seatnum = Number(data.seat['seat-order']) + 1;
            await reserve_seat()
            alert("Successfully Reserved Seat #"+ seatnum)
        }
    });//post
}

function reserveAnon() {
    $.post('create_reservation',{ 
        room_id: room, time: time, seat_id: id, fullname: fullname, anon: true, account_id: account_id
    }, async function(data, status){
        if(status === 'success'){ 
            availableSeats[data.seat['seat-id']].set("is_occupied", data.seat['is-occupied']);
            availableSeats[data.seat['seat-id']].set("name", data.seat['occupant']);
            availableSeats[data.seat['seat-id']].set("user_id", data.seat['id-number']);
            availableSeats[data.seat['seat-id']].set("is_anon", data.seat['is-anon']);
            seatnum = Number(data.seat['seat-order']) + 1;
            reserve_seat();
            await alert("Successfully reserved seat #"+ seatnum);
        }
    });//post
}

function deleteRes() {
    $.post('delete_reservation',{ 
        room_id: room, time: time, seat_id: id
    }, function(data, status){
        if(status === 'success'){ 
            availableSeats[data.seat['seat-id']].set("is_occupied", data.seat['is-occupied']);
            availableSeats[data.seat['seat-id']].set("name", data.seat['occupant']);
            availableSeats[data.seat['seat-id']].set("user_id", data.seat['id-number']);
            availableSeats[data.seat['seat-id']].set("is_anon", data.seat['is-anon']);
            seatnum = Number(data.seat['seat-order']) + 1;
            reserve_seat();
            alert("Successfully removed reservation for seat #"+ seatnum);
        }
    });//post
}


function openEditPopUp() {
    document.getElementById("popupForm").reset();
    document.getElementById("popup").style.display = "block";
}

function closeEditPopUp() {
    document.getElementById("popup").style.display = "none";
}

document.getElementById("popupForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent the form from submitting normally
    
    // Get form values
    var account_id = document.getElementById("id").value;
    
    // Do something with the values (e.g., send them to server)
    $.post('create_reservation2',{ 
        room_id: room, time: time, seat_id: id, anon: false, account_id: account_id
    }, function(data, status){
        if(status === 'success'){ 
            if (data.valid_status) {
                console.log(data.seat);
                availableSeats[data.seat['seat-id']].set("is_occupied", data.seat['is-occupied']);
                availableSeats[data.seat['seat-id']].set("name", data.fullname);
                availableSeats[data.seat['seat-id']].set("user_id", data.seat['id-number']);
                availableSeats[data.seat['seat-id']].set("is_anon", data.seat['is-anon']);
                console.log(availableSeats[data.seat['seat-id']]);
                seatnum = Number(data.seat['seat-order']) + 1;
                reserve_seat();
                alert("Successfully edited seat #"+ seatnum);
            }
            else {
                alert("Please input a valid Student ID.");
            }
        }
    });//post
    
    // Close the popup
    closeEditPopUp();
});

document.querySelector(".close").addEventListener("click", function() {
    closePopup();
  });


function editRes() {

    const oldSeatId = current_seat_id;
    // console.log(oldSeatId + " " +)
    alert("Please select a new seat.");
    
    updateReservation(oldSeatId);

}

function updateReservation(oldSeatId) {
    console.log("oldid in UR:" + oldSeatId);

    $.post('delete_reservation', { 
        room_id: room, 
        time: time, 
        seat_id: oldSeatId 
    }, function(data, status) {
        if (status === 'success') { 

            seats.forEach((seat, index) => {
                seat.addEventListener('click', function() {
                    if (!availableSeats[index].get("is_occupied")) {
                        availableSeats[oldSeatId].set("is_occupied", false);
                        availableSeats[oldSeatId].set("name", "none");
                        availableSeats[oldSeatId].set("user_id", null);
                        availableSeats[oldSeatId].set("is_anon", false);

                        $.post('create_reservation', { 
                            room_id: room, 
                            time: time, 
                            seat_id: index, 
                            fullname: fullname, 
                            anon: false, 
                            account_id: account_id 
                        }, function(data, status) {
                            if (status === 'success') { 
                                availableSeats[index].set("is_occupied", data.seat['is-occupied']);
                                availableSeats[index].set("name", data.seat['occupant']);
                                availableSeats[index].set("user_id", data.seat['id-number']);
                                availableSeats[index].set("is_anon", data.seat['is-anon']);

                                reserve_seat();

                                alert("Successfully edited reservation. Seat #" + (Number(data.seat['seat-order']) + 1) + " is now reserved.");
                                location.reload();
                            }
                        });
                    } else {
                        alert("Selected seat is already occupied. Please choose another seat.");
                    }
                });
            });
        }
    });
}
