# Fetch Request Limiter

This project is aimed to simulate a Fetch API request throttler, that can control the flow of incoming / outgoing requests, helping the server to not get overloaded.

If the incoming requests outnumber the number of threads available, the requests are queued in a pipeline and called in a FIFO manner once resources get available.
Observer Design methodology has been adopted for the implementation.


#### Steps to Launch:
* Launch [Home Page](https://smehra-office.github.io/) and open the project by clicking on the first link available in the menu.
* Select the number of threads / workers that you want to simulate by dragging the slider.
* Once set, click on a **Create Async Request** button to mock any N number of asynchronous requests. 
* The entire simulation of how each of the requests is getting handled will be visually shown and updated in real time.
* If you want to restart again, simply click on **Reset** button, and follow the steps again from Step 1.


### Note:

- This project is built with mobile-first approach, and is **responsive** across all screen sizes and dimensions.
- **Data leaks** have been avoided, by performing cleanup actions at page mount and unmount. 
- Please feel free to suggest feedback and quality improvements, it will be highly appreciated. :)
