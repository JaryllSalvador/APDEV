let reserve = document.getElementById('reserve');
let seatNumber = document.getElementById('seat-number');

let seats = Array.from(document.getElementsByClassName('seat'));
    // console.log(document.getElementById("seat-" + '0').getAttribute("data-value"));
let availableSeats = Array(seats.length).fill(null);

for (let i = 0; i < availableSeats.length; i++) {
    if (document.getElementById(i).getAttribute("data-name") !== "none") {
        // availableSeats[i] = document.getElementById(i).getAttribute("data-value");
        availableSeats[i] = new Map();
        availableSeats[i].set("seat_id", document.getElementById(i).getAttribute("id"));
        availableSeats[i].set("seat_order", document.getElementById(i).getAttribute("data-order"));
        availableSeats[i].set("is_occupied", true);
        availableSeats[i].set("name", document.getElementById(i).getAttribute("data-name"));
    }
    else {
        // availableSeats[i] = null;

        availableSeats[i] = new Map();
        availableSeats[i].set("seat_id", document.getElementById(i).getAttribute("id"));
        availableSeats[i].set("seat_order", document.getElementById(i).getAttribute("data-order"));
        availableSeats[i].set("is_occupied", false);
    }
}

// console.log(availableSeats[71].get("seat_order"));

let selectedSeat = null;

const reserve_seat = () => {
    seats.forEach((seat, index) => {
        // Set initial color based on availability
        seat.style.backgroundColor = availableSeats[index].get("is_occupied") !== false ? '#5b6062' : '#e8eae9';
        seat.addEventListener('click', seatClicked);
    });
};

function seatClicked(e) {
    const id = e.target.id;


    if (availableSeats[id].get("is_occupied") === true) {
        seatNumber.textContent = "This seat is occupied by: " + availableSeats[id].get("name");
        // Deselect the previously selected seat
        if (selectedSeat !== null) {
            selectedSeat.style.backgroundColor = availableSeats[selectedSeat.id].get("is_occupied") !== false ? '#5b6062' : '#e8eae9';
        }
        selectedSeat = null;
        return; // Skip if occupied
    }

    if (e.target === selectedSeat) {
        return; // Skip if already selected
    }

    // Reset color of previously selected seat if exists
    if (selectedSeat !== null) {
        // console.log(availableSeats[selectedSeat.id].get("is_occupied"));
        // console.log(availableSeats);

        selectedSeat.style.backgroundColor = availableSeats[selectedSeat.id].get("is_occupied") !== false ? '#5b6062' : '#e8eae9';
    }

    e.target.style.backgroundColor = '#7fc4ea';
    // console.log(id);
    seatNumber.textContent = "Seat #" + (parseInt(availableSeats[id].get("seat_order")) + 1);

    selectedSeat = e.target;
    // console.log(selectedSeat);
}

reserve_seat();