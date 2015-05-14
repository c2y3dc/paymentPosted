# paymentPosted

## onTime is a function that takes a due date to verify if a payment made right now will be posted on time before the due date. If invalid, return the next date it will be processed.

###Does not take into account business hours. 
###Assume bank days (i.e. not weekends/holidays), and 3 days for processing time.
###Date and time in GMT