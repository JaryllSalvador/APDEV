let reserve = document.getElementById('reserve');
let seatNumber = document.getElementById('seat-number');

let seats = Array.from(document.getElementsByClassName('seat'));

let availableSeats = Array(45).fill(null);

// For testing only
availableSeats[20] = "Reever";
availableSeats[22] = "Abigail";
availableSeats[0] = "Ghee";
availableSeats[42] = "Jaryll";
let selectedSeat = null;

const reserve_seat = () => {
    seats.forEach((seat, index) => {
        // Set initial color based on availability
        seat.style.backgroundColor = availableSeats[index] !== null ? '#5b6062' : '#e8eae9';
        seat.addEventListener('click', seatClicked);
    });
};

function seatClicked(e) {
    const id = e.target.id;

    if (availableSeats[id] !== null) {
        seatNumber.textContent = "This seat is occupied by: " + availableSeats[id];
        // Deselect the previously selected seat
        if (selectedSeat !== null) {
            selectedSeat.style.backgroundColor = availableSeats[selectedSeat.id] !== null ? '#5b6062' : '#e8eae9';
        }
        selectedSeat = null;
        return; // Skip if occupied
    }

    if (e.target === selectedSeat) {
        return; // Skip if already selected
    }

    // Reset color of previously selected seat if exists
    if (selectedSeat !== null) {
        selectedSeat.style.backgroundColor = availableSeats[selectedSeat.id] !== null ? '#5b6062' : '#e8eae9';
    }

    e.target.style.backgroundColor = '#7fc4ea';
    seatNumber.textContent = "Seat #" + (parseInt(id) + 1);

    selectedSeat = e.target;
}

reserve_seat();
