$(document).ready(function() {
  // Target future date/24 hour time/Timezone
  let targetDate = moment.tz("2026-06-21 12:00", "Europe/Amsterdam");
  
  // Update the countdown every second
  let countdownInterval = setInterval(function() {
    // Get current date and time
    let currentDate = new Date();
    
    // Calculate the difference in seconds between the future and current date
    let diffTime = targetDate.valueOf() - currentDate.getTime();
    
    if (diffTime <= 0) {
      // If the event has passed, clear interval and set all to 0
      clearInterval(countdownInterval);
      document.getElementById('days').innerText = "0";
      document.getElementById('hours').innerText = "0";
      document.getElementById('minutes').innerText = "0";
      document.getElementById('seconds').innerText = "0";
      console.log("De datum is al voorbij!");
      return;
    }
    
    // Calculate days, hours, minutes, and seconds
    let days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    let hours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((diffTime % (1000 * 60)) / 1000);
    
    // Update the countdown display
    document.getElementById('days').innerText = days;
    document.getElementById('hours').innerText = hours;
    document.getElementById('minutes').innerText = minutes;
    document.getElementById('seconds').innerText = seconds;
  }, 1000);
  
  // Hide the original FlipClock
  $(".clock").hide();
});