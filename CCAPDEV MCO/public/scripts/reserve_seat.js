let reserve = document.getElementById('reserve');
let seatNumber = document.getElementById('seat-number');

let seats = Array.from(document.getElementsByClassName('seat'));
let availableSeats = Array(seats.length).fill(null);

for (let i = 0; i < availableSeats.length; i++) {
    if (document.getElementById(i).getAttribute("data-name") !== "none") {
        availableSeats[i] = new Map();
        availableSeats[i].set("seat_id", document.getElementById(i).getAttribute("id"));
        availableSeats[i].set("seat_order", document.getElementById(i).getAttribute("data-order"));
        availableSeats[i].set("is_occupied", true);
        availableSeats[i].set("name", document.getElementById(i).getAttribute("data-name"));
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
        seat.style.backgroundColor = availableSeats[index].get("is_occupied") !== false ? '#5b6062' : '#e8eae9';
        seat.addEventListener('click', seatClicked);
    });
};

function seatClicked(e) {
    const id = e.target.id;


    if (availableSeats[id].get("is_occupied") === true) {
        seatNumber.textContent = "This seat is occupied by: " + availableSeats[id].get("name");
        if (selectedSeat !== null) {
            selectedSeat.style.backgroundColor = availableSeats[selectedSeat.id].get("is_occupied") !== false ? '#5b6062' : '#e8eae9';
        }
        selectedSeat = null;
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
}


reserve_seat();

$(document).ready(function() {
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
