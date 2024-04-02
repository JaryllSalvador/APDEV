let reserve = document.getElementById('reserve');
let seatNumber = document.getElementById('seat-number');

let bodyContainer = document.querySelector('.body-container');
let account_id = bodyContainer.getAttribute('account-id');
let is_admin = bodyContainer.getAttribute('is-admin');

let seats = Array.from(document.getElementsByClassName('seat'));
let availableSeats = Array(seats.length).fill(null);

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
    }
}

let selectedSeat = null;

const reserve_seat = () => {
    seats.forEach((seat, index) => {
        seat.style.backgroundColor = availableSeats[index].get("user_id") === account_id ? '#F58216' : availableSeats[index].get("is_occupied") !== false ? '#5b6062' : '#e8eae9';
        seat.addEventListener('click', seatClicked);
    });
};

function seatClicked(e) {
    const id = e.target.id;
    let editBtn = document.getElementById('editBtn');
    let deleteBtn = document.getElementById('deleteBtn');
    let reserve = document.getElementById('reserve');
    let reserveAnon = document.getElementById('reserveAnon');
    let reserveWI = document.getElementById('reserveWI');

    if (availableSeats[id].get("is_occupied") === true) {

        if(availableSeats[id].get("is_anon") === "true")
        {
            if(is_admin === "true" || availableSeats[id].get("user_id") === account_id)
                seatNumber.textContent = "This seat is occupied by: " + availableSeats[id].get("name");
            else seatNumber.textContent = "This seat is occupied by an anonymous user"
        } else seatNumber.textContent = "This seat is occupied by: " + availableSeats[id].get("name");
        
        if (selectedSeat !== null) {
            selectedSeat.style.backgroundColor = availableSeats[selectedSeat.id].get("is_occupied") !== false ? '#5b6062' : '#e8eae9';
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
            if(availableSeats[id].get("user_id") === account_id)
            {
                reserve.style.display = 'none';
                reserveAnon.style.display = 'none';
                editBtn.style.display = 'block';
                deleteBtn.style.display = 'block';
            }
            else 
            {
                reserve.style.display = 'none';
                reserveAnon.style.display = 'none';
                editBtn.style.display = 'none';
                deleteBtn.style.display = 'none';
            }
        }

        return;
    }

    if (e.target === selectedSeat) {
        return; 
    }

    if (selectedSeat !== null) {
        selectedSeat.style.backgroundColor = availableSeats[selectedSeat.id].get("is_occupied") !== false ? '#5b6062' : '#e8eae9';
    }

    e.target.style.backgroundColor = '#7fc4ea';

    seatNumber.textContent = "Seat #" + (parseInt(availableSeats[id].get("seat_order")) + 1);

    selectedSeat = e.target;

    reserve.style.display = 'block';

    if(is_admin === "true")
        reserveWI.style.display = 'block';
    else reserveAnon.style.display = 'block';

    editBtn.style.display = 'none';
    deleteBtn.style.display = 'none';
}

reserve_seat();

$(document).ready(function() {
    $('#reserve').hide();
    $('#reserveAnon').hide();
    $('#reserveWI').hide();
    $('#editBtn').hide();
    $('#deleteBtn').hide();

    $('#rooms, #time-slots').on('change', function() {
        // Get selected values
        let room = $('#rooms').val();
        let time = $('#time-slots').val();
        
        // Hide all room slots
        $('.room-slot').hide();
        
        // Show selected room slot
        let room_id = "#" + room + "-" + time;
        $(room_id).show();
    });
    
    // Trigger change event initially to show the default selected room and time
    $('#rooms, #time-slots').trigger('change');
});
