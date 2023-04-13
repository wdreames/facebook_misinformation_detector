# Facebook Misinformation Detector

William Reames\
04/23/2023

## About this Repository

This repository contains the source code for a Chrome Extension that can detect misinformation within Facebook posts. If the extension detects any potential misinformation, the text will be highlighted in red. This can allow a user to be more aware of potential misinformation.

However, the extension is only making its best approximations for what could potentially be misinformation, and it may not be entirely accurate. 

The source code for the machine learning algorithm used by this extension was created by [Nishit Patel](https://www.linkedin.com/in/nishitp/), a Data Scientist and Machine Learning professional at Google, and can be found here: https://github.com/nishitpatel01/Fake_News_Detection. 

## Using the Extension

The following steps explain how to install and use this extension:

1. Download this repository

    `git clone https://github.com/wdreames/facebook_misinformation_detector.git`

2. Open the Chrome Extensions developer console. Enter `chrome://extensions/` into a Chrome window. You should be able to see a page similar to this:

    ![](images/chrome-developer-console.png)

    Make sure the `Developer mode` button is switched on:

    ![](images/developer-mode.png)

3. Click on `Load Unpacked`

    ![](images/load-unpacked.png)

    