module.exports = {
    format: function(d) {
        var day     = d.getDate(),
            month   = d.getMonth() + 1, //January is 0!
            year    = d.getFullYear(),
            hours   = d.getHours(),
            minutes = d.getMinutes(),
            seconds = d.getSeconds();

        if (day < 10){
            day = '0' + day
        }

        if (month < 10){
            month = '0' + month
        }

        if (hours < 10) {
            hours = '0' + hours;
        }

        if (minutes < 10) {
            minutes = '0' + minutes;
        }

        if (seconds < 10) {
            seconds = '0' + seconds;
        }

        return {
            day: day,
            month: month,
            year: year,
            hours: hours,
            minutes: minutes,
            seconds: seconds
        };
    }
};