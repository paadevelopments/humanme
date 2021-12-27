# HumanMe
A javascript CAPTCHA library for your web apps to keep the bots out.

> **NOTE:** This is an extension of @honguangli [ JQuery CAPTCHA ](https://github.com/honguangli/jquery-captcha)

## Preview


## Getting Started [ installation ]
```
<head>
<script src="jquery.js"></script>
<script src="human.me.js"></script>
</head>
```
## Usage
```
// CAPTCHA INITIATION AND OPTIONS
var human = new HumanMe($('#div_to_set_captcha'),{
  length : 6,                       // Lenght of captcha text. Default = 6

  font : 'bold 35px Arial',         // Renderer font style. Default = 'bold 35px Arial'

  resourceType : 'aA0',             // Charset. Set 'a' for lowerCase letters only. Set 'A' for upperCase letters only,
                                    // Set '0' for numbers only. You can pair formats like 'A0' for upperCase letters and
                                    // numbers only or 'a0' for lowerCase letters and numbers only. Default = 'aA0'

  caseSensitive : true,             // Validation string case sensitivity. Set false to disable. Default = true

  autoRefresh : true,               // Auto refresh with counter. Set false to disable. Default = true

  progressColor : '#6671F0',        // Auto refresh progress color. Only works if autoRefresh is true. Default color '#6671F0'

  manualRefresh : true,             // Manual refresh button. Set false to disable

  refreshButtonColor : '#6671F0'    // Manual refresh button color. Only works if manualRefresh is true
})

// OBJECT METHODS
human.validate("string to verify")  // For validation. Takes one parameter. String. Returns true or false
human.stop()                        // For stopping autoRefresh. Works only if autoRefresh is enabled
human.getCode()                     // To get rendered code
```
## Release History
*  Initial [ v1.0.0 ]

## License
MIT
