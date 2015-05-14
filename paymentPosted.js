/*
onTime is a function that takes a due date to verify if a payment made right now will be posted on time before the due date. If invalid, return the next date it will be processed.

Does not take into account business hours. Assume bank days (i.e. not weekends/holidays), and 3 days for processing time.

Date and time in GMT

-----
input: Date Object or Date String
output: boolean and if false return date payment will be posted
-----
ideas
1/ check if current Day() + 3 within valid range
& within biz days req 
2/ if yes return true
3/ else pad non-business days and return actual processed date
*/

// extend Date object with addDays method
Date.prototype.addDays = function(days){
    this.setDate(this.getDate() + parseInt(days));
    return this;
};

var onTime = function(dueDate){
    // today's Date object & day of the week (in GMT)
    var now = new Date();
    var today = now.getDay();
    var processed = now;
    var dueDateObj;

    // parses date String into Date Object
    if(   !(dueDate instanceof Date) 
        && (typeof dueDate === 'string')
    ){
        dueDateObj = new Date(dueDate);
    }
    
    // handles days of the week to account for business days
    // date payment sent does not count as business day 
    // i.e. payment sent on Monday will be processed on Thursday
    if(today < 3){
        padDays(3, processed);
    }else if(today > 5){
        padDays(4, processed);
    }else{
        padDays(5, processed);
    }
    
    // handles case where input is a Date Object
    if(!dueDateObj){
        dueDateObj = dueDate;
    }
    
    // checks if payment is posted before due date
    if(dueDateObj - processed > 0){
        return true;  
    }
    
    // return actual process date for late/invalid input
    return processed;
}

// function to pad days to date
var padDays = function(days, date){
    for(var i = 0; i < days; i++){
        date.addDays(1);
        if(isHoliday(date)){
            date.addDays(1);
        }
    }
}

var isHoliday = function(date){
    // check simple dates (month/date - no leading zeroes)
    var nDate = date.getDate(),
        nMonth = date.getMonth() + 1;
    var sDate1 = nMonth + '/' + nDate;

    if (   sDate1 === '1/1'   // New Year's Day
        || sDate1 === '6/14'  // Flag Day
        || sDate1 === '7/4'   // Independence Day
        || sDate1 === '11/11' // Veterans Day
        || sDate1 === '12/25' // Christmas Day
    ){ 
        return true;
    }

    // weekday from beginning of the month (month/num/day)
    var nWday = date.getDay();
    var nWnum = Math.floor((nDate - 1) / 7) + 1;
    var sDate2 = nMonth + '/' + nWnum + '/' + nWday;

    if (   sDate2 === '1/3/1'  // Birthday of Martin Luther King, third Monday in January
        || sDate2 === '2/3/1'  // Washington's Birthday, third Monday in February
        || sDate2 === '5/3/6'  // Armed Forces Day, third Saturday in May
        || sDate2 === '9/1/1'  // Labor Day, first Monday in September
        || sDate2 === '10/2/1' // Columbus Day, second Monday in October
        || sDate2 === '11/4/4' // Thanksgiving Day, fourth Thursday in November
    ){ 
        return true;
    }

    // weekday number from end of the month (month/num/day)
    var dTemp = new Date(date);
    dTemp.setDate(1);
    dTemp.setMonth(dTemp.getMonth() + 1);
    dTemp.setDate(dTemp.getDate() - 1);
    nWnum = Math.floor((dTemp.getDate() - nDate - 1) / 7) + 1;
    var sDate3 = nMonth + '/' + nWnum + '/' + nWday;

    // Memorial Day, last Monday in May
    if (sDate3 === '5/1/1'){
        return true;
    }

    // misc complex dates
    // Inauguration Day, January 20th every four years, starting in 1937
    if (sDate1 === '1/20' && (((date.getFullYear() - 1937) % 4) === 0)){
        return true;
    }

    // Election Day, Tuesday on or after November 2 
    if (nMonth === 11 && nDate >= 2 && nDate < 9 && nWday === 2){ 
        return true;
    }

    return false;
}
