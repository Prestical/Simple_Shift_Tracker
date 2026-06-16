# Simple Shift Tracker

Purpose of this program is simple setup and simple usage with only one QR Code to clock in and clock out.
Also added local QR code maker to avoiding link leakage in online platforms of the Google Apps Script link. 

## How it works ?

It works in the Google Apps Script platform and Google Sheets. It is triggered when the QR Code is scanned. 

1) If it is the first time of the scan from an employee, it wants to employee to enter his/her name.
2) Script takes this input and saves it to the browsers local storage with localStorage() function.
3) After script appends the employee clock in/clock out information name, action, date and time to the google sheets.
4) For each reloding or revisiting the QR Code changes the action IN -> OUT or OUT -> IN loop.

## Requirements

- Google App Script
- Google Sheets File
    - Columns will be || Employee Name | Action | Data | Time || format


## Setup

1) Open the google sheets and go Extentions > Apps Script File
2) Then you have to open a new script in Google Apps Script.
3) Import main.gs file to the Google Apps Script.
4) Deploy the script
5) Copy the link given in the deploy page.
6) Paste it to the ```makeqr.py``` file.
7) Enter ```pip install qrcode pillow```
8) Run the ```makeqr.py``` with ```python3 makeqr.py```

Thats it ! You have working shift tracker and QR Code for it.

## WARNING

Please protect your QR code and link. Bad behaviour hacker might be access the google sheets and change or enter invalid and unauthorized logs to the sheet. Consider this possibilities please. 

For XSS code injection tried to prevent it but not sure how effective it is.

## Images 

![<img src="/images/clock-in.jpeg" width="250" height="450" /](/images/clock-in.jpeg)
![<img src="/images/clock-out.jpeg" height="450" /](/images/clock-out.jpeg)
