# Facebook Chrome Extension Notes
William Reames

## 02/20/2023

The following javascript code can successfully pull text from Facebook as a user is scrolling through the page:


```javascript
var lastLog = "";

window.addEventListener("scroll", () => {
    console.log("Event Listener: scroll");

    const newLog = document.getElementById("facebook").innerText;

    var start = newLog.indexOf(lastLog);
    var end = start + lastLog.length;

    var currentLog = newLog.substring(0, start - 1) + newLog.substring(end);

    console.log(currentLog);

    if(newLog.length !== 0){
        lastLog = newLog;
    }

});
```

The text still needs to be processed, but I think if I start from an instance of "." and end at an instance of "All reactions:", I should be able to process the text.

### Sample entries:

The following samples of texts were taken from the current run on a Facebook page. Each entry only appeared once. These were taken out of the logged text manually.

```
Attention motorists on State Route 99!
Officer Kennell is out there working speed enforcement and making sure everyone stays safe on the road. Let's make sure we're abiding by the speed limit and keeping our highways safe for all.
Here's a fun fact: Did you know that the fastest speeding ticket ever given was in Texas in 2003? The driver was going a whopping 242 mph in a 75 mph zone! Let's make sure we stay within the speed limit and avoid getting any tickets ourselves. D… See more

Sign up for HBO Max to stream every episode of House of the Dragon. Plans start at $9.99/month.
HBOMAX.COM
Watch Season 1 Now
Return to Westeros.

IMPOSSIBLE COCONUT 
 PIE
All the ingredients are mixed together and poured into a pie tin, but when it cooks it forms its own crust with filling This has a coconut vanilla taste like a coconut cream pie ! It never fails me ! 
Ingredients
2 cups milk
1 cup shredded coconut… See more

Campbell’s…. Savage!  Love it!

Got to see these beauties last night!  Did a soul good (just not my head or tummy)!  Love this family!

We are preparing to rock Franklin one day soon.
```
